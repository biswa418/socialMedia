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
module.exports.destroy = async function (request, response) {
    try {
        //find if post exists
        let post = await Post.findById(request.params.id);

        //if user id matches
        if (post.user == request.user.id) {
            post.remove();

            await Comment.deleteMany({ post: request.params.id });

            return response.redirect('back');
        } else {
            return response.redirect('back');
        }
    } catch (err) {
        console.log("error on deleting comments", err);
    }
}