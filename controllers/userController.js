module.exports.profile = function (request, response) {
    return response.render('userProfile', {
        title: "Profile"
    });
}