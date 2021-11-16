import { combineReducers } from 'redux';
import pokemonReducer from './pokemonReducer';
import trainerReducer from './trainerReducer';
const rootReducer = combineReducers({
    pokemonreducers: pokemonReducer,
    trainerreducers: trainerReducer,
});

export default rootReducer;