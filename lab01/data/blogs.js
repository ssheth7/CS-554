const bcrypt = require('bcrypt');
const mongoCollections = require('../config/mongoCollections');
const articles = mongoCollections.articles;
const users = mongoCollections.users;
const validateMethods = require('../data/validate');
const { ObjectId } = require('mongodb');

const exportedMethods = {
    // Gets articles based on query
    async getAllArticles(query) {
        let numArticles = 20;
        let skip = 0;

        const articlesCollection = await articles();
        let allArticles = await articlesCollection.find({}).toArray();


        if (!query) {
            return allArticles.slice(0, numArticles);
        }

        if (query && !validateMethods.isValidQueryNumber(query.skip) && !validateMethods.isValidQueryNumber(query.take)) {
            throw "Query parameter skip in invalid format";
        }
        if (query.skip) {
            skip = query.skip;
        }
        if (skip > allArticles.length) {
            return [];
        }

        if (query && !validateMethods.isValidQueryNumber(query.take) && !validateMethods.isValidQueryNumber(query.take)) {
            throw "Query parameter take in invalid format";
        }
        if (query.take == 0) {
            return {};
        }
        if (query.take > 0) {
            numArticles = query.take;
        }

        if (numArticles > 100) {
            numArticles = 100;
        }
        allArticles = allArticles.slice(skip, skip + numArticles);
        for (let i = 0; i < allArticles.length; i++) {
            allArticles[i]._id = allArticles[i]._id.toString();
        }
        return allArticles;
    },
    // Gets article based on id
    async getArticle(id) {
        if (!id) {
            throw "Id parameter not provided!";
        }
        const articlesCollection = await articles();
        const article = await articlesCollection.findOne({ _id: new ObjectId(id) });
        if (!article) {
            throw "Article with given id not found";
        }
        article._id = article._id.toString();
        return article;
    },
    // Creates article given article params and user
    async createArticle(article, user) {
        // Validate article parameter
        if (!article || typeof(article) !== "object") {
            throw "Parameters not provided or not a valid parameter";
        }
        if (!article.title && !validateMethods.isValidString(article.title)) {
            throw "Title parameter for provided or not a valid parameter";
        }
        article.title = article.title.trim();
        if (!article.body && !validateMethods.isValidString(article.body)) {
            throw "Body parameter for provided or not a valid parameter";
        }
        article.body = article.body.trim();
        // Validate user parameter
        if (!user || typeof(user) !== "object") {
            throw "User parameter is not provided";
        }
        if (!user._id) {
            throw "User id parameter is not provided"
        }
        user._id = new ObjectId(user._id);
        if (!validateMethods.isValidString(user.username)) {
            throw "User username parameter is not valid";
        }
        // Check if user exists
        const usersCollection = await users();

        let query = {
            username: user.username,
            _id: user._id
        };
        const findExistingUser = await usersCollection.findOne(query);
        if (!findExistingUser) {
            throw "Account does not exist";
        }
        // Submit article document to database
        let articleDocument = {
            title: article.title,
            body: article.body,
            userThatPosted: query,
            comments: []
        };
        // Insert Article into DB
        const articlesCollection = await articles();
        const insertInfo = await articlesCollection.insertOne(articleDocument);
        if (insertInfo.insertedCount === 0) {
            throw "Could not insert article into database";
        }
        insertInfo.ops[0]._id = insertInfo.ops[0]._id.toString();
        return insertInfo.ops[0];
    },
    // Updates article given article params, id, and user
    async putArticle(article, id, user) {
        // Validate article parameter
        if (!article || typeof(article) !== "object") {
            throw "Parameters not provided or not a valid parameter";
        }
        if (!article.title && !validateMethods.isValidString(article.title)) {
            throw "Title parameter for provided or not a valid parameter";
        }
        article.title = article.title.trim();
        if (!article.body && !validateMethods.isValidString(article.body)) {
            throw "Body parameter for provided or not a valid parameter";
        }
        article.body = article.body.trim();

        // Validate user parameter
        if (!user || typeof(user) !== "object") {
            throw "User parameter is not provided";
        }
        if (!user._id) {
            throw "User id parameter is not provided"
        }
        user._id = new ObjectId(user._id);
        if (!validateMethods.isValidString(user.username)) {
            throw "User username parameter is not valid";
        }
        // Check if user exists
        const usersCollection = await users();

        const findExistingUser = await usersCollection.findOne(user);
        if (!findExistingUser) {
            throw "Account does not exist";
        }

        // Check if article is written by logged in user
        const articlesCollection = await articles();
        let articleQuery = {
            _id: new ObjectId(id),
            "userThatPosted.username": user.username,
        };
        let existingArticle = await articlesCollection.updateOne(
            articleQuery, {
                $set: {
                    title: article.title,
                    body: article.body
                }
            }
        );
        if (!existingArticle.matchedCount) {
            throw "Article with given id and user does not exist";
        }
        if (!existingArticle.modifiedCount) {
            throw "Article could not be updated";
        }

        let updatedArticle = await this.getArticle(id);
        updatedArticle._id = updatedArticle._id.toString();
        return updatedArticle;
    },
    // Updates article given article parans, id, and user
    async patchArticle(article, id, user) {
        // Validates article parameter
        if (!article.body && !article.title) {
            throw "Body or title parameter have to be given";
        }

        if (article.body && !validateMethods.isValidString(article.body)) {
            throw "Body parameter is invalid";
        }
        if (article.title && !validateMethods.isValidString(article.title)) {
            throw "Title parameter is invalid";
        }
        // Validates user parameter
        if (!user || typeof(user) !== "object") {
            throw "User parameter is not provided";
        }
        if (!user._id) {
            throw "User id parameter is not provided"
        }
        user._id = new ObjectId(user._id);
        if (!validateMethods.isValidString(user.username)) {
            throw "User username parameter is not valid";
        }
        // Check if user exists
        const usersCollection = await users();

        const findExistingUser = await usersCollection.findOne(user);
        if (!findExistingUser) {
            throw "Account does not exist";
        }

        // Check if article is written by logged in user
        const articlesCollection = await articles();
        let articleQuery = {
            _id: new ObjectId(id),
            "userThatPosted.username": user.username,
        };
        let articleUpdate = {};
        if (article.title) {
            articleUpdate.title = article.title.trim();
        }
        if (article.body) {
            articleUpdate.body = article.body.trim();
        }
        let existingArticle = await articlesCollection.updateOne(
            articleQuery, { $set: articleUpdate }
        );
        if (!existingArticle.matchedCount) {
            throw "Article with given id and user does not exist";
        }
        if (!existingArticle.modifiedCount) {
            throw "Article could not be updated";
        }

        let updatedArticle = await this.getArticle(id);
        updatedArticle._id = updatedArticle._id.toString();
        return updatedArticle;

    },
    // Adds comment to article
    async postComment(comment, id, user) {
        if (!validateMethods.isValidString(comment)) {
            throw "Comment parameter is invalid";
        }

        if (!id) {
            throw "Id parameter is not provided";
        }

        // Validates user parameter
        if (!user || typeof(user) !== "object") {
            throw "User parameter is not provided";
        }
        if (!user._id) {
            throw "User id parameter is not provided"
        }
        user._id = new ObjectId(user._id);
        if (!validateMethods.isValidString(user.username)) {
            throw "User username parameter is not valid";
        }
        // Check if user exists
        const usersCollection = await users();

        const findExistingUser = await usersCollection.findOne(user);
        if (!findExistingUser) {
            throw "Account does not exist";
        }

        // Check if article is written by logged in user
        const articlesCollection = await articles();

        const commentDocument = {
            _id: new ObjectId(),
            userThatPosted: user,
            comment: comment.trim(),
        };

        const insertCommentInfo = await articlesCollection.updateOne({ _id: new ObjectId(id) }, {
            $push: {
                comments: commentDocument,
            }
        });

        if (!insertCommentInfo.matchedCount || !insertCommentInfo.modifiedCount) {
            throw "Could not update article with comment";
        }
        return commentDocument;
    },
    // Removes comment from article
    async removeComment(blogId, commentId, user) {
        if (!blogId) {
            throw "Id parameter not provided";
        }
        blogId = new ObjectId(blogId);

        if (!commentId) {
            throw "Id parameter not provided";
        }
        commentId = new ObjectId(commentId);

        // Validates user parameter
        if (!user || typeof(user) !== "object") {
            throw "User parameter is not provided";
        }
        if (!user._id) {
            throw "User id parameter is not provided"
        }
        user._id = new ObjectId(user._id);
        if (!validateMethods.isValidString(user.username)) {
            throw "User username parameter is not valid";
        }
        // Check if user exists
        const usersCollection = await users();

        const findExistingUser = await usersCollection.findOne(user);
        if (!findExistingUser) {
            throw "Account does not exist";
        }
        // Check if article is written by logged in user
        const articlesCollection = await articles();
        const articleDocument = await articlesCollection.findOne({ _id: blogId, "comments._id": commentId });
        if (!articleDocument) {
            throw "Document does not exist with that blogId and commentId";
        }

        // Remove comment from db
        const removeCommentInfo = await articlesCollection.updateOne({ _id: blogId }, {
            $pull: {
                comments: { _id: commentId, "userThatPosted._id": user._id }
            }
        });
        // Check if comment was successfully removed
        if (!removeCommentInfo.matchedCount || !removeCommentInfo.modifiedCount) {
            throw "Could not remove comment";
        }
        return await this.getArticle(blogId.toString());
    },
    // Signs up a user given credentials
    async signup(user) {

        // Input validation        
        if (!validateMethods.isValidString(user.name)) {
            throw "Name parameter is not provided or not a valid parameter";
        }
        user.name = user.name.trim();
        if (!validateMethods.isValidString(user.username)) {
            throw "Username parameter is not provided or not a valid parameter";
        }
        user.username = user.username.trim();
        if (!validateMethods.isValidString(user.password)) {
            throw "Password parameter is not provided or not a valid parameter";
        }
        user.password = user.password.trim();

        // Find if username already exists
        const usersCollection = await users();

        const findExisting = await usersCollection.findOne({ username: user.username });

        if (findExisting) {
            throw "Account with username already exists";
        }

        const hashedPassword = await bcrypt.hash(user.password, 16);

        const userDocument = {
            name: user.name,
            username: user.username,
            password: hashedPassword
        };
        // Send user document into DB
        const insertInfo = await usersCollection.insertOne(userDocument);
        if (insertInfo.insertedCount === 0) {
            throw "Could not insert user into database";
        }
        const returnedUser = {
            _id: insertInfo.insertedId.toString(),
            name: userDocument.name,
            username: userDocument.username
        };
        return returnedUser;
    },
    // Logs in a user given credentials
    async login(user) {

        // Input validation        
        if (!validateMethods.isValidString(user.username)) {
            throw "Username parameter is not provided or not a valid parameter";
        }
        user.username = user.username.trim();
        if (!validateMethods.isValidString(user.password)) {
            throw "Password parameter is not provided or not a valid parameter";
        }
        user.password = user.password.trim();

        // Find if username already exists
        const usersCollection = await users();

        const findExistingUser = await usersCollection.findOne({ username: user.username });
        if (!findExistingUser) {
            throw "Account does not exist";
        }

        const compareHashes = await bcrypt.compare(user.password, findExistingUser.password);

        if (!compareHashes) {
            throw "Account does not exist";
        }

        let returnedUser = {
            _id: findExistingUser._id.toString(),
            username: findExistingUser.username,
        };

        return returnedUser;
    }
};

module.exports = exportedMethods;