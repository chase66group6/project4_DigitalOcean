// Authors Dillon Vaughan && Chase Sisson
// File: middleware.js
// Class: COP 3813
// Project 4
let middleware = {

    loginRequired: (req, res, next) => {
        if(req.user) {
            next();
        } else {
            res.redirect("/login");
        }
    },

    // loginRequired: function(req, res, next) {
    //     if(req.session.user) {
    //         next();
    //     } else {
    //         res.redirect("/login");
    //     }
    // },

    // populateFormData: function(req, res, next) {
    //     res.locals.searchActive = req.path === '/search';
    //     res.locals.reportActive = req.path === '/report';
    //     res.locals.adminActive = req.path.startsWith('/dashboard');
    //     res.locals.isAdmin = req.session.user && req.session.user.access === 'admin';
    //     res.locals.user = req.session.user;
    //     next();
    // },

    // flashMessages: function(req, res, next) {
    //     // if there's a flash message, transfer
    //     // it to the context, then clear it
    //     res.locals.flash = req.session.flash;
    //     delete req.session.flash;
    //     next();
    // }
};

module.exports = middleware;