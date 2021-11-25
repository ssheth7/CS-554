import {React, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Box, TextField  } from '@mui/material';
import { Grid } from '@material-ui/core'
import {LoadingButton} from '@mui/lab';
import actions from '../actions';
import Party from './Party';

import '../App.css';

const Trainers = () =>  {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState("");
    const [submitLoading, setsubmitLoading] = useState(false);
    const [change, setChange] = useState(false);
    const allState = useSelector((state) => state.trainerreducers);
    let trainerGrid = null;


    const handleChange = (e) => {
        if (e.target.value) {
            setFormData(e.target.value);
        }
    };

    const addTrainer = (e) => {
        setsubmitLoading(true);
        e.preventDefault();
        dispatch(actions.addTrainer(formData));
        setFormData("");
        setsubmitLoading(false);
    };
    const deleteTrainer = (id) => {
        dispatch(actions.deleteTrainer(id));
        setChange(!change);
    };
    const selectTrainer = (id) => {
        dispatch(actions.selectTrainer(id));
        setChange(!change);
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
                <Box >
                <Grid 
                    container
                    justifyContent="center" 
                    alignItems="center"
                >
                    <Grid item xs={3} key="Name">
                        <a>Trainer: {trainer.name}</a>
                    </Grid>
                    <Grid item xs={2} key="select button">
                        <LoadingButton
                            onClick={() => {selectTrainer(key)}}
                            disabled={selected}
                            loadingIndicator="Selected"
                            variant="outlined"
                            >
                            Select Trainer
                        </LoadingButton>      
                    </Grid>
                    <Grid item xs={2} key="delete button">
                        <LoadingButton
                            onClick={() => {deleteTrainer(key)}}
                            disabled={selected}
                            loadingIndicator="Delete"
                            variant="outlined"
                            >
                                Delete
                        </LoadingButton>      
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
                <LoadingButton type="submit" loadingIndicator="Loading..." variant="outlined" loading={submitLoading} margin="normal">
                    Add Trainer
                </LoadingButton>
                { trainerGrid }
            </Box>
         </div>
        </>
    );
};

export default Trainers;