// @flow 
import * as React from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import cookie from 'react-cookies';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';



export const deletedialog = (props) => {
    const deleteOpen = props.deleteOpen
    const handleDeleteClose = props.handleDeleteClose
    const errDelete = props.errDelete
    const handleConfirmDelete = props.handleConfirmDelete



    return (
        <div>
            <Dialog
                open={deleteOpen}
                onClose={handleDeleteClose}
                aria-labelledby="title"
                aria-describedby="description"
            >
                <DialogTitle id="title">
                {"Are you sure you want to delete this project?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="description">
                    {errDelete? "Only admins and project members can delete project" : ""}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDeleteClose}>Cancel</Button>
                <Button onClick={handleConfirmDelete} autoFocus>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};