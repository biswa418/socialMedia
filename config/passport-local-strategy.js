const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},

    function (request, email, password, done) {
        //find a user and establish the identity
        // console.log('here');
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                request.flash('error', err);
                return done(err);
            }

            if (!user || user.password != password) {
                request.flash('error', 'Invalid Username/ Password');
                return done(null, false);
            }

            // console.log(user);
            return done(null, user);
        });
    }
));


//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//desrializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) { console.log('Error in finding user --> deserializing'); return done(err); }

        return done(null, user);
    });
});


//check if user is authenticated -- middleware
passport.checkAuthentication = function (request, response, next) {
    // if the user is signed in, then pass on the request to the next function
    if (request.isAuthenticated()) {
        return next();
    }

    //if not signed in
    return response.redirect('/users/sign-in');
}

//set the authentication
passport.setAuthenticatedUser = function (request, response, next) {
    if (request.isAuthenticated()) {
        //request.user contains the current session ...so sending it to the views
        response.locals.user = request.user;
    }

    next();
}

module.exports = passport;