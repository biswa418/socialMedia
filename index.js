const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
//get layouts library
const expressLayouts = require('express-ejs-layouts');

//mongo
const db = require('./config/mongoose');
const session = require('express-session'); //session cookie
const passport = require('passport');       //auth
const env = require('./config/environment');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const googleAuth = require('./config/passport-google-oauth2-strategy');

//mongoStore session cookies
const MongoStore = require('connect-mongo');
const sass = require('sass');
const fs = require('fs');
const path = require('path');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//set up serverSide chatEngine
const chatServer = require('http').createServer(app);
const chatSocket = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat engine is up on 5000');

const srcDir = path.join(__dirname, env.asset_path, 'scss');
const destDir = path.join(__dirname, env.asset_path, 'css');

fs.readdir(srcDir, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    files.forEach(file => {
        if (!file.endsWith('.scss')) {
            return;
        }

        const filePath = path.join(srcDir, file);
        const outputFile = file.replace(/\.scss$/, '.css');
        const outputFilePath = path.join(destDir, outputFile);

        sass.render({
            file: filePath,
            outputStyle: 'compressed'
        }, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            fs.writeFile(outputFilePath, result.css.toString(), err => {
                if (err) {
                    console.error(err);
                } else {
                }
            });
        });
    });
    console.log(`SCSS compiled to CSS`);
});

//use post req parser
app.use(express.urlencoded({ extended: true }));

//use cookie parser 
app.use(cookieParser());

//include static files
app.use(express.static(env.asset_path));
//making sure the avatars folders are available for the browsers
app.use('/uploads', express.static(__dirname + '/uploads'));


//use the layouts
app.use(expressLayouts);
//inividual add styles
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//session --> save on mongoStore
app.use(session({
    name: 'codeial', //name of the cookie
    //change secret in prod
    secret: env.session_cookie_key, //key to encode and decode
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 100 * 60), //expiry of cookie in ms
        SameSite: 'None', //browser warns to deprecate it as a third party cookie
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/codial_development',
        autoRemove: 'disabled'
    },

        function (err) {
            console.log(err || 'connect-mongo set up working');
        }
    )
}));

//use passport
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//connect-flash use
app.use(flash());
app.use(customMware.setFlash);

//use express router to routes/
app.use('/', require('./routes'));


app.listen(port, function (err) {
    if (err) {
        console.log(`Could not start the server: ${err}`);
        return;
    }

    console.log(`Server is started on port: ${port}`);
});