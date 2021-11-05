const md5 = require('blueimp-md5');

module.exports = {
    generatePageUrl(req, page) {
        const publickey = "62a7eca96e28f092e088b8d4f7285865";
        const privatekey = "f97a18fc1eac169c5c2b415383611561def2339f";
        const ts = new Date().getTime();
        const stringToHash = ts + privatekey + publickey;
        const hash = md5(stringToHash);
        const limit = 100;
        const offset = limit * page;
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/';
        let url = baseUrl + req + '?limit=' + limit + '&offset=' + offset 
            + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        return url;
    },
    generateIdUrl(req) {
        const publickey = "62a7eca96e28f092e088b8d4f7285865";
        const privatekey = "f97a18fc1eac169c5c2b415383611561def2339f";
        const ts = new Date().getTime();
        const stringToHash = ts + privatekey + publickey;
        const hash = md5(stringToHash);
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/';
        let url = baseUrl + req + '?ts=' + ts + '&apikey=' + publickey 
            + '&hash=' + hash;
        console.log(url);
        return url;
    }
};
