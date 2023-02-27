const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function (request, response) {
    Post.findById(request.body.post, function (err, post) {
        if (err) { console.log('There is no post available for the comment'); return; }

        if (post) {
            Comment.create({
                content: request.body.content,
                post: request.body.post,
                user: request.user._id
            }, function (err, comment) {
                //handle error
                if (err) {
                    console.log('Comment could not be created', err);
                    return;
                }

                post.comments.push(comment); //update and save to memory
                post.save();    //saves to local

                response.redirect('/');
            });
        }
    })
}