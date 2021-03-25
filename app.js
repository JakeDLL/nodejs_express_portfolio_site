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

app.get('/project/:id', (req, res) => {
    const { id } = req.params;
    const project = projects[id];

    res.render('project', { project });
});

app.listen(3000, () => {
    console.log('The app is running on localhost:3000');
});