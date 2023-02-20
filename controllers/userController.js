const User = require('../models/users');

module.exports.profile = function (request, response) {
    return response.render('userProfile', {
        title: "Profile"
    });
}

//render the sign up page
module.exports.signup = function (request, response) {
    return response.render('user_sign_up', {
        title: "Codial | Sign up"
    });
}

//render the sign in page
module.exports.signin = function (request, response) {
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

}