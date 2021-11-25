import { gql } from '@apollo/client';

const GET_LIST = gql`
  query($pageNum: Int!) {
    PokemonList(pageNum: $pageNum) {
      name
      url
      id
    }
  }
`;

const GET_POKEMON = gql`
  query($id: ID!) {
    Pokemon(id: $id) {
      id
      name
      types
      back_default
      front_default
      back_shiny
      front_shiny
    }
  }
`;

let exported = {
  GET_LIST,
  GET_POKEMON,
};

export default exported;

