const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},

    function (email, password, done) {
        //find a user and establish the identity
        console.log('here');
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                console.log('Error in finding user --> Passport');
                return done(err);
            }

            if (!user || user.password != password) {
                console.log('Invalid Username/ Password');
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



module.exports = passport;