import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import React from 'react';
import { useHistory } from 'react-router';

const ProjectCard=(props)=> {
    const project = props.projState;
    // const users = props.userState;
    const history = useHistory();


    return (
        <Box>
            <Card sx={{ minWidth: 250 }} variant="outlined"  key={project.id}>
                <CardHeader title={project.name}/>
                <Divider/>
                <CardContent>
                    
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Description:</Box>
                    
                    </Typography>
                    <div>
                    <Typography sx={{ fontSize: 14 }} noWrap  dangerouslySetInnerHTML={{__html: project.description}}>
                    
                    </Typography>
                    </div>
                    {/* {users.map(user => {
                                    if(user.id === project.creator){
                                        return (
                                            <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Created By:</Box>
                                                {user.fullname}
                                            </Typography>
                                        )
                    }})} */}
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Created By:</Box>
                    {project.creator.fullname}
                    </Typography>
                    
                </CardContent>
                <CardActions >
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    disableElevation 
                    onClick={(e)=>{
                        e.preventDefault();
                        
                        history.push(`/projects/${project.id}`) 
                        }}
                    >
                        Open
                    </Button>
                </CardActions>
        </Card>
        </Box>
    );
}

export default ProjectCard;   