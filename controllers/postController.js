const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function (request, response) {
    Post.create({
        content: request.body.content,
        user: request.user._id
    },
        function (err, post) {
            if (err) { console.log('error in creating a post'); return; }

            return response.redirect('back');
        });
}

//delete the post
module.exports.destroy = function (request, response) {

    //find if post exists
    Post.findById(request.params.id, function (err, post) {

        //if user id matches
        if (post.user == request.user.id) {
            post.remove();

            Comment.deleteMany({
                post: request.params.id
            },
                function (err,) {
                    return response.redirect('back');
                })
        } else {
            return response.redirect('back');
        }
    });
}