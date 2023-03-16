const User = require('../../../models/users');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function (request, response) {
    try {
        let user = await User.findOne({ email: request.body.email });

        if (!user || user.password != request.body.password) {
            return response.status(422).json({
                message: "Invalid username or password"
            });
        }

        return response.status(200).json({
            message: "Sign in success!! Keep the token handy.",
            data: {
                token: jwt.sign(user.toJSON(), env.jwt_key, { expiresIn: '300000' }),
            }
        })

    } catch (err) {
        console.log('**********', err);
        return response.status(500).json({
            message: "Internal Server error"
        })
    }
}