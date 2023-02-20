module.exports.home = function (request, response) {
    console.log(request.cookies);

    return response.render('home', {
        title: "Home"
    });
    // return response.end('<h1>Home is here</h1>');
}