const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
const typeDefs = gql`
  type Query {
    PokemonList(pageNum: Int) : [PokemonPage]
    Pokemon(id: ID!) : Pokemon
  } 

  type PokemonPage {
    name: String!
    url: String!
  }
  type Pokemon {
    id: ID!
    name: String!
    types: [String]
    sprites: Sprites!
  }
  type Sprites {
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
      const {results} = (await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=40&offset=${page * 40}`)).data;
      return results;
    },
    Pokemon: async (_, args) => {
      let id = args.id;
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
        sprites: {
          back_default: data.sprites.back_default,
          back_shiny: data.sprites.back_shiny,
          front_default: data.sprites.front_default,
          front_shiny: data.sprites.front_shiny
        },
        types: types
      }
      return pokemon;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
