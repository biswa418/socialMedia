module.exports.home = function (request, response) {
    console.log(request.cookies);

    response.cookie('home_id', 5);

    return response.render('home', {
        title: "Home"
    });
    // return response.end('<h1>Home is here</h1>');
}