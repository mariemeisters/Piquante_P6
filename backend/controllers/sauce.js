const Sauce = require('../models/Sauce'); 
const fs = require('fs');

/**
 * Récupère la requête et la transforme la chaine de caractère en objet (parse)
 * supprime l'_id de l'objet, car un nouveau sera créé automatiquement par la BDD mongoDB
 * supprime l'userID de la requête (pour empêcher quelqu'un de modifier/supprimer un objet qui n'est pas le sien)
 * constante de création d'une nouvelle instance du modele sauce
 * l'objet contient tous les informations grâce à l'opérateur spread (...)
 * Intégration du UserId via le token d'authentification
 * Indique le chemin 
 * sauvegarde l'objet sauce dans la BDD + promesse de réponse et catch pour les erreurs
 */
exports.createSauce = (req, res, next) => { //post
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId, // decode l'userId du token et l'ajoute
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})}) // réponse sinon la requete expire 
    .catch(error => { res.status(400).json( { error })})
};

/**
 * sauceObjet = récupère les modifications effectuée en indiquant le nom d'hote pour l'image (dossier image)
 * Supression du champ _userId envoyé par le client afin d’éviter de changer son propriétaire 
 * Recherche dans la BDD l'_id en récupérant l'id de la sauce dans l'url 
 * Recherche dans la BDD Mongodb avec findOne() 
 * - suppression de l'ancienne image avec fs.unlink + filename (méthode split pour séparer le nom de fichier)
 * - mise à jour de la BDD avec UpdateOne() avec ce qui a été passé dans sauceObject
*/
exports.modifySauce = (req, res, next) => { // put
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then ((sauce) => {
            if (sauceObject.imageUrl != Sauce.imageUrl) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, function (err) {
                    if (err) throw err;
                    console.log('file deleted.');
                })
            }
        })
        .then(() => {
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce modifiée'}))
            .catch(error => res.status(401).json({error}));
        })
        .catch((error) => {
            res.status(400).json({error});
        });
    
};

/**
 * Methode FindOne avec l'ID que nous recevons comme paramètre pour accéder au sauce correspondante dans la base de données 
 * Vérification : si l'’utilisateur qui a fait la requête de suppression est bien celui qui a créé la sauce
 * méthode split du fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier
 * fs.unlink du package fs pour supprimer ce fichier
 * en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
 * Dans la promesse, supprime la sauce de la base de données
*/
exports.deleteSauce = (req, res, next) => { //delete
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
  };

/**
 * Recherche dans la BDD toutes les sauces
 */
exports.getAllSauce = (req, res, next) => { //get
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  }

/**
 * Recherche dans la BDD l'id qui est le même que l'id de l'objet selectionné (parametre de requête :id)
 */
exports.getOneSauce = (req, res, next) => { // get
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

