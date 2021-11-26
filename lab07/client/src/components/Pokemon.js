import { useQuery } from '@apollo/client';
import { React } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Button} from '@material-ui/core';
import actions from '../actions';
import noImage from '../img/no_image.jpeg'
import queries from '../queries'
import '../App.css';

const Pokemon = (props) => {
    const dispatch = useDispatch();
    const id = props.match.params.id;
    const allState = useSelector((state) => state.trainerreducers);
    const currentTrainer = allState.currentTrainer;
    const party = allState.currentParty;
    const {loading, error, data} = useQuery(queries.GET_POKEMON,
         {variables : { id: id}});
    const selected = party && party.find(x => x === Number.parseInt(id));

    let buttonText = "Catch";
    if (party && party.length === 6) {
        buttonText = "Party is full";
    }
    if (selected) {
        buttonText = "Release";
    }
    const addPokemon = () => {
        dispatch(actions.addPokemon(Number.parseInt(id)));
    }
    const deletePokemon = () => {
        dispatch(actions.deletePokemon(Number.parseInt(id)));
    }
    const typesList = data && data.Pokemon.types && data.Pokemon.types.map((type) => {
        return <ul key={type}>{type}</ul>
    });

    let buttonAction = selected ? deletePokemon : addPokemon;
    
    if (loading) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>{error}</div>
    } else {
        return <>
            <h2>{data.Pokemon.name}</h2>
            <h2>Types</h2>
            <ul>
                {typesList}
            </ul>
            <img
                src={data.Pokemon.back_default ? data.Pokemon.back_default : noImage}
                alt="Default Back View"
            />
            <img
                src={data.Pokemon.front_default ? data.Pokemon.front_default : noImage}
                alt="Default Front View"
            />
            <img
                src={data.Pokemon.back_shiny ? data.Pokemon.back_shiny : noImage}
                alt="Shiny Back View"
            />
            <img
                src={data.Pokemon.front_shiny ? data.Pokemon.front_shiny : noImage}
                alt="Shiny Front View"
            />
            <br></br>
            <Button 
            variant="outlined"
            disabled={!currentTrainer || (!selected && party && party.length === 6)}
            onClick={() => {buttonAction()}}>
                <a>{buttonText}</a>    
            </Button>
        </>;
    }
}

export default Pokemon;