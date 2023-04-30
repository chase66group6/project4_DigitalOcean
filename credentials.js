// Authors Dillon Vaughan && Chase Sisson
// File: credentials.js
// Class: COP 3813
// Project 3
module.exports = {
  cookieSecret: 'cookie',
  mongo: {
    development: {
      // connection to a private data base from mondo db
      connectionString: 'mongodb+srv://dillon:dyLgaPLzNG5IanKC@dillon-chase.f4avv0p.mongodb.net/?retryWrites=true&w=majority' // Defaults to localhost, change if using Mongodb Atlas
    },
    production: {
      // connection to a private data base from mondo db
      connectionString: 'mongodb+srv://dillon:dyLgaPLzNG5IanKC@dillon-chase.f4avv0p.mongodb.net/?retryWrites=true&w=majority'
    },
  }
}; 
