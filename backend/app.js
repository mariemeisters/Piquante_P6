const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires

const userRoutes = require('./routes/user_routes');
const sauceRoutes = require('./routes/sauce_routes');

const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.USER_MONGO}:${process.env.PASSWORD_MONGO}@cluster0.ggnxkz8.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => { // header pour CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes); // racine des routes lié à l'autentification
app.use('/images', express.static(path.join(__dirname, 'images'))); // express.static pour diriger les images vers le le répertoire (path pour chemin absolu)

module.exports = app;