import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';

import '../App.css';
const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  }
});
const ShowList = (props) => {
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [showsData, setShowsData] = useState(undefined);
  const [prevShow, setprevShow] = useState(true);
  const [nextShow, setnextShow] = useState(true);
  const [error, seterror] = useState(false);
  let card = null;

  useEffect(() => {
    async function fetchData() {
      try {
        let page = Number.parseInt(props.match.params.id);
        const { data } = await axios.get(`http://api.tvmaze.com/shows?page=${page}`);
        setShowsData(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        seterror(true);
      }
    }
    async function fetchPrevious() {
      try {
        let page = Number.parseInt(props.match.params.id) - 1;
        await axios.get(`http://api.tvmaze.com/shows?page=${page}`);
        setprevShow(true);
      } catch (e) {
        setprevShow(false);
      }
    }
    async function fetchNext() {
      try {
        let page = Number.parseInt(props.match.params.id) + 1;
        await axios.get(`http://api.tvmaze.com/shows?page=${page}`);
        setnextShow(true);
      } catch (e) {
        setnextShow(false);
      }
    }
    seterror(false);
    fetchData();
    fetchPrevious();
    fetchNext();
  }, [props.match.params.id]);


  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/shows/${show.id}`}>
              <CardMedia
                className={classes.media}
                component="img"
                image={
                  show.image && show.image.original
                    ? show.image.original
                    : noImage
                }
                title="show image"
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant="h6"
                  component="h3"
                >
                  {show.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {show.summary
                    ? show.summary.replace(regex, '').substring(0, 139) + '...'
                    : 'No Summary'}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  card =
    showsData &&
    showsData.map((show) => {
      return buildCard(show);
    });
  
  let prevShowLink;
  if (prevShow === true) {
      prevShowLink = <Link className="center" to={"/shows/page/" + (Number.parseInt(props.match.params.id) - 1)}>
                        Previous Page
                      </Link>;
  }
  let nextShowLink;
  if (nextShow === true) {
      nextShowLink = <Link className="center" to={"/shows/page/" + (Number.parseInt(props.match.params.id) + 1)}>
                        Next Page
                      </Link>;
  }


  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Link className="center" to={"/shows/page/0"}>
                        Invalid Page. Click here to go page 0.
          </Link>;
      </div>
    );
  }
  else {
    return (
      <div>
        {prevShowLink}
        {nextShowLink}
        <br />
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
      </div>
    );
  }
};

export default ShowList;
