const express = require('express');
const path = require('path');
const app = express();
const static = express.static(__dirname + '/public');

app.use('/public', static);

app.use('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

app.use('*', (req, res) => {
    res.sendStatus(404);
});


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});