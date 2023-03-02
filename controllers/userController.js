const User = require('../models/users');

module.exports.profile = function (request, response) {
    User.findById(request.params.id, function (err, user) {
        return response.render('userProfile', {
            title: "Profile",
            profile_user: user
        });
    });
}

//render the sign up page
module.exports.signup = function (request, response) {
    if (request.isAuthenticated()) {
        return response.redirect('/');
    }

    return response.render('user_sign_up', {
        title: "Codial | Sign up"
    });
}

//render the sign in page
module.exports.signin = function (request, response) {
    if (request.isAuthenticated()) {
        return response.redirect('/');
    }

    return response.render('user_sign_in', {
        title: "Codial | Sign in"
    });
}

//get the sign up data
module.exports.create = function (request, response) {
    if (request.body.password != request.body.confirm_pasword) {
        return response.redirect('back');
    }

    User.findOne({ email: request.body.email }, function (err, user) {
        if (err) { console.log('error in finding user in DB.', err); return; }

        if (!user) {
            User.create(request.body, function (err, user) {
                if (err) { console.log('Could not create user in DB.', err); return; }

                return response.redirect('/users/sign-in');
            });
        } else {
            return response.redirect('back');
        }
    })
}

//sign in and create a session
module.exports.createSession = function (request, response) {
    return response.redirect('/');
}

//sign out
module.exports.destroySession = function (request, response, next) {
    request.logout(function (err) {
        if (err) { return next(err); }
        response.redirect('/');
    });
}