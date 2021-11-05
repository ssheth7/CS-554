const redis = require('redis');
const bluebird = require('bluebird');

const client = redis.createClient();

const showMethods = require("../data/shows.js")

bluebird.promisifyAll(redis.RedisClient.prototype);


const constructorMethod = (app) => {

    app.get('/show/:id', async(req, res) => {
        let id = req.params.id;
        try {
            if (!id) {
                throw "Id was not provided";
            }
            const show = await showMethods.getShow(id);

            let regex = /(&nbsp;|<([^>]+)>)/ig;
            if (show.summary) {
                show.summary = show.summary.replace(regex, "");
            } else {
                show.summary = "N/A";
            }
            if (!show.language) {
                show.language = "N/A";
            }
            if (!show.rating || !show.rating.average) {
                show.rating = { average: "N/A" };
            }
            if (!show.network.name) {
                show.network.name = "N/A";
            }
            if (!show.premiered) {
                show.premiered = "N/A";
            }

            res.render('show', { show: show }, async(err, html) => {
                await client.setAsync(id, html);
                res.send(html);
            });
        } catch (e) {
            res.status(404).render('error', { error: e });
        }
    });

    app.get('/', async(req, res) => {
        try {
            const shows = await showMethods.getAllShows();
            res.render("main", { shows: shows }, async(err, html) => {
                await client.setAsync('homepage', html);
                res.send(html);
            });

        } catch (e) {
            res.status(404).render('error', { error: e });
        }
    });

    app.post('/search', async(req, res) => {
        try {
            let searchTerm = req.body.search;
            if (!searchTerm) {
                throw "Valid search term not provided";
            }
            searchTerm = searchTerm.trim();

            const shows = await showMethods.searchShow(searchTerm);

            res.render('main', { shows: shows, search: true }, async(err, html) => {
                await client.setAsync(searchTerm, html);
                res.send(html);
            });

        } catch (e) {
            res.status(404).render('error', { error: e });
        }
    });

    app.get('/popularsearches', async(req, res) => {
        try {
            const searches = await client.zrevrangeAsync('searchSet', 0, 9, 'withscores');
            for (let i = 0; i < searches.length / 2; i++) {
                searches[i] = {
                    term: searches[i * 2],
                    numSearches: searches[i * 2 + 1]
                };
            }
            res.render('popular', { searches: searches.slice(0, searches.length / 2) });
        } catch (e) {
            res.status(404).render('error', { error: e });
        }
    });

    app.use('*', async(req, res) => {
        res.status(404).render('error', { error: "URL not found." });
    });
};

module.exports = constructorMethod;