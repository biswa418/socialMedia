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
const passportLocal = require('./config/passport-local-strategy');

//mongoStore session cookies
const MongoStore = require('connect-mongo');
const sass = require('sass');
const fs = require('fs');
const path = require('path');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const srcDir = './assets/scss';
const destDir = './assets/css';

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
app.use(express.static('./assets'));
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
    secret: 'something', //key to encode and decode
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