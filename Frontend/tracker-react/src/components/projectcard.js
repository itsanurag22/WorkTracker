import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import React from 'react';

const ProjectCard=(props)=> {
    const project = props.projState

    return (
        <Box>
            <Card sx={{ minWidth: 250 }} variant="outlined"  key={project.id}>
                <CardHeader title={project.name}/>
                <Divider/>
                <CardContent>
                    {/* <Typography variant="h5" component="div" >
                     {project.name}
                    </Typography> */}
                    
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Description:</Box>
                    
                    </Typography>
                    <div>
                    <Typography sx={{ fontSize: 14 }} noWrap  dangerouslySetInnerHTML={{__html: project.description}}>
                    
                    </Typography>
                    </div>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Created By:</Box>
                    {project.creator.fullname}
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

export default ProjectCard;   