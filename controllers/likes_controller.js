const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function (request, response) {
    try {
        // likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;

        //check the query type
        if (request.query.type == 'Post') {
            likeable = await Post.findById(request.query.id).populate('likes');
        } else {
            likeable = await Comment.findById(request.query.id).populate('likes');
        }

        //if like already exists
        let existingLike = await Like.findOne({
            likeable: request.query.id,
            onModel: request.query.type,
            user: request.user._id
        });

        //if like already exists then delete it
        if (existingLike) {
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();

            deleted = true;

        } else {
            //else create it
            let newLike = await Like.create({
                user: request.user.id,
                likeable: request.query.id,
                onModel: request.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return response.status(200).json({
            message: 'Request successful',
            data: {
                deleted: deleted
            }
        });


    } catch (err) {
        console.log(err);
        return response.status(500).json({
            message: 'Internal Server error'
        });
    }
}