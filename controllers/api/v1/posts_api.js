const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function (request, response) {
    let posts = await Post.find({})
        .sort({ createdAt: -1 })
        .populate('user', '-password')
        .populate({    // have to populate comment as well as who commented
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'user',
                select: '-password'
            }
        });

    return response.status(200).json({
        message: "List of posts",
        posts: posts
    });
}

module.exports.destroy = async function (request, response) {
    try {
        let post = await Post.findById(request.params.id).populate('user', '-password')
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'user',
                    select: '-password'
                }
            });

        post.remove();

        await Comment.deleteMany({ post: request.params.id });

        return response.status(200).json({
            data: {
                post: post,
            },
            message: 'Post and associated comments deleted!!'
        })

    } catch (err) {
        return response.status(500).json({
            message: "Internal server error!!"
        });
    }
}