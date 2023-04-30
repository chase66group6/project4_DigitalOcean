// Authors Dillon Vaughan && Chase Sisson
// File: app.js
// Class: COP 3813
// Project 4
const express = require('express');
let app = express();
const session = require("express-session");
const temp_data = require("./data/data.js");
const credentials = require("./credentials");
const mongoose = require('mongoose');
const path = require("path");
const passport = require('passport');
const movieService = require('./controllers/movieSearch');



// Flash plugin instead of doing it ourselves
const flash = require('connect-flash');
app.use(flash());

app.use(express.urlencoded({ extended: true}));
// set up handlebars view engine
let handlebars = require('express-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set("views", "./views");
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

// Mongoose and db setup
require("./models/db");
const Favorites = require("./models/favorite");

// Grab the user
const User = require("./models/user"); 


app.use(
	session({
	  resave: false,
	  saveUninitialized: false,
	  secret: credentials.cookieSecret,
	})
  );
  

// Start up passport
app.use(passport.initialize());
app.use(passport.session());

// Form handler and static files
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// This is the session section
app.use(require("cookie-parser")(credentials.cookieSecret));

// User static authenticate method of model in localStategy
passport.use(User.createStrategy());

// Use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// User defined middleware and controllers (route implementations)
const middleware = require("./lib/middleware.js")

const login = require('./controllers/login');

const showStatus = {
	RUNNING: "Running",
	ENDED: "Ended",
	};
	
	// remove HTML tags from the summary, probably put in a utils file later
	function removeHtmlTags(str) {
		if (str === null || str === "") return null;
			return str.replace(/<[^>]*>/g, "");
	  }

// login
app.get('/login', login.login);

// Process the login screen. Will redirect to the login page again, along with a failure flash message
app.post('/login',
passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),
login.processLogin);
 
app.post('/newUser', login.processRegister);

app.get("/", middleware.loginRequired, async (req, res) => {
	const results = await Favorites.find({usernameID: req.user.id}).lean();
	
	// console.log(results);
	const currentUser = {
		username: req.user?.username,
		usernameID: req.user?.id,
		favorites: results
	};

	// console.log(req.user);
	// console.log(currentUser);
	// console.log('I Made it');
	res.render("home",  { currentUser});
  });

app.post('/searchResults', middleware.loginRequired, async function(req, res) {
	// console.log(req.body?.userId);
	
	let favorites = await Favorites.find({usernameID: req.user.id}).lean();
	favorites = favorites.map(ele => parseInt(ele.showId));
	const results = await movieService.search(req.body.searchTerm);
	

	const currentUser = {
		username: req.user?.username,
		usernameID: req.user?.id
	};
	
	// console.log(results);
	if(results) {
		let movies = results.map((movie) => {
			return {
			  showId: movie.show.id, 
			  name: movie.show.name,
			  url: movie.show.url,
			  summary: removeHtmlTags(movie.show.summary),
			  image: movie.show.image?.original ? movie.show.image.original : null,
			  isOnAir: movie.show.status == showStatus.RUNNING,
			  isFavorite: false,
			};
		  });

		  movies = movies.map(movie => {
			if (favorites.includes(movie.showId)) {
				movie.isFavorite = true;	
			}
			
			return movie;
		});

		// console.log(movies);
		res.render('searchResults', {movies, currentUser});
	} else {
		res.render('400');
	}

});

app.post('/addFavorite',  middleware.loginRequired, movieService.addFavorite);

app.post('/removeFavorite', middleware.loginRequired, movieService.removeFavorite);

app.get('/logout', middleware.loginRequired, login.processLogout); // using the logout page

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
