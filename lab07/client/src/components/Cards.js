import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {  useQuery } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import {Grid, Card, CardMedia, Typography, CardContent, makeStyles, Button} from '@material-ui/core';
import actions from '../actions';
import queries from '../queries'
import noImage from '../img/no_image.jpeg'
import '../App.css';

const useStyles = makeStyles({
    card: {
      maxWidth: 300 ,
      height: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 5,
      border: '1px solid #282c34',
      boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
    },
    titleHead: {
      borderBottom: '1px solid #282c34',
      fontWeight: 'bold'
    },
    media: {
      height: '300px',
      width: '100%'
    },
    button: {
      color: '#1e8678',
      fontWeight: 'bold',
      fontSize: 12,
      border: '5px',
      boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
      backgroundColor: '#282c34',
      marginBottom: '5px',
    },
    buttontext: {
      color: 'white'
    },
});
  
const Cards = (props) => {
    const pokemon = props.pokemon;
    const id = pokemon.id;
    const dispatch = useDispatch();
    const classes = useStyles();
    const allState = useSelector((state) => state.trainerreducers);
    const currentTrainer = allState.currentTrainer;
    const [party, setParty] = useState(allState.currentParty);
    const {loading, error, data} = useQuery(queries.GET_POKEMON, {variables: {id}});
    const [selected, setSelected] = useState(party && party.includes(id));

    if (loading) {
        return (<a>loading...</a>);
    } else if (error) {
        return (<a> {error} </a>);
    } 
    let image = data.Pokemon.front_default;
    if (!image) {
        image = data.Pokemon.back_default;
    }

    let buttonText = "Catch";
    if (party && party.length == 6 ) {
        buttonText = "Party is full";
    }
    if (selected) {
        buttonText = "Release";
    }

    const addPokemon = () => {
        dispatch(actions.addPokemon(id));
        setSelected(true);
        setParty(allState.currentParty);

    }
    const deletePokemon = () => {
        dispatch(actions.deletePokemon(id));
        setSelected(false);
        setParty(allState.currentParty);
        console.log(allState.currentParty);
    }

    let buttonAction = selected ? deletePokemon : addPokemon;
    
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={1} key={data.Pokemon.url}>
            <Card
                className={classes.card}
                variant="outlined">
            <CardMedia
                component="img"
                image = {(image) ? image : noImage}
            />
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h6"
                    component="h3"
                >
                    <Link to={"/pokemon/" + id}>
                        {data.Pokemon.name}
                    </Link>
                    <a>{selected}</a>
                </Typography>
            </CardContent>
            <Button 
                variant="outlined"
                disabled={!currentTrainer || (!selected && party.length > 5)}
                onClick={() => {buttonAction()}}>
                    {buttonText}    
                </Button>
            </Card>
        </Grid>
    );
};

export default Cards;