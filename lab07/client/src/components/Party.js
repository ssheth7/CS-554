import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {useQuery} from '@apollo/client';
import {Card, CardMedia, Typography, CardContent, makeStyles, Grid} from '@material-ui/core';

import queries from '../queries'
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
const Party = (props) => {
    const classes = useStyles();
    const pokemon = props.pokemon;
    const [error, setError ] = useState(undefined);
    const [data, setData] = useState(undefined);
    const getPokemon = useQuery(queries.GET_POKEMON).refetch;

    useEffect(() => {
        let promisearr = [];
        async function fetchPokemon(id) {
            try {
                const pdata = (await getPokemon({id: id})).data.Pokemon; 
                return pdata;
            } catch(e) {
                setError(e);
                console.log(e);
            }
        }
        
        for (let i = 0; i < pokemon.length; i++) {
            promisearr[i] = fetchPokemon(pokemon[i]);
        }
        Promise.all(promisearr).then((values) => {
            setData(values);    
        });
    }, pokemon);

    const createCard = data && data.map((pokemon) => {
        if (pokemon) {
            return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={1} key={pokemon.id}>
                <Card className={classes.card} variant="outlined">
                    <CardMedia
                        component="img"
                        image = {pokemon.front_default}
                        title={pokemon.front_default}
                        height="200"
                    />
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h3"
                        >
                            <Link to={"/pokemon/" + pokemon.id}>
                                {pokemon.name}
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            )
        } else {
            return <>None</>
        }
    });

    if (data) {
        return <>{createCard}</>
    }
    else if (error) {
        return <p>{error}</p>;
    } else { 
        return (
            <>
                <p>loading...</p>
            </>
        )                
    }
};

export default Party;
