const mongoose = require('mongoose');
/**
 *  intercepte les erreurs de mongoose pour en faire des erreurs http, c'est-à-dire des erreurs avec la propriété de code d'état
 */
let mongodbErrorHandler = require('mongoose-mongodb-errors');
// Création du model sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true},
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, required: true, default: 0},
    dislikes: { type: Number, required: true, default: 0},
    usersLiked: { type: Array, required: true},
    usersDisliked: { type: Array, required: true},
});
// gère les erreurs mongodb
sauceSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('Sauce', sauceSchema);