const jwt = require('jsonwebtoken');

/**
 * prend le token envoyé par le client, vérifie la validité et permets au routes d'exploiter les info (userID)
 * Dans cette étape il peut se passer beaucoup d'erreur, try/catch les gères
 * Extraction du token du header Authorization de la requête entrante. 
 * split pour tout récupérer après l'espace dans le header (ignore bearer). Les erreurs générées ici s'afficheront dans le bloc catch
 * la méthode verify de JWT va décoder le token (on lui passe le token et la clé secrete). Les erreurs générées ici s'afficheront dans le bloc catch
 * Si tout est ok extraction de l'userID du token
 * rajoute la valeur userID à l’objet Request pour que les routes puissent l’exploiter
 * Si tout est ok l'utilisateur est authentifié et exécution de la requête à l'aide de la fonction next()
 */
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};