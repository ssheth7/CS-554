const axios = require('axios');

const exportedMethods = {
    async getAllShows() {
        const allShows = await axios.get('http://api.tvmaze.com/shows');
        return allShows.data;
    },

    async getShow(id) {
        if (!id) {
            throw "Id parameter was not provided";
        }
        const show = (await axios.get('http://api.tvmaze.com/shows/' + id)).data;
        if (!show) {
            throw "No data on id " + id;
        }
        let regex = /(&nbsp;|<([^>]+)>)/ig;

        if (show.summary) {
            show.summary = show.summary.replace(regex, "");
        }
        if (!show.language) {
            show.language = "N/A";
        }
        if (!show.rating || !show.rating.average) {
            show.rating = { average: "N/A" };
        }
        if (!show.network || !show.network.name) {
            show.network = { name: "N/A" };
        }
        if (!show.premiered) {
            show.premiered = "N/A";
        }
        return show;
    },

    async searchShow(search) {
        if (!search) {
            throw "Search term not provided";
        }
        search = search.trim();
        if (search.length == 0) {
            throw "search term is empty";
        }
        const searchResults = (await axios.get('http://api.tvmaze.com/search/shows?q=' + search)).data;
        return searchResults;
    },
};
module.exports = exportedMethods;