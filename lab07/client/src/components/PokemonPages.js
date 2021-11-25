import {React} from 'react';
import { Link } from 'react-router-dom';
import {  useQuery } from '@apollo/client';
import {Grid} from '@material-ui/core';
import { Pagination, PaginationItem } from '@mui/material';
import Cards from './Cards';
import Error from './Error';
import queries from '../queries'
import '../App.css';

const PokemonPages = (props) => {
    let page = props.match.params.id;
    const {loading, error, data} = useQuery(queries.GET_LIST,
         {variables : { pageNum: Number.parseInt(page) - 1 }});

    let cards = null;  
    try {
        page = Number.parseInt(page);
    } catch (e) {
        return <Error/>
    }

    cards = data && data.PokemonList && data.PokemonList.map((pokemon, index) => {
        return <Cards key={pokemon.id} pokemon={pokemon}/>
    });

    if (loading) {
        return <a>loading...</a>;
    } else if (error) {
        console.log(error);
        return <a>error</a>;
    } else if (data.PokemonList.length == 0) {
        return <Error/>
    } else {
        const count = Math.floor(1118 / 50 );
        return (
        <>
            <Pagination 
            count={count}
            page={page}
            renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={"/pokemon/page/" + item.page}
                  {...item}
                />
            )}
            />
            <Grid container>
                {cards}
            </Grid>
        </>
        );
    }
};

export default PokemonPages;