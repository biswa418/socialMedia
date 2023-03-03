const Post = require('../models/post');
const User = require('../models/users');

module.exports.home = async function (request, response) {

    try {
        //populating the users on each post
        let posts = await Post.find({})
            .populate('user')
            .populate({    // have to populate comment as well as who commented
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });

        let users = await User.find({});

        return response.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });

    } catch (err) {
        console.log("error", err);
    }
}