const axios = require('axios');
const creds = require('../credentials');
const Favorite = require("../models/favorite")

const BASE_URL = "https://api.tvmaze.com";

const movieService = {

  search: async (term) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/shows?q=${term}`);
      if(response && response.data) {
        // console.log(response.data);
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error.response.data);
    }
  },

  addFavorite: async (req, res) => {
    try {
      // console.log(req.body);
      const newSave = await Favorite.create(req.body);
      // console.log(newSave);
      res.redirect('/');
    }catch (error) {
      console.log(error);
    }
  },

  removeFavorite: async (req, res) => {
    try {
      // console.log(req.body);
      // { showId: '9661', usernameID: '644b258d6ef5054644c1656a' }
      const deleteFav = await Favorite.deleteOne({
        usernameID: req.body.usernameID,
        showId: req.body.showId
      });
      console.log(deleteFav);
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = movieService;