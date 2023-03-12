const nodeMailer = require('../config/nodemailer');

exports.newReset = (accessToken) => {
    let htmlString = nodeMailer.renderTemplate({ accessToken: accessToken }, '/resetPassword/resetPass.ejs');

    nodeMailer.transporter.sendMail({
        from: 'example@gmail.com', //sender email
        to: accessToken.user.email,
        subject: "Reset your password",
        html: htmlString
    },
        (err, info) => {
            if (err) {
                console.log('Error in sending the mail', err);
                return;
            }

            // console.log('Mail has been sent', info);
        }
    );
}