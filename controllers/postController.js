const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function (request, response) {
    let post = Post.create({
        content: request.body.content,
        user: request.user._id
    },
        async function (err, post) {
            if (err) { request.flash('error', err); console.log('error in creating a post'); return; }

            // request.flash('success', "Post Created");


            if (request.xhr) {
                let hidPassPost = await Post.findById(post._id).populate('user', '-password');

                return response.status(200).json({
                    data: {
                        post: hidPassPost,
                    },
                    message: 'Post Created!!'
                })
            }

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

            if (request.xhr) {
                return response.status(200).json({
                    data: {
                        post_id: request.params.id,
                    },
                    message: 'Post deleted!!'
                })
            }

            return response.redirect('back');
        } else {
            return response.redirect('back');
        }
    } catch (err) {
        request.flash('error', 'You cannot delete the post!');
        return response.redirect('back');
    }
}