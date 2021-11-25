import { combineReducers } from 'redux';
import trainerReducer from './trainerReducer';
const rootReducer = combineReducers({
    trainerreducers: trainerReducer,
});

export default rootReducer;