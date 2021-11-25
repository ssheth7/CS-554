const addTrainer = (name) => (
  {
    type: 'CREATE_TRAINER',
    payload: { name }
  }
);  

const deleteTrainer = (id) => (
  {
    type: 'DELETE_TRAINER',
    payload: { id }
  }
);

const selectTrainer = (id) => (
  {
    type: 'SELECT_TRAINER',
    payload: { id }
  }
);
const addPokemon = (pokemonid) => (
  {
    type:'ADD_POKEMON',
    payload: {pokemonid}
  }
);
const deletePokemon = (pokemonid) => (
  {
    type:'DELETE_POKEMON',
    payload: {pokemonid}
  }
);

module.exports = {
  addTrainer,
  deleteTrainer,
  selectTrainer,
  addPokemon,
  deletePokemon
};