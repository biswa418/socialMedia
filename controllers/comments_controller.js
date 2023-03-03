const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (request, response) {

    try {
        let post = await Post.findById(request.body.post);

        if (post) {
            let comment = await Comment.create({
                content: request.body.content,
                post: request.body.post,
                user: request.user._id
            });

            post.comments.push(comment); //update and save to memory
            post.save();    //saves to local

            response.redirect('/');
        }
    } catch (err) {
        console.log('Error', err);
    }

}

module.exports.destroy = async function (request, response) {

    try {
        //find if comments exists
        let comment = await Comment.findById(request.params.id);

        if (comment.user == request.user.id) {
            let postId = comment.post;

            comment.remove();

            await Post.findByIdAndUpdate(postId, { $pull: { comments: request.params.id } });
            return response.redirect('back');

        } else {
            return response.redirect('back');
        }
    } catch (err) {
        console.log('Error', err);
    }

}