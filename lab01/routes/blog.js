const express = require('express');

const blogMethods = require('../data/blogs');
const validateMethods = require('../data/validate');
let { ObjectId } = require('mongodb');

const router = express.Router();

router.delete('/:blogId/:commentId', async(req, res) => {
    let blogId = req.params.blogId;
    let commentId = req.params.commentId;

    try {
        if (!blogId) {
            throw "Id parameter not provided";
        }
        new ObjectId(blogId);

        if (!commentId) {
            throw "Id parameter not provided";
        }
        new ObjectId(commentId);

        const updatedArticle = await blogMethods.removeComment(blogId, commentId, req.session.user);
        res.status(200).json(updatedArticle);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.get('/logout', async(req, res) => {
    try {
        if (req.session && req.session.user) {
            req.session.destroy();
            res.clearCookie();
            res.status(200).json({ response: "You have successfully been logged out." });
        } else {
            res.status(400).json({ error: "You are not logged in." });
        }
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.get('/', async(req, res) => {
    try {

        let skip, take;
        let query = {};

        if (req.query.skip) {
            skip = parseInt(req.query.skip, 10);
            query.skip = skip;
        }

        if (req.query.take) {
            take = parseInt(req.query.take, 10);
            query.take = take;
        }

        if (req.query && !validateMethods.isValidQueryNumber(skip) && !validateMethods.isValidQueryNumber(req.query.skip)) {
            throw "Query parameter skip in invalid format";
        }
        if (req.query && !validateMethods.isValidQueryNumber(take) && !validateMethods.isValidQueryNumber(req.query.take)) {
            throw "Query parameter take in invalid format";
        }
        const allArticles = await blogMethods.getAllArticles(query);
        res.json(allArticles);

    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.get('/:id', async(req, res) => {
    try {
        if (!req.params.id) {
            throw "Id parameter not provided!";
        }
        let id = new ObjectId(req.params.id);
        const article = await blogMethods.getArticle(id);
        res.status(200).json(article);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.post('/', async(req, res) => {
    let article = req.body;
    try {
        if (!article || typeof(article) !== "object") {
            throw "Parameters not provided or not a valid body";
        }
        if (!validateMethods.isValidString(article.title)) {
            throw "Title parameter for provided or not a valid parameter";
        }
        if (!validateMethods.isValidString(article.body)) {
            throw "Body parameter for provided or not a valid parameter";
        }

        const articleDocument = await blogMethods.createArticle(article, req.session.user);
        res.status(201).json(articleDocument);

    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.put('/:id', async(req, res) => {
    let article = req.body;

    try {
        if (!req.params.id) {
            throw "Id parameter not provided!";
        }
        new ObjectId(req.params.id);
        if (!article || typeof(article) !== "object") {
            throw "Parameters not provided or not a valid parameter";
        }
        if (!validateMethods.isValidString(article.title)) {
            throw "Title parameter for provided or not a valid parameter";
        }
        if (!validateMethods.isValidString(article.body)) {
            throw "Body parameter for provided or not a valid parameter";
        }

        const articleDocument = await blogMethods.putArticle(article, req.params.id, req.session.user);
        res.status(201).json(articleDocument);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.patch('/:id', async(req, res) => {
    let article = req.body;
    try {
        if (!req.params.id) {
            throw "Id parameter not provided!";
        }
        new ObjectId(req.params.id);

        if (!article.body && !article.title) {
            throw "Body or title parameter have to be given";
        }

        if (article.body && !validateMethods.isValidString(article.body)) {
            throw "Body parameter is invalid";
        }
        if (article.title && !validateMethods.isValidString(article.title)) {
            throw "Title parameter is invalid";
        }

        const articleDocument = await blogMethods.patchArticle(article, req.params.id, req.session.user);
        res.status(201).json(articleDocument);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.post('/:id/comments', async(req, res) => {
    let comment = req.body;

    try {
        if (!comment && typeof(comment) !== 'object') {
            throw "Parameters not provided or not a valid body";
        }
        if (!req.params.id) {
            throw "Id parameter not provided";
        }
        new ObjectId(req.params.id);

        if (!validateMethods.isValidString(comment.comment)) {
            throw "Comment parameter not provided or not valid";
        }
        const commentDocument = await blogMethods.postComment(comment.comment, req.params.id, req.session.user);
        res.status(200).json(commentDocument);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});


router.post('/signup', async(req, res) => {
    const accountData = req.body;
    try {
        if (!accountData || typeof(accountData) !== "object") {
            res.status(400).json({ error: 'Parameters not given!' });
            return;
        }

        if (!validateMethods.isValidString(accountData.name)) {
            res.status(400).json({ error: 'Name parameter not provided or not a valid parameter' });
            return;
        }

        if (!validateMethods.isValidString(accountData.username)) {
            res.status(400).json({ error: 'Username parameter not provided or not a valid parameter' });
            return;
        }

        if (!validateMethods.isValidString(accountData.password)) {
            res.status(400).json({ error: 'Password parameter not provided or not a valid parameter' });
            return;
        }

        let signUpResult = await blogMethods.signup(accountData);
        res.status(201).json(signUpResult);

    } catch (e) {
        res.status(400).json({ error: e });
    }

});

router.post('/login', async(req, res) => {
    const accountData = req.body;
    try {
        if (!accountData || typeof(accountData) !== "object") {
            res.status(400).json({ error: 'Parameters not given!' });
            return;
        }

        if (!validateMethods.isValidString(accountData.username)) {
            res.status(400).json({ error: 'Username parameter not provided or not a valid parameter' });
            return;
        }

        if (!validateMethods.isValidString(accountData.password)) {
            res.status(400).json({ error: 'Password parameter not provided or not a valid parameter' });
            return;
        }

        let loginResult = await blogMethods.login(accountData);
        req.session.user = {
            _id: loginResult._id,
            username: loginResult.username,

        };
        res.cookie("Authcookie");

        res.status(200).json(loginResult);

    } catch (e) {
        res.status(400).json({ error: e });
    }
});


module.exports = router;