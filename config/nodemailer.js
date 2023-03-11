const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');


//transporter
let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "random-username", //username
        pass: "random-gen-pw", //app password created on google
    },
});

//renderTemplate
let renderTemplate = (data, relativePath) => {
    let mailHTML;

    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function (err, template) {
            if (err) { console.log('Error in rendering template'); return; }

            mailHTML = template;
        }
    )

    return mailHTML;
}


module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}