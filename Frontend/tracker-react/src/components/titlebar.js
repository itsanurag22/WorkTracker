import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { Link, useHistory} from 'react-router-dom';
import { AppBar, Button } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Typography from '@mui/material/Typography';
import cookie from 'react-cookies'
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


// const useStyles = makeStyles({
//     page :{
//         backgroundColor:"#f9f9f9"
//     }
// })

export default function Titlebar(){
    const drawerWidth = 240;
    let history = useHistory();
    const logOut = () =>{
        
        axios({url:'http://127.0.0.1:8200/tracker_app/logout', method:'GET', withCredentials: true})
        .then(response => {
            console.log(response)
            cookie.remove('csrftoken')
            cookie.remove('sessionid')
            history.push('/')
            
            
        })
        .catch(err => {
            
            console.log(err);
        })
    }

    return(
        <div>
            <AppBar position="sticky" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Grid justifyContent="space-between" container spacing={1}>
                        <Grid item>
                            <Typography type="title" >
                                Work Tracker
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={()=>{logOut()}}>
                                Logout
                            </Button>
                        </Grid>
                        
                    </Grid>
                </Toolbar>


            </AppBar>
        </div>
    );
}