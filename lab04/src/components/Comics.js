import axios from 'axios';
import React, { useEffect, useState } from 'react'
import '../App.css'
import Error from './Error';
import { generateIdUrl } from '../generateUrl';

const Comics = (props) => {
    const [ComicsData, setComicsData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getComics() {
        try {
            let id = props.match.params.id;
            const {data} = await axios.get(generateIdUrl("comics/" + id));
            setComicsData(data.data.results[0]);
            setLoading(false);
        } catch(e) {
            setLoading(false);
            return Error;
        }
    }
    getComics();
    }, [props.match.params.id])
    
    let creatorList = ComicsData && ComicsData.creators.items && ComicsData.creators.items.map((creator) => {
        return (
            <li key={creator.resourceURI}><p>{creator.role}: {creator.name}</p></li>
        );
    });

    let linksList = ComicsData && ComicsData.urls && ComicsData.urls.map((url) => {
        return (
            <li ><a href={url.url}>{url.type}</a></li>
        );
    });

    let variantsList = ComicsData && ComicsData.variants && ComicsData.variants.map((variant) => {
        return (
            <li ><p>{variant.name}</p></li>
        );
    });

    if (loading) {
        return (
            <p>Loading...</p>
        );
    } else if (ComicsData){
            return (
            <div>
                <h2>{ComicsData.title}</h2>
                <h3>Creators</h3>
                <ul>
                    {creatorList}
                </ul>
                <h3>Variants List</h3>
                <ul>
                    {variantsList}
                </ul>
                <h3>Learn more!</h3>
                <ul>
                    {linksList}
                </ul>
            </div>
        );
    } else {
        return <Error/>;
    }
};

export default Comics;