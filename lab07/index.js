const { ApolloServer, gql } = require('apollo-server');
const Promise = require("bluebird") 
const axios = require('axios');
const redis = require('redis');

const client = redis.createClient();
Promise.promisifyAll(redis.RedisClient.prototype);

const typeDefs = gql`
  type Query {
    PokemonList(pageNum: Int!) : [Pokemon]
    Pokemon(id: ID!) : Pokemon
  } 
  type Pokemon {
    id: ID!
    url: String!
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
      const {results} = (await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=25&offset=${page * 25}`)).data;
      for (let i = 0; i < results.length; i++) {
        promises[i] =  axios.get(results[i].url);
      }
      let pokemondata = await Promise.all(promises);
      for (let i = 0; i < pokemondata.length; i++) {
        results[i].id = pokemondata[i].data.id;
        let types = [];
        for (let j = 0; j < pokemondata[i].data.types.length; j++) {
          types[j] = pokemondata[i].data.types[j].type.name;
        }
        results[i].back_default  = pokemondata[i].data.sprites.back_default
        results[i].back_shiny    = pokemondata[i].data.sprites.back_shiny
        results[i].front_default = pokemondata[i].data.sprites.front_default
        results[i].front_shiny   = pokemondata[i].data.sprites.front_shiny
        results[i].types = types;
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
