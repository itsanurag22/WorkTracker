import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import React from 'react';

const CardShow=(props)=> {
    const card = props.cardState

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

                    {/* <Typography >
                    Created by: {project.creator.fullname}
                    </Typography> */}
                </CardContent>
                <CardActions >
                    <Button size="small" variant="contained" color="primary"  disableElevation>Open</Button>
                </CardActions>
        </Card>
        </Box>
    );
}

export default CardShow;   