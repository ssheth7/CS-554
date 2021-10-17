const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(
    session({
        name: 'lab1',
        secret: "OwO whats this",
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 60000 }
    })
);

app.use('*', (req, res, next) => {
    let authenticated = " (Non-Authenticated User)";
    if (req.session && req.session.user) {
        authenticated = " (Authenticated User)";
    }
    console.log("[" + (new Date().toUTCString()) + "] " + req.method + " " + req.originalUrl + authenticated);
    next();
});

app.post('/blog', (req, res, next) => {
    if (req.session && req.session.user) {
        next();
        return;
    }
    res.status(403).json({ error: "Forbidden, not logged in" });
});

app.put('/blog/:id', (req, res, next) => {
    if (req.session && req.session.user) {
        next();
        return;
    }
    res.status(403).json({ error: "Forbidden, not logged in" });
});

app.patch('/blog/:id', (req, res, next) => {
    if (req.session && req.session.user) {
        next();
        return;
    }
    res.status(403).json({ error: "Forbidden, not logged in" });
});

app.post('/blog/:id/comments', (req, res, next) => {
    if (req.session && req.session.user) {
        next();
        return;
    }
    res.status(403).json({ error: "Forbidden, not logged in" });

});

app.delete('/blog/:id/comments', (req, res, next) => {
    if (req.session && req.session.user) {
        next();
        return;
    }
    res.status(403).json({ error: "Forbidden, not logged in" });

});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});