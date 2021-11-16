import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Card, 
  CardMedia, 
  Typography, 
  Grid, 
  CardContent, 
  makeStyles,
  Switch
} from '@material-ui/core';

import {useMutation} from '@apollo/client';

import queries from '../queries';
import noImage from '../img/download.jpeg';

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

function Cards(props) {
    const classes = useStyles();
    const [image, setImage] = useState(props.image);
    const [path] = useState(props.path);

    const [editImage] = useMutation(queries.EDIT_IMAGE);
    const [deleteImage] = useMutation(queries.DELETE_IMAGE);
  
    useEffect(() => {
        setImage(image);
    }, [image]);

    async function toggleImage(image) {
      let alteredImage = JSON.parse(JSON.stringify(image));
      alteredImage.binned = !alteredImage.binned;
      try {
        const editedImage = await editImage({variables: alteredImage});
        if (path === '/my-bin') {
          setImage(null);
        } else {
          setImage(editedImage.data.updateImage);
        }
      } catch (e) {
        return (alert(e));
      }
    }  

    async function uncacheImage(image) {
      let id = image.id;
      try {
        await deleteImage({variables : {id : id}});
        setImage(null);
      } catch(e) {
        return (alert(e));
      }
    }

    if (image === null) {
      return(null);
    } else if (image) {
        let deleteButton;
        
        if (path === '/my-posts') {
          deleteButton = (
            <Button 
            classes={
                {root: classes.button, 
                label: classes.buttontext}}
            style={{ backgroundColor: '#282c34' }} 
            size="small"
            onClick={() => uncacheImage(image)}
            > Delete Image
            </Button>
          );  
        }

        const buttonLabel = { inputProps: { 'aria-label' : 'Bin Image Toggle' } };   

        let editButton = (

          <Switch   
              {...buttonLabel}
              key={image.id + "editbutton"}          
              checked={image.binned}
              onChange={()=>{
                toggleImage(image);
              }}
              name="loading"
              color="primary"
              >            
              </Switch>
        );
        return (
          <Grid  item xs={12} sm={6} md={4} lg={3} xl={2} key={image.id}>
            <Card className={classes.card} variant="outlined">
                  <CardMedia 
                    className={classes.media}
                    component="img"
                    image={
                      image.url
                    }
                    onError={e=> {
                      e.target.src=noImage;
                    }}
                    title={image.url}
                  />
    
                  <CardContent>
                    <Typography
                      className = {classes.titleHead}
                      gutterBottom
                      variant="h6"
                      component="h3"
                    >
                      {image.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      by {image.posterName}                
                    </Typography>
                    <Typography variant = "body2">
                      {image.description}
                    </Typography>
                  </CardContent>
                  {editButton}
                  <br></br>
                  {deleteButton}
            </Card>
          </Grid>
        );
      };    
}

export default Cards;