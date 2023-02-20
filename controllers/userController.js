const User = require('../models/users');

module.exports.profile = function (request, response) {
    if (request.cookies.user_id) {
        User.findById(request.cookies.user_id, function (err, user) {
            if (user) {
                return response.render('userProfile', {
                    title: "Profile",
                    user: user
                })
            } else {
                return response.redirect('/users/sign-in');
            }
        });
    } else {
        return response.redirect('/users/sign-in');
    }
}

//render the sign up page
module.exports.signup = function (request, response) {
    return response.render('user_sign_up', {
        title: "Codial | Sign up"
    });
}

//render the sign in page
module.exports.signin = function (request, response) {
    if (request.cookies.user_id) {
        return response.redirect('/users/profile');
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
    //steps
    // find the user

    User.findOne({ email: request.body.email }, function (err, user) {
        if (err) { console.log('error in finding user in signing in'); return }

        //handle user found
        if (user) {

            //handle if pw doesn't match
            if (user.password != request.body.password) {
                console.log("bad password");
                return response.redirect('back');
            }

            //handle session creation
            response.cookie('user_id', user.id);
            return response.redirect('/users/profile');

        } else {
            //handle user not found
            return response.redirect('back');
        }
    })
}

//user sign out
module.exports.resetSession = function (request, response) {
    //reset the cookie
    response.cookie('user_id', '');

    return response.redirect('/users/sign-in');
}