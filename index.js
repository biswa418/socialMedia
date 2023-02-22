const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
//get layouts library
const expressLayouts = require('express-ejs-layouts');

//mongo
const db = require('./config/mongoose');

//session cookie
const session = require('express-session');
//auth
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//mongoStore session cookies
const MongoStore = require('connect-mongo');

//use post req parser
app.use(express.urlencoded({ extended: true }));

//use cookie parser 
app.use(cookieParser());

//include static files
app.use(express.static('./assets'));


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
        maxAge: (1000 * 100 * 60) //expiry of cookie in ms
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

//use express router to routes/
app.use('/', require('./routes'));


app.listen(port, function (err) {
    if (err) {
        console.log(`Could not start the server: ${err}`);
        return;
    }

    console.log(`Server is started on port: ${port}`);
});