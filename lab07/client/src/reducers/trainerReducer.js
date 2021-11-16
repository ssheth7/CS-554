import { v4 as uuid } from 'uuid';
const initialId = uuid();
const initialState = {
        currentTrainer: initialId,
        trainers: [
            {
                id: initialId,
                name: "Red",
                pokemon: [1, 2, 3, 4, 5, 6]
            },
        ],
    };

let copyState = null;
let index = 0;

const trainerReducer = (state = initialState, action) => {
        const {type, payload} = action;
        switch (type) {
            case 'CREATE_TRAINER':
                copyState = state;
                copyState.trainers.push(
                    {
                        id: uuid(),
                        name: payload.name,
                        pokemon: [],
                    }
                );
                return copyState;
            case 'DELETE_TRAINER':
                copyState = state;
                index = copyState.trainers.findIndex((x) => x.id === payload.id);
                copyState.trainers.splice(index, 1);
                copyState.currentTrainer = "";
                return copyState;
            case 'SELECT_TRAINER':
                copyState = state;
                index = copyState.trainers.findIndex((x) => x.id === payload.id);
                copyState.currentTrainer = copyState.trainers[index].id;
                return copyState;
            default:
                return state;
        }
};

export default trainerReducer;