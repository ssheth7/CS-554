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
    const count = Math.floor(1118 / 25 );
    const {loading, error, data} = useQuery(queries.GET_LIST,
         {variables : { pageNum: Number.parseInt(page) - 1 }});
    if (page < 1 || page > count) {
        return <Error/>
    }   
    let cards = null;  
    try {
        page = Number.parseInt(page);
    } catch (e) {
        return <Error/>
    }

    cards = data && data.PokemonList && data.PokemonList.map((pokemon) => {
        return <Cards key={pokemon.id} pokemon={pokemon}/>
    });

    if (loading) {
        return <p>loading...</p>;
    } else if (error) {
        console.log(error);
        return <p>error</p>;
    } else if (data.PokemonList.length === 0) {
        return <Error/>
    } else {
        return (
        <>
            <Pagination 
            count={count}
            page={page}
            renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={"/pokemon/page/" + item.page}
                  aria-label={"Go to page" + item.page}
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