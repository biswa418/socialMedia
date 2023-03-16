const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');
const env = require('./environment');

//new google strat
passport.use(new googleStrategy({
    clientID: env.google_clientID,
    clientSecret: env.google_clientSecret,
    callbackURL: env.google_callbackURL
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