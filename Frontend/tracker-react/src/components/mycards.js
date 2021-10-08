// @flow
import { Button, Container, Grid, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import axios from 'axios';
import * as React from 'react';
import cookie from 'react-cookies'
import ProjectCard from './projectcard';
import SideBar from './sidebar';
import { makeStyles } from "@material-ui/core/styles";
import { ClassNames } from '@emotion/react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CardShow from './cardshow';

const useStyles = makeStyles({
  cardGrid: {
    margin: "auto"

  },
  
});

export function MyCards() {
        const mytoken = cookie.load("authtoken")
        const [cardData, setCardData] = React.useState([])
        const drawerWidth = 240;
        const classes = useStyles();

        async function MyCardData(){
        axios.get('http://127.0.0.1:8200/tracker_app/user_cards/',  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log(response.data)
            setCardData(response.data)

            
            
        })
        .catch(err => {
            
            console.log(err);
        })
        }
        React.useEffect(()=>{
            MyCardData()
        }, [])
        
    

  return (
    <Box>
        <SideBar/>
        <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, mt:3, mb:3}}>
            {/* <Button variant="outlined" startIcon={<ArrowBackRoundedIcon/>}>
                Back
            </Button> */}
            <Typography  variant="h6" component="h2" color="primary" align="center">
                MY CARDS
            </Typography>
        
        </Box>
        <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
            <Container disableGutters>
                <Box sx={{pl:2}}>
                <Grid container spacing={4} xs={12} sx={{m:0}} >
                    {cardData.map(card => (
                        <Grid item xs={12} md={6} lg={4} key={card.id}>
                            <CardShow cardState ={card}/>

                        </Grid>
                        

                    ))}
                </Grid>
                </Box>
            </Container>
        </Box>
    </Box>
  );
};