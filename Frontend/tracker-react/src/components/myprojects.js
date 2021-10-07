// @flow
import { Container, Grid, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import axios from 'axios';
import * as React from 'react';
import cookie from 'react-cookies'
import ProjectCard from './projectcard';
import SideBar from './sidebar';
import { makeStyles } from "@material-ui/core/styles";
import { ClassNames } from '@emotion/react';

const useStyles = makeStyles({
  cardGrid: {
    margin: "auto"

  },
  
});

export function MyProjects() {
        const mytoken = cookie.load("authtoken")
        const [projData, setProjData] = React.useState([])
        const drawerWidth = 240;
        const classes = useStyles();

        async function MyProjectData(){
        axios.get('http://127.0.0.1:8200/tracker_app/user_projects/',  {headers:{"Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log(response.data)
            setProjData(response.data)

            
            
        })
        .catch(err => {
            
            console.log(err);
        })
        }
        React.useEffect(()=>{
            MyProjectData()
        }, [])
        
    

  return (
    <Box>
        <SideBar/>
        <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, mt:3, mb:3}}>
            <Typography variant="h6" component="h2" color="primary" align="center">
                Welcome to dashboard
            </Typography>
        
        </Box>
        <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, pl:2 }}>
            <Container disableGutters>
                <Grid container spacing={4} xs={12} sx={{m:0}} >
                    {projData.map(proj => (
                        <Grid item xs={12} md={6} lg={4} key={proj.id}>
                            <ProjectCard projState ={proj}/>

                        </Grid>
                        

                    ))}
                </Grid>
            </Container>
        </Box>
    </Box>
  );
};