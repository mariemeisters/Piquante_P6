// Importation d'express
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');
const likeCtrl = require('../controllers/like');

router.get('/', auth, sauceCtrl.getAllSauce); // récupère toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce);// Création d'une sauce, authentification, multer pour les images
router.get('/:id', auth, sauceCtrl.getOneSauce);// Affichage dynamique d'une sauce via son id
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // changement d'une sauce via son id, auth + multer
router.delete('/:id', auth, sauceCtrl.deleteSauce); // supprime la sauce via son id + authentification
router.post('/:id/like', auth, likeCtrl.likeOrDislike); // gère les likes/dislikes selon id

module.exports = router; 