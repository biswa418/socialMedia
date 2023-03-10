const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');

//new google strat
passport.use(new googleStrategy({
    clientID: "922267126569-1c1odogqr9v9r4gc1an1q4722a82vdsn.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) { console.log('Error in google strat passport', err); return; }

            // console.log(profile);

            if (user) {
                return done(null, user);
            } else {
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    avatar: profile.photos[0].value
                }, function (err, user) {
                    if (err) { console.log('Error in creating the user in google-strat-passport', err); return; }

                    return done(null, user);
                })
            }
        })
    }
))