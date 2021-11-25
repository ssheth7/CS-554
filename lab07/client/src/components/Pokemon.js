import { useQuery } from '@apollo/client';
import {React, useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Button} from '@material-ui/core';
import actions from '../actions';
import noImage from '../img/no_image.jpeg'
import queries from '../queries'


const Pokemon = (props) => {
    const dispatch = useDispatch();
    const id = props.match.params.id;
    const allState = useSelector((state) => state.trainerreducers);
    const currentTrainer = allState.currentTrainer;
    const [party, setParty] = useState(allState.currentParty);
    const {loading, error, data} = useQuery(queries.GET_POKEMON,
         {variables : { id: id}});
    const [selected, setSelected] = useState(false);
    
    let buttonText = "Catch";
    if (party && party.length == 6) {
        buttonText = "Party is full";
    }
    if (selected) {
        buttonText = "Release";
    }
    console.log(party);
    const addPokemon = () => {
        dispatch(actions.addPokemon(Number.parseInt(id)));
        setSelected(true);
        setParty(allState.currentParty);
    }
    const deletePokemon = () => {
        dispatch(actions.deletePokemon(Number.parseInt(id)));
        setSelected(false);
        setParty(allState.currentParty);
    }
    const typesList = data && data.Pokemon.types && data.Pokemon.types.map((type) => {
        return <ul key={type}>{type}</ul>
    });

    let buttonAction = selected ? deletePokemon : addPokemon;
    
    useEffect(() => {
        for (let i = 0; party && i < party.length; i++) {
            if (party[i] == id) {
                setSelected(true);
            }
        }
    },[party])

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
            />
            <img
                src={data.Pokemon.front_default ? data.Pokemon.front_default : noImage}
            />
            <img
                src={data.Pokemon.back_shiny ? data.Pokemon.back_shiny : noImage}
            />
            <img
                src={data.Pokemon.front_shiny ? data.Pokemon.front_shiny : noImage}
            />
            <br></br>
            <Button 
            variant="outlined"
            disabled={!currentTrainer || (!selected && party && party.length == 6)}
            onClick={() => {buttonAction()}}>
                {buttonText}    
            </Button>
        </>;
    }
}

export default Pokemon;