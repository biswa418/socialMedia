const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    console.log('Inside new comment mailer');
    let htmlString = nodeMailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'biswajeetsutar418@gmail.com', //sender email
        to: comment.user.email,
        subject: "New comment added to your post on Codeial",
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