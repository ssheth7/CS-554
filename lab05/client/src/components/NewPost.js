import React, {useState } from 'react';
import {useMutation } from '@apollo/client';
import { 
    TextField,
    Button,
    Grid,
}from "@material-ui/core";

import queries from '../queries'
import '../App.css'


const defaultValues = {
    url: "",
    description: "",
    posterName: ""
}

function NewPost() {
    const [formValues, setFormValues] = useState(defaultValues);
    const [editMutation] = useMutation(queries.ADD_IMAGE);

    const handleSubmit = async(e) => {
        e.preventDefault();
        let error = "Invalid\n";
        let errorflag = 0;
        const values = {
            url : e.target[0].value,
            description : e.target[1].value,
            posterName : e.target[2].value
        };
        if (!values.url || !values.url.trim()) {
            error += "url\n"
            errorflag = 1;
        }
        if (!values.description || !values.description.trim()) {
            error += "description\n";
            errorflag = 1;
        }
        if (!values.posterName || !values.posterName.trim()) {
            error += "posterName\n";
            errorflag = 1;
        }
        if (errorflag) {
            return alert(error);
        }
        setFormValues(values);
        try {
            const data = await editMutation({variables: values});
            console.log(data);
        } catch(e) {
            console.log(e);
            return (alert("Could not upload image"));
        }
        return (alert("Upload successful"));
    };    
    return(
        <form onSubmit={handleSubmit}>
            <Grid container alignItems="center" direction="column">
                <Grid item>
                    <TextField required label="Image Url" variant="standard" inputProps={{'aria-label' : 'imageurl'}}>
                        id="image-url"
                        name="url"
                        type="text"
                        label="imageurl"
                        value={formValues.url}
                    </TextField>
                </Grid>
                <Grid item>
                    <TextField required label="Description" variant="standard" inputProps={{'aria-label' : 'description'}}>
                        id="description"
                        name="description"
                        type="text"
                        value={formValues.description}
                    </TextField>
                </Grid>
                <Grid item>
                    <TextField required label="Poster Name" variant="standard" inputProps={{'aria-label' : 'poster name'}}>
                        id="posterName"
                        name="posterName"
                        type="text"
                        value={formValues.posterName}
                    </TextField>
                </Grid>
            </Grid>
            <br></br>
            <Button variant="contained" type="submit" >
                Submit
            </Button>
        </form>
    );
}
export default NewPost; 