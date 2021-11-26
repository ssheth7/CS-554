import {React, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Box, TextField  } from '@mui/material';
import { Grid, Button } from '@material-ui/core'
import actions from '../actions';
import Party from './Party';

import '../App.css';


const Trainers = () =>  {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState("");
    const allState = useSelector((state) => state.trainerreducers);
    let trainerGrid = null;


    const handleChange = (e) => {
            setFormData(e.target.value);
    };

    const addTrainer = (e) => {
        e.preventDefault();
        if (!formData.trim()) {
            return alert("Please enter a valid trainer name");
        }
        dispatch(actions.addTrainer(formData));
        setFormData("");
    };
    const deleteTrainer = (id) => {
        dispatch(actions.deleteTrainer(id));
    };
    const selectTrainer = (id) => {
        dispatch(actions.selectTrainer(id));
    };


    if (allState.trainers) {
        let values = Object.keys(allState.trainers);
        trainerGrid = values.map((key) => {
            let trainer = allState.trainers[key];
            let selected = false;
            if (key === allState.currentTrainer) {
                selected = true;
            }
            return (
                <Box key ={key}>
                <Grid 
                    container
                    justifyContent="center" 
                    alignItems="center"
                >
                    <Grid item xs={3} key="Name">
                        Trainer: {trainer.name}
                    </Grid>
                    <Grid item xs={2} key="select button">
                        <Button
                            onClick={() => {selectTrainer(key)}}
                            disabled={selected}
                            variant="outlined"
                            >
                            <a>Select Trainer</a>
                        </Button>      
                    </Grid>
                    <Grid item xs={2} key="delete button">
                        <Button
                            onClick={() => {deleteTrainer(key)}}
                            disabled={selected}
                            variant="outlined"
                            >
                                <a>Delete</a>
                        </Button>      
                    </Grid>
                </Grid>
            <Grid 
                container 
                justifyContent="center" 
                alignItems="center"
                direction="row"
                spacing={2}
            >
                    <Party pokemon={trainer.pokemon}/>
            </Grid>
            </Box>    
            )
        })
    }

    return (
        <>
        <div>
            <Box component='form' onSubmit={addTrainer} noValidate>
                <TextField required id="name" label="New Trainer Name" variant="outlined" margin="normal" value={formData} onChange={handleChange} >
                    Enter a name
                </TextField>
                <br></br>
                <Button type="submit" variant="outlined" margin="normal">
                    Add Trainer
                </Button>
                { trainerGrid }
            </Box>
         </div>
        </>
    );
};

export default Trainers;