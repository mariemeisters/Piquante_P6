const Sauce = require('../models/Sauce'); 

/**
 * Recherche dans la BDD l'_id correspondant à la sauce likée -- Selon cette sauce et ses info : 
 * 1ère option (l'utilisateur a déjà like) :
 *      Méthode includes() - détermine si "usersLiked" contient l'userID de l"utilisateur qui souhaite like la sauce
 *      incrémente ($inc) -1 like et supprime ($pull) l'userID de la BDD "usersLiked" - condition qui empêchera d'ajouter plusieurs likes
 * 2ème option (l'utilisateur n'a jamais like car il ne remplis pas la condition précédente) : le like vaux 1 
 *      incrémente ($inc) le like dans la BDD et ajoute ($push) l'userID de l'utilisateur dans "usersLiked"
 * 3ème option (L'utilisateur a déjà dislike) : 
 *      Méthode includes() - détermine si "usersDisliked" contient l'userID de l"utilisateur qui souhaite dislike la sauce
 *      incrémente ($inc) -1 like et supprime ($pull) l'userID de la BDD "usersDisliked" - condition qui empêchera d'ajouter plusieurs dislikes
 * 4ème option (l'utilisateur n'a jamais dislike car il ne remplis pas la condition précédente) : le like vaux -1
 *      incrémente ($inc) le dislike dans la BDD et ajoute ($push) l'userID de l"utilisateur dans "usersdisliked"
 */
exports.likeOrDislike = (req, res, next) =>{
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.usersLiked.includes(req.body.userId)) {
                Sauce.updateOne({_id: req.params.id},
                    { 
                        $inc: {likes: -1}, 
                        $pull: {usersLiked: req.body.userId} 
                    })
                .then(() => { res.status(200).json({ message: 'Votre like est supprimé !' }) })
                .catch(error => res.status(400).json({ error }));
            }
            
            else if (req.body.like === 1) {
                Sauce.updateOne({ _id: req.params.id },
                    { 
                        $inc: { likes: 1 }, 
                        $push: { usersLiked: req.body.userId } 
                    })
                .then(() => res.status(200).json({ message: 'Votre like est ajouté !' }))
                .catch(error => res.status(400).json({ error }))
            }
            
            else if (sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id },
                    { 
                        $inc: { dislikes: -1 }, 
                        $pull: { usersDisliked: req.body.userId } 
                    })
                .then(() => { res.status(200).json({ message: 'Vore dislike est supprimé !' }) })
                .catch(error => res.status(400).json({ error }));
            } 
            
            else if (req.body.like === -1) {
                Sauce.updateOne({ _id: req.params.id },
                    { 
                        $inc: {dislikes: 1}, 
                        $push: {usersDisliked: req.body.userId} 
                    })
                .then(() => res.status(200).json({ message: 'Votre dislike est ajouté !' }))
                .catch(error => res.status(400).json({error}));
            }
        })
        .catch(error => res.status(400).json({ error }));
}
