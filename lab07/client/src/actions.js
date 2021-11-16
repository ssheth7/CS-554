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
module.exports = {
  addTrainer,
  deleteTrainer,
  selectTrainer
};