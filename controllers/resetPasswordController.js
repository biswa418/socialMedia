
const User = require('../models/users');
const Reset = require('../models/resetPassword');
const crypto = require('crypto');
const resetPassMailer = require('../mailer/resetpass_mailer');

module.exports.createSession = function (request, response) {
    return response.render('reset_initiate', {
        title: "Reset Password",
    });
}

module.exports.createToken = async function (request, response) {
    let accessToken = crypto.randomBytes(20).toString('hex');

    let user = await User.findOne({ email: request.body.email });

    if (!user) {
        request.flash('error', "User does not exist!");
        return response.redirect('back');
    }

    let resetToken = await Reset.create({
        user: user._id,
        accessToken: accessToken,
        isValid: true,
    });

    accessToken = await Reset.findById(resetToken._id).populate('user', '-password');

    // console.log(accessToken);
    resetPassMailer.newReset(accessToken);
    request.flash('success', "Email has been sent to the user to reset password!");

    return response.redirect('/users/sign-in');
}


module.exports.confirmPass = async function (request, response) {
    let accessToken = await Reset.findById(request.params.accessToken).populate('user', '-password');

    return response.render('reset_confirm', {
        title: "Codeial | Reset Password",
        accessToken: accessToken,
    });
}


module.exports.resetPass = async function (request, response) {
    if (request.body.password != request.body.confirm_password) {
        request.flash('error', "Password doesn't match. Try Again!");
        return response.redirect('back');
    }

    let reset = await Reset.findById(request.params.accessToken).populate('user', '-password');

    if (reset.isValid) {
        reset.updateOne({ isValid: false });

        let user = User.findById(reset.user._id);
        await user.updateOne({ password: request.body.password });

        request.flash('success', "User password updated successfully!");
    } else {

        request.flash('error', "accessToken expired! Try Again.");
        return response.redirect('/resetPassword/init');
    }

    return response.redirect('/users/sign-in');

}