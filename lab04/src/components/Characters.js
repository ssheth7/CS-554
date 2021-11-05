import axios from 'axios';
import React, { useEffect, useState } from 'react'
import '../App.css'
import Error from './Error';
import { generateIdUrl } from '../generateUrl';

const Characters = (props) => {
    const [CharactersData, setCharactersData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getCharacters() {
        try {
            let id = props.match.params.id;
            const {data} = await axios.get(generateIdUrl("characters/" + id));
            setCharactersData(data.data.results[0]);
            setLoading(false);
        } catch(e) {
            setLoading(false);
            return Error;
        }
    }
    getCharacters();
    }, [props.match.params.id])
    
    let comicList = CharactersData && CharactersData.comics.items && CharactersData.comics.items.map((comics) => {
        return (
            <li key = {comics.resourceURI}><p> {comics.name}</p></li>
        );
    });

    let linksList = CharactersData && CharactersData.urls && CharactersData.urls.map((url) => {
        return (
            <li ><a href={url.url}>{url.type}</a></li>
        );
    });
    if (loading) {
        return (
            <p>Loading...</p>
        );
    } else if (CharactersData){
        return (
            <div>
                <h2>{CharactersData.name}</h2>
                <h3>Comics</h3>
                <ul>
                    {comicList}
                </ul>
                <h3>Learn more!</h3>
                <ul>{linksList}</ul>
            </div>
        );
    } else {
        return <Error/>;
    }
};

export default Characters;