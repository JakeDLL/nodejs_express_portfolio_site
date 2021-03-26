// Import all necessary modules and data
const express = require('express');
const app = express();
const { projects } = require('./data.json');

// Added settings to express server
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

// Created Static express server that routes from '/static' to '/public'
app.use('/static', express.static('public'));

/**************
 * Main Routes
 **************/
app.get('/', (req, res) => {
    res.render('index', { projects });
});

app.get('/about', (req, res) => {
    res.render('about');
});

// This redirects the client to a random project if it didn't specify one
app.get('/project', (req, res) => {
    const randomProject = Math.floor(Math.random() * projects.length);
    res.redirect(`/project/${randomProject}`);
});

// This gets the request parameters to get the specific data and send it to the template
app.get('/project/:id', (req, res, next) => {
    const { id } = req.params;
    
    // If the request parameter is not a number or is higher than the actual number of projects, this creates and error and sends it to the error handlers.
    if ( isNaN(id) || id >= projects.length ) {
        return next(createError('Bad Request: No such project found', 400));
    }
    const project = projects[id];

    res.render('project', project);
});

/****************
 * Error Handlers
 ****************/

/**
 * 'createError' function
 * 
 * @param {string} msg - The message for the new Error object
 * @param {number} status = The server status code
 * @returns Returns a new Error object to error handlers
 */
function createError(msg, status) {
    const err = new Error(`${msg}`);
    err.status = status;
    return err;
}

// This is for 404 errors
app.use((req, res, next) => {
    next(createError('Page not found', 404));
});

// This serves up the error that has been passed to it
app.use((err, req, res, next) => {
    res.locals.error = err;
    // If the error does not have a status code, it provides a default one as well as a message
    res.status(err.status || 500);
    if (!res.locals.error.message) res.locals.error.message = `There is a problem with the server`;

    // This logs the error to the server console
    console.log(`${err.message} - (${err.status})`);

    res.render('error');
})

// Starts the server on port 3000
app.listen(3000, () => {
    console.log('The app is running on localhost:3000');
});