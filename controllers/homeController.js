const Post = require('../models/post');

module.exports.home = function (request, response) {

    // return response.render('home', {
    //     title: "Home"
    // });
    // return response.end('<h1>Home is here</h1>');

    //populating the users on each post
    Post.find({}).populate('user').exec(function (err, posts) {
        if (err) { console.log('Could not pop posts'); return; }

        return response.render('home', {
            title: "Codeial | Home",
            posts: posts
        });
    })
}