const { ApolloServer, gql } = require('apollo-server');
const Promise = require('bluebird');
const uuid = require('uuid');
const axios = require('axios');
const redis = require('redis');
require('dotenv').config()

const client = redis.createClient();
Promise.promisifyAll(redis.RedisClient.prototype);

const typeDefs = gql`
  type Query {
    unsplashImages(pageNum: Int) : [ImagePost]
    binnedImages : [ImagePost]
    userPostedImages : [ImagePost]  
  } 

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }

  type Mutation {
    uploadImage (
      url: String!
      description: String
      posterName: String
    ): ImagePost
    updateImage (
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
    ): ImagePost
    deleteImage (
      id: ID!
    ): ImagePost
  }
`;

const resolvers = {
  Query: {
    unsplashImages: async (_, args) => {
      const accesskey = process.env.ACCESSKEY;
      const {data} = await axios.get(`https://api.unsplash.com/photos?page=${args.pageNum}&per_page=3&client_id=${accesskey}`);
      let images = [];
      for (let i = 0; i < data.length; i++) {
        images[i] = {
          id: args.pageNum + "-" + data[i].id,
          url: data[i].urls.raw,
          posterName: data[i].user.name,
          description: data[i].description,
          userPosted: false,
          binned: false
        };
        const cached = await client.getAsync(args.pageNum + "-" + data[i].id);
        if (cached) {
          images[i].binned = true;
        }
      }
      return images;
    },
    binnedImages: async () => {
      const binnedKeys = await client.smembersAsync('binned');
      let binned = [];
      for (let i = 0; i < binnedKeys.length; i++) {
        binned[i] = JSON.parse(await client.getAsync(binnedKeys[i]));
      }
      return binned;
    },
    userPostedImages: async () => {
      const userpostedIds = await client.smembersAsync('userposted');
      let userposted = [];

      for (let i = 0; i < userpostedIds.length; i++) {
          userposted[i] = JSON.parse(await client.getAsync(userpostedIds[i]));
      }
      return userposted;
    }
  },
  Mutation: {
    uploadImage: async (_, args) => {
      const url = args.url;
      const posterName = args.posterName;
      const description = args.description;
      const image = {
        url: url,
        posterName: posterName,
        description: description,
        binned: false,
        userPosted: true,
        id: uuid.v4()
      };
      await client.setAsync(image.id, JSON.stringify(image));
      await client.saddAsync('userposted', image.id);
      return image;
    }, 
    updateImage: async (_, args) => {
      const {id, url, posterName, description, userPosted, binned} = args;
      const image = {
        id, url, posterName, description, userPosted, binned
      };
      if (binned) {
        await client.setAsync(id, JSON.stringify(image));
        await client.saddAsync('binned', id);
        if (userPosted) {
          await client.saddAsync('binned', id);
        }
      }
      if (!binned) {
        if (!userPosted) {
          await client.delAsync(id);
          await client.sremAsync('binned', id);
        } else {
          await client.setAsync(id, JSON.stringify(image));
          await client.sremAsync('binned', id);
        }
      }

      return image;
    },
    deleteImage: async (_, args) => {
      const id = args.id;
      const image = JSON.parse(await client.getAsync(id));
      await client.delAsync(id);

      if (image.binned) {
        await client.sremAsync('binned', id);
      }
      if (image.userPosted) {
        await client.sremAsync("userposted", id);
      }
      image.binned = false;
      return image;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});