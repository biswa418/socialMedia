const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access-log', {
    interval: '1d',
    path: logDirectory
});



const development = {
    name: 'development',
    asset_path: 'assets',
    session_cookie_key: 'something',
    db: 'codial_development',
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "random-username", //username
            pass: "random-gen-pw", //app password created on google
        },
    },
    google_clientID: "random", // id
    google_clientSecret: "avaanaknakna", // goggle client secret 
    google_callbackURL: "http://localhost:8000/users/auth/google/callback", //callback
    jwt_secret: 'any_secret_string',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream }
    }
}


const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.CODEIAL_SMTP_AUTH_EMAIL, //username
            pass: process.env.CODEIAL_SMTP_AUTH_PASS, //app password created on google
        },
    },
    google_clientID: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream }
    }
}

module.exports = eval(process.env.NODE_ENV) == undefined ? development : production;
