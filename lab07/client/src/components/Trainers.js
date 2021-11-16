import {React, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Box, TextField  } from '@mui/material';
import {LoadingButton} from '@mui/lab';
import actions from '../actions';
import '../App.css';

const Trainers = (props) =>  {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState("");
    const [submitLoading, setsubmitLoading] = useState(false);
    const allState = useSelector((state) => state);

    const handleChange = (e) => {
        setFormData(e.target.value);
    };

    const addTrainer = (e) => {
        setsubmitLoading(true);
        e.preventDefault();
        dispatch(actions.addTrainer(formData));
        setFormData("");
        setsubmitLoading(false);
        console.log(allState);
    };
    const deleteTrainer = (id) => {
        dispatch(actions.deleteTrainer(id));
    };
    const selectTrainer = (id) => {
        dispatch(actions.selectTrainer(id));
    };

    return (
        <div>
            <Box component='form' onSubmit={addTrainer} noValidate>
                <TextField required id="name" label="New Trainer Name" variant="outlined" margin="normal" value={formData} onChange={handleChange} >
                    Enter a name
                </TextField>
                <br></br>
                <LoadingButton type="submit" loadingIndicator="Loading..." variant="outlined" loading={submitLoading} margin="normal">
                    Add Trainer
                </LoadingButton>
            </Box>
        </div>
    );
};

export default Trainers;