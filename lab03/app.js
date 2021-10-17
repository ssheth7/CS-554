const Promise = require('bluebird');
const exphbs = require('express-handlebars');
const express = require('express');
const redis = require('redis');

const app = express();

const client = redis.createClient();
const configRoutes = require('./routes');

Promise.promisifyAll(redis.RedisClient.prototype);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: false }));
app.set('view engine', 'handlebars');

app.get('/', async(req, res, next) => {
    const cachedHomePage = await client.getAsync('homepage');
    if (cachedHomePage) {
        res.send(cachedHomePage);
    } else {
        next();
    }
});

app.get('/show/:id', async(req, res, next) => {
    let id = req.params.id;
    if (!id) {
        next();
        return;
    }

    const cachedShowPage = await client.getAsync(id);
    if (cachedShowPage) {
        res.send(cachedShowPage);
    } else {
        next();
    }
});

app.post('/search', async(req, res, next) => {
    let searchTerm = req.body.search;
    if (!searchTerm) {
        next();
        return;
    }
    searchTerm = searchTerm.trim();

    const cachedSearch = client.getAsync(searchTerm);
    const incrementSearch = client.zincrbyAsync('searchSet', 1, searchTerm);
    const results = await Promise.all([cachedSearch, incrementSearch]);
    if (results[0]) {
        res.send(results[0]);
    } else {
        next();
    }


});
configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});