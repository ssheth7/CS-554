const { ApolloServer, gql } = require('apollo-server');
const Promise = require("bluebird") 
const axios = require('axios');
const redis = require('redis');

const client = redis.createClient();
Promise.promisifyAll(redis.RedisClient.prototype);

const typeDefs = gql`
  type Query {
    PokemonList(pageNum: Int!) : [PokemonPage]
    Pokemon(id: ID!) : Pokemon
  } 

  type PokemonPage {
    name: String!
    url: String!
    id: Int!
  }
  type Pokemon {
    id: ID!
    name: String!
    types: [String]!
    back_default: String
    back_shiny: String
    front_default: String
    front_shiny: String
    }
  `;

const resolvers = {
  Query: {
    PokemonList: async (_, args) => {
      let page = args.pageNum;
      let key = `page${page}`;
      const cachedResults = await client.getAsync(key);
      if (cachedResults) {
        return JSON.parse(cachedResults);
      }
      let promises = [];
      const {results} = (await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=50&offset=${page * 50}`)).data;
      for (let i = 0; i < results.length; i++) {
        promises[i] =  axios.get(results[i].url);
      }
      let ids = await Promise.all(promises);
      for (let i = 0; i < ids.length; i++) {
        results[i].id = ids[i].data.id;
      }
      client.setAsync(key, JSON.stringify(results));
      return results;
    },
    Pokemon: async (_, args) => {
      let id = args.id;
      const cachedResult = await client.getAsync(id);
      if (cachedResult) {
        return JSON.parse(cachedResult);
      }
      let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
      const {data} = await axios.get(url);
      let types = [];
      for (let j = 0; j < data.types.length; j++) {
        types[j] = data.types[j].type.name;
      }
      let pokemon = {
        id: id,
        url: url,
        name: data.name,
        back_default: data.sprites.back_default,
        back_shiny: data.sprites.back_shiny,
        front_default: data.sprites.front_default,
        front_shiny: data.sprites.front_shiny,
        types: types
      }
      await client.setAsync(id, JSON.stringify(pokemon));
      return pokemon;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
