const express = require('express');
const app = express();
const { projects } = require('./data.json');

app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', { projects });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/project', (req, res) => {
    const randomProject = Math.floor(Math.random() * projects.length);
    res.redirect(`/project/${randomProject}`);
});

app.get('/project/:id', (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
        const err = new Error('Bad Request: No such project');
        err.status = 400;
        return next(err);
    }
    const project = projects[id];

    res.render('project', { project });
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    err.message = `Page does not exist`
    next(err);
})

app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status || 500);
    if (!res.locals.error.message) res.locals.error.message = `There is a problem with the server`;
    console.log(`${err.message} - (${err.status})`);
    res.render('error');
})

app.listen(3000, () => {
    console.log('The app is running on localhost:3000');
});