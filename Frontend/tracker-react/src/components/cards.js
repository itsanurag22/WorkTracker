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
import Title from './title';
import { useParams } from 'react-router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const useStyles = makeStyles({
  cardGrid: {
    margin: "auto"

  },
  
});

export function ListCards() {
        const mytoken = cookie.load("authtoken")
        const { p_id, l_id } = useParams()
        const [cardData, setCardData] = React.useState([])
        const drawerWidth = 240;
        const classes = useStyles();
        const [noCards, setNoCards]= React.useState(false)
        const [createCard, setCreateCard]=React.useState(false)

        const handleCreateCard = (e) => {
            e.preventDefault()
            createCard? setCreateCard(false): setCreateCard(true)
    
        }
    
        async function ListCardData(){
        axios.get(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/lists/${l_id}/cards`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log(response.data)
            setCardData(response.data)

            
            
        })
        .catch(err => {
            
            console.log(err);
        })
        }
        React.useEffect(()=>{
            ListCardData()
        }, [])
        
    

  return (
    <Box>

        <SideBar/>
        <Title title="List Cards"/>
        <Box mb={2} mr={3}>
                <Grid container justifyContent="flex-end">
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    startIcon={createCard?<KeyboardArrowUpIcon/>:<KeyboardArrowDownIcon/>} 
                    disableElevation
                    onClick={handleCreateCard}
                    >
                        Create a card
                    </Button>
                </Grid>
        </Box>

        <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
            <Container disableGutters>
                <Box sx={{pl:2}}>
                <Grid container spacing={4} xs={12} sx={{m:0}} >
                    {cardData.length>0 ? 
                    cardData.map(card => (
                        <Grid item xs={12} md={6} lg={4} key={card.id}>
                            <CardShow cardState ={card}/>

                        </Grid>
                        

                    )) : <Box sx={{m:2}}><Typography>No Cards to show</Typography></Box>}
                </Grid>
                </Box>
            </Container>
        </Box>
    </Box>
  );
};