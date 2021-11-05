import axios from 'axios';
import React, { useEffect, useState } from 'react'
import '../App.css'
import Error from './Error';
import { generateIdUrl } from '../generateUrl';

const Series = (props) => {
    const [SeriesData, setSeriesData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSeries() {
        try {
            let id = props.match.params.id;
            const {data} = await axios.get(generateIdUrl("series/" + id));
            setSeriesData(data.data.results[0]);
            setLoading(false);
        } catch(e) {
            setLoading(false);
            return Error;
        }
    }
    getSeries();
    }, [props.match.params.id])
    
    let creatorList = SeriesData && SeriesData.creators.items && SeriesData.creators.items.map((creator) => {
        return (
            <li>{creator.role}:<p> {creator.name}</p></li>
        );
    });

    let characterList = SeriesData && SeriesData.characters.items && SeriesData.characters.items.map((character) => {
        return (
            <li><p> {character.name}</p></li>
        );
    });
    if (loading) {
        return (
            <p>Loading...</p>
        );
    } else if (SeriesData){
        return (
            <div>
                <h2>{SeriesData.title}</h2>
                <p> StartYear: {SeriesData.startYear} &nbsp;&nbsp;&nbsp; End Year {SeriesData.endYear}</p>
                <h3>Creators</h3>
                <ul>
                    {creatorList}
                </ul>
                <h3>Characters</h3>
                <ul>
                    {characterList}
                </ul>
            </div>
        );
    } else {
        return <Error/>;
    }
};

export default Series;