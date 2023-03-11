const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    console.log('Inside new comment mailer');

    nodeMailer.transporter.sendMail({
        from: 'example@gmail.com', //sender email
        to: comment.user.email,
        subject: "New comment added to your post on Codeial",
        html: "<h1> Hello World, Comments added </h1>"
    },
        (err, info) => {
            if (err) {
                console.log('Error in sending the mail', err);
                return;
            }

            console.log('Mail has been sent', info);
        }
    );
}