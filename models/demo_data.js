const mongoose = require('mongoose');
const User = mongoose.model('User');


module.exports = {

  

  addUsers: async () => {
    await User.create({
      username: 'Dillon',
      password: '$2a$10$0Wz99HToBXUkMjSCIviZMOHF5BIFHstEPaljYKB/nUtJRJjE1WE8y', 
    });

    await User.create({
      username: 'Chase',
      password: '$2a$10$0Wz99HToBXUkMjSCIviZMOHF5BIFHstEPaljYKB/nUtJRJjE1WE8y',
    });

    await User.create({
      username: 'Bob',
      password: '$2a$10$0Wz99HToBXUkMjSCIviZMOHF5BIFHstEPaljYKB/nUtJRJjE1WE8y',
    });

    await User.create({
      username: 'Tom',
      password: '$2a$10$0Wz99HToBXUkMjSCIviZMOHF5BIFHstEPaljYKB/nUtJRJjE1WE8y',
    });
  }
};