import { v4 as uuid } from 'uuid';
const initialId = uuid();
const initialState = {
        currentTrainer: null,
        currentParty: [],
        trainers: {}
};
initialState.trainers[initialId] = {
    name: "Red",
    pokemon: [1, 2, 3, 4, 5, 6]
}

let copyState = null;
let pokemonIndex = 0;
let currentTrainer = null;
let id;

const trainerReducer = (state = initialState, action) => {
        const {type, payload} = action;
        switch (type) {
            case 'CREATE_TRAINER':
                copyState = state;
                id = uuid();
                copyState.trainers[id] = 
                    {
                        name: payload.name,
                        pokemon: [],
                    };
                return copyState;
            case 'DELETE_TRAINER':
                copyState = state;
                delete copyState.trainers[payload.id];
                return copyState;
            case 'SELECT_TRAINER':
                copyState = state;
                copyState.currentTrainer = payload.id;
                copyState.currentParty = copyState.trainers[copyState.currentTrainer].pokemon;
                return copyState;
            case 'ADD_POKEMON':
                copyState = state;
                currentTrainer = copyState.trainers[copyState.currentTrainer];
                currentTrainer.pokemon.push(payload.pokemonid);
                return copyState;
            case 'DELETE_POKEMON':
                copyState = state;
                currentTrainer = copyState.trainers[copyState.currentTrainer];
                currentTrainer.pokemon = currentTrainer.pokemon.filter(id => id != payload.pokemonid);
                copyState.currentParty = currentTrainer.pokemon; 
                return copyState;    
            default:
                    return state;
        }
};

export default trainerReducer;