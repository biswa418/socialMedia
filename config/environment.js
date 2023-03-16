

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
    google_clientID: "922267126569-1c1odogqr9v9r4gc1an1q4722a82vdsn.apps.googleusercontent.com",
    google_clientSecret: "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",
    google_callbackURL: "http://localhost:8000/users/auth/google/callback",
    jwt_key: 'codeial'
}


const prodution = {
    name: 'production'
}

module.exports = development;