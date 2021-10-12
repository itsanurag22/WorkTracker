import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import React from 'react';
import { useHistory } from 'react-router';

const CardShow=(props)=> {
    const card = props.cardState
    const history = useHistory();

    return (
        <Box>
            <Card sx={{ minWidth: 250 }} variant="outlined"  key={card.id}>
                <CardHeader title={card.name}/>
                <Divider/>
                <CardContent>
                    {/* <Typography variant="h5" component="div" >
                     {project.name}
                    </Typography> */}
                    <Typography  gutterBottom noWrap><Box sx={{ fontWeight: 'bold'}} mt={1} >Description :</Box>
                    {card.description}
                    </Typography>
                    
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Created on :</Box>
                    {card.created}
                    </Typography>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Due :</Box>
                    {card.due_date}
                    </Typography>

                    
                </CardContent>
                <CardActions >
                    <Button  
                    variant="contained" 
                    disableElevation
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}
                    onClick={(e)=>{
                        e.preventDefault();
                        
                        history.push(`/cards/${card.id}`) 
                        }}
                    >Open</Button>
                </CardActions>
        </Card>
        </Box>
    );
}

export default CardShow;   