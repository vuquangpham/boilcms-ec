// dependencies
require('dotenv').config({path: '.env'});
const {address} = require("ip");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const minifyHTML = require('express-minify-html');
const cookieParser = require('cookie-parser');

// routing
const adminRouting = require('./routes/admin');
const registerRouting = require('./routes/register');
const defaultRouting = require('./routes/default');
const errorHandler = require('./routes/404');

// configs
const {ADMIN_URL, REGISTER_URL} = require("./core/utils/config.utils");
const {connectDatabase} = require("./core/utils/database.utils");
const {globalMiddleware, authenticateUser} = require("./core/utils/middleware.utils");

// Init app
const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// minify html from view engine
// todo: please check it after done the project
app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Cookie-parser middleware
app.use(cookieParser());

// Set up static file
app.use(express.static(path.join(__dirname, 'public')));

// global middleware
app.use(globalMiddleware);

// global authentication
app.use(authenticateUser);

// admin routing
app.use('/' + ADMIN_URL, adminRouting);

// register account routing
app.use('/' + REGISTER_URL, registerRouting);

// front end page
app.use('/', defaultRouting);

// error handler
app.use(errorHandler);

// Connect to server
connectDatabase()
    .then(_ => {
        const PORT = process.env.PORT;
        app.listen(PORT, _ => {
            console.log(`Example server listening at http://localhost:${PORT} - http://${address()}:${PORT}`);
        });
    })
    .catch(err => {
        console.error(err);
    });