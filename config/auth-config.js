var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var User = require("../models/user");

var facebookConfig = {
	clientID : "your-consumer-key-here",
	clientSecret : "your-client-secret-here",
	callbackURL : "http://drawingnodeapp.herokuapp.com/login/facebook/callback",
    profileFields: ['id', 'displayName', 'emails','photos'],
    passReqToCallback : true
};

var twitterConfig = {
    'clientID'       : 'your-consumer-key-here',
    'clientSecret'    : 'your-client-secret-here',
    'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
};

var googleConfig = {
    'clientID'       : 'your-consumer-key-here',
    'clientSecret'    : 'your-client-secret-here',
    'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
};


var facebookInit = function(req, token, refreshToken, profile, callback) {


	User.findOne( { "facebook.id" : profile.id }, function(err, existingUser) {
		if (err) {
			return callback(err);
		}

		if (existingUser) {
			return callback(null, existingUser);
		}

		var user = (req.user) ? req.user : new User();

		

		user.facebook.id = profile.id;
		user.facebook.token = token;
		user.facebook.email = profile.emails;
        user.facebook.name =  profile.displayName;
        user.facebook.photos = profile.photos[0].value;


		user.save(function(err) {
			if (err) {
				throw err;
			}

			return callback(null, user);
		});
	});
};

passport.use(new FacebookStrategy(facebookConfig, facebookInit));

passport.serializeUser(function(user, callback) {
	callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
	User.findById(id, function(err, user) {
		callback(err, user);
	});
});

module.exports = {
	facebookLogin: passport.authenticate("facebook", { scope: "email" }),
	facebookCallback: passport.authenticate("facebook", {
        scope: "email",
		successRedirect : "/play",
		failureRedirect : "/login"
	})
};