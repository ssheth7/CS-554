import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Grid, 
  makeStyles,
} from '@material-ui/core';

import { useQuery} from '@apollo/client';

import queries from '../queries';
import Cards from './Cards'

import '../App.css';

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
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
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
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
  footerbutton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    border: '5px',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
    backgroundColor: '#282c34',
    marginBottom: '5px',
    borderColor: 'white'  ,
  }
});

function Home(props) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  const fetchUnsplash = useQuery(queries.GET_IMAGES).refetch;

  const fetchBinned = useQuery(queries.GET_BINNED).refetch;
  const fetchUserPosted = useQuery(queries.GET_USERPOSTED).refetch;


  let card = null;
  let getMoreButton = null;

  useEffect(() => {
    async function fetchInitial() {
      try {
        const fetchData = await fetchUnsplash({pageNum: page});
        setLoading(fetchData.loading);
        setData(fetchData.data.unsplashImages);
        setError(undefined);
      } catch(e) {
        setError(e);
      }
    }
    async function fetchBinnedImages() {
      try {
        const binnedImages = await fetchBinned();
        setLoading(binnedImages.loading);
        if (binnedImages.data.binnedImages) {
          setData(binnedImages.data.binnedImages);
        } else {
          setError("No more images");
        }
      } catch(e) {
        setError(e);
      }
    }
    async function fetchUserPostedImages() {
      try {
        const userPostedImages = await fetchUserPosted();
        setLoading(userPostedImages.loading);
        if (userPostedImages.data.userPostedImages) {
          setData(userPostedImages.data.userPostedImages);
        } else {
          setError("No more images");
        }
      } catch(e) {
        setError(e);
      }
    }
    setData(undefined);
    setPage(1);
    const urlpath = props.location.pathname;
    if (props.location.pathname === '/') {
      fetchInitial();
    } else if (urlpath === '/my-bin') {
      fetchBinnedImages();
    } else if (urlpath === '/my-posts'){
      fetchUserPostedImages();
    }
  }, [props.location.pathname, fetchBinned, fetchUserPosted, fetchUnsplash]);


  async function getMore() {
      try {
        let newPage = page + 1;
        setPage(newPage);
        let merged = [];
        const fetchData = await fetchUnsplash ({pageNum : newPage});
        if (fetchData.data.unsplashImages) {
          merged = data.concat(fetchData.data.unsplashImages);
          setData(merged);
        }
      } catch (e) {
        return (alert("No more images"));
      }
  }


  if (props.location.pathname === "/") {
    getMoreButton = (
      <Button onClick={getMore} 
      classes={{
      root:classes.footerbutton,
      text: classes.buttontext
      }}
      > See more!</Button>
    );    
  }

    if (data && Array.isArray(data) && data.length > 0) {
      console.log(data)
      card = data.map((image) => {
        return <Cards image={image} path={props.location.pathname}/>;
    });

    return (
      <div>
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
        <br></br>
        {getMoreButton}
      </div>
    );
    } else if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else if (error) {
    return <div>{error.message}</div>;
  } else {
    return <div>No images found</div>
  }
  

};

export default Home;
