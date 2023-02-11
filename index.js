const express = require('express');
const app = express();
const port = 8000;

//mongo
const db = require('./config/mongoose');

//include static files
app.use(express.static('./assets'));

//get layouts library
const expressLayouts = require('express-ejs-layouts');

//use the layouts
app.use(expressLayouts);
//inividual add styles
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//use express router to routes/
app.use('/', require('./routes'));

//set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function (err) {
    if (err) {
        console.log(`Could not start the server: ${err}`);
        return;
    }

    console.log(`Server is started on port: ${port}`);
});