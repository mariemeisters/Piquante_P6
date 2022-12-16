const multer = require('multer'); // middleware d'express
/**
 * Dictionnaire de type MIME 
 */
const MINE_TYPES = { // minetype génére l'extention du fichier
    'image/jpg' : 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

/**
 * Constante storage, passé à multer (diskStorage pour enregistrer les fichiers entrants sur le disque)
 * la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images ;
 * la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores 
 * appel de la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
 * renvoi le nom du fichier, ajoute un timestamp Date.now() et l'extention
 */
const storage = multer.diskStorage({
    destination:(req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extention = MINE_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extention);
    }, 
});

/**
 * exportation de l'élément multer configuré, en lui passant la constante storage 
 * single pour indiquer de gérer seulement les téléchargement de fichiers images  
 */
module.exports = multer({storage}).single('image');