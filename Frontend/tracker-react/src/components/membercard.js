import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import React from 'react';

const MemberCard=(props)=> {
    const member = props.memberState

    return (
        <Box>
            <Card sx={{ minWidth: 250 }} variant="outlined"  key={member.id}>
                
                <CardContent>
                    {member.admin_check? <Grid container justifyContent="flex-end"><Box sx={{fontWeight: 'bold',color: '#FF9A3C'}}> Admin</Box></Grid> : 
                    [(member.banned? <Grid container justifyContent="flex-end"><Box sx={{fontWeight: 'bold',color: '#D72323'}}>Restricted</Box></Grid>:<Grid container justifyContent="flex-end"><Box sx={{fontWeight: 'bold',color: '#1FAB89'}}>Normal User</Box></Grid>)]}
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}}  >Username:</Box>
                    {member.username}
                    </Typography>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Fullname:</Box>
                    {member.fullname}
                    </Typography>
                    
                </CardContent>
                <CardActions >
                    <Button  variant="contained" style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  disableElevation>User details</Button>
                </CardActions>
        </Card>
        </Box>
    );
}

export default MemberCard;   