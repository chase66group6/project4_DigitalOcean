const mongoose = require('mongoose');

    const Favorite = mongoose.Schema({
      username: String,

    })
    
    const movieSchema = mongoose.Schema({
      usernameID: String,
      id: String,
      name: String,
      url: String,
      summary: String,
      image: String,
      isOnAir: String,
      isFavorite: Boolean,
    });
    mongoose.model('Movie', movieSchema);
    
    // module.exports = mongoose.model('User', userSchema);

