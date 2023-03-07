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

            if (request.xhr) {
                let hidPassComment = await Comment.findById(comment._id).populate('user', '-password').populate('post');

                return response.status(200).json({
                    data: {
                        comment: hidPassComment
                    },
                    message: 'Comments added!!'
                });
            }

            // request.flash('success', "Post Created");
            response.redirect('/');
        }
    } catch (err) {
        request.flash('error', err);
        console.log('Error', err);
    }

}

module.exports.destroy = async function (request, response) {

    try {
        //find if comments exists
        let comment = await Comment.findById(request.params.id).populate('post').populate('user', '-password');

        if (comment.user._id == request.user.id || comment.post.user == request.user.id) {
            let postId = comment.post;

            comment.remove();

            await Post.findByIdAndUpdate(postId, { $pull: { comments: request.params.id } });

            if (request.xhr) {
                return response.status(200).json({
                    data: {
                        comment_id: request.params.id,
                    },
                    message: 'Comment deleted!!'
                });
            }

            // request.flash('success', "Comment Deleted");
            return response.redirect('back');

        } else {
            request.flash('error', "Cannot delete comment!");
            return response.redirect('back');
        }
    } catch (err) {
        console.log('Error', err);
    }

}