const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Favorite = new Schema({
    usernameID: String,
    showId: String,
    name: String,
    url: String,
    summary: String,
    image: String,
    isOnAir: String,
    isFavorite: Boolean,
  });

module.exports = mongoose.model('Favorite', Favorite);