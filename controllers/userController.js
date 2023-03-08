const User = require('../models/users');
const fs = require('fs');
const path = require('path');

module.exports.profile = function (request, response) {
    User.findById(request.params.id, function (err, user) {
        return response.render('userProfile', {
            title: "Profile",
            profile_user: user
        });
    });
}

//update profile
module.exports.update = async function (request, response) {
    if (request.user.id == request.params.id) {

        // User.findByIdAndUpdate(request.params.id, request.body, function (err, user) {
        //     request.flash('success', 'User profile updated');
        //     return response.redirect('back');
        // });

        try {
            let user = await User.findById(request.params.id);
            User.uploadedAvatar(request, response, function (err) {
                if (err) { console.log('********Multer error'); }

                user.name = request.body.name;
                user.email = request.body.email;

                function fileExists(path) {
                    try {
                        fs.accessSync(path, fs.constants.F_OK);
                        return true;
                    } catch (err) {
                        return false;
                    }
                }


                if (request.file) {
                    //check if avatar already exists and file not deleted then proceed
                    if (user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar))) {
                        // for troubleshooting
                        // fs.readdir(path.join(path.join(__dirname, '..'), User.avatarPath), (err, files) => {
                        //     if (err) {
                        //         console.error(err);
                        //         return;
                        //     }
                        //     console.log(files);
                        // });

                        //sync use necessary as we're changing the var name -- get the thread and then move
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    //saving the path of the uploaded file in the user
                    user.avatar = User.avatarPath + '/' + request.file.filename;
                }

                user.save();
                request.flash('success', 'User profile updated');
                return response.redirect('back');

            });

        } catch (err) {
            request.flash('error', 'You cannot update the user details!');
            return response.redirect('back');
        }




    } else {
        request.flash('warning', 'User unauthorized!');
        return response.status(401).send('Unauthorized');
    }

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
        request.flash('error', "Password doesn't match. Try Again!");
        return response.redirect('back');
    }

    User.findOne({ email: request.body.email }, function (err, user) {
        if (err) { console.log('error in finding user in DB.', err); return; }

        if (!user) {
            User.create(request.body, function (err, user) {
                if (err) { console.log('Could not create user in DB.', err); return; }

                request.flash('success', 'User Created! Sign in to proceed!');
                return response.redirect('/users/sign-in');
            });
        } else {
            request.flash('warning', 'User already exist');
            return response.redirect('back');
        }
    })
}

//sign in and create a session
module.exports.createSession = function (request, response) {
    request.flash('success', 'Logged in successfully');
    return response.redirect('/');
}

//sign out
module.exports.destroySession = function (request, response, next) {

    request.logout(function (err) {
        if (err) { return next(err); }

        request.flash('success', 'You have been logged out!!');
        response.redirect('/');
    });
}