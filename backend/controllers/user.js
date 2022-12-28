const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // permets de créer un token encodé (avec l'userId)
// récupère le modele user
const User = require('../models/User');

/**
 * Préparation du regex pour le mdp (Minimum huit caractères, au moins une lettre et un chiffre), méthode test pour vérifier, si ok :
 * Appel de la fonction de hachage de bcrypt dans le mot de passe et  « sale » le mot de passe 10 fois -- chaîne de caractères aléatoires avant de calculer l'empreinte md5 
 * fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;
 * création d'un utilisateur et l'enregistrons dans la base de données 
 * réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec. 
 */
exports.signup = (req, res, next) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (passwordRegex.test(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({ 
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        res.status(400).json({ message: "Le mot de passe doit contenir minimum huit caractères, dont une lettre majuscule, une lettre minuscule et un chiffre"});
    }
};
/**
 * 
 * User (modèle Mongoose) et findOne() pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données :
 * Dans le cas contraire, erreur
 * Si l'e-mail correspond à un utilisateur existant :
 * fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données :
 * S'ils ne correspondent pas, renvoi une erreur, (message flou afin de ne pas laisser quelqu’un vérifier si une autre personne est inscrite)
 * S'ils correspondent, retourne un objet qui contient les info necessaire (id client)
 * fonction sign de jsonwebtoken pour encoder l'ID de l'utilisateur dans un token  
 * durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures.
 * renvoi du token au front-end avec la réponse
 */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) 
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password) // 
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },                 // 
                            process.env.SECRET_KEY,               // payload
                            { expiresIn: '24h' }                  //
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };