// Authors Dillon Vaughan && Chase Sisson
// File: login.js
// Class: COP 3813
// Project 4
const mongoose = require("mongoose");
const User = mongoose.model("User");
// const User = require("../models/models");

//Bycrypt
const bycrypt = require("bcrypt");

// login handles logging in, and logging out
const login = {
    // Redering the login page once clicked
    login: (req, res) => {
        res.render("login");
    },

    // what to do after logged in
    processLogin: (req, res) => {
        res.redirect('/');
    },
    

    processRegister: async (req, res) => {
        // If I have both passwords and they are equal to each other, proceed
        if(req.body.password && req.body.re_password && req.body.password === req.body.re_password) {
            // Make sure the other user info is in here
            if (req.body.username && req.body.password) {
                // console.log(req.body.password);
                await User.register(new User({username: req.body.username}),req.body.password);
                req.flash('info', 'Thanks for registering!');
            }
            res.redirect("/login");
        } else {
            req.flash('info', 'Your passwords must match');
            res.redirect('/login');
        }
    },
 
    // processing the logout 
    processLogout: (req, res) => {
        // deleting the session once logged out
        if (req.session && req.session.user) {
            delete req.session.user;
        }
        // Put a messsage saying you logged out
        req.session.flash = {
            type: "success",
            intro: "You're logged out",
            message: "You have been logged out."
        };
        // redirecting to the homepage 
        res.redirect('/login');
    }

    //createUser
}

module.exports = login;