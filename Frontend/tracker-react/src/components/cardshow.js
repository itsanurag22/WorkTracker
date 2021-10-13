import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
// import Moment from 'react-moment';
import moment from 'moment';
import axios from 'axios';
import cookie from 'react-cookies'


export function CardShow(props) {
    const mytoken = cookie.load("authtoken")
    const card = props.cardState
    const l_id = card.parent_list
    const history = useHistory();
    const created = card.created
    const due = card.due_date
    const [parentData, setParentData] = useState([])

    async function ParentListData(){
        axios.get(`http://127.0.0.1:8200/tracker_app/lists/${l_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log(response.data)
            setParentData(response.data)

            
            
        })
        .catch(err => {
            
            console.log(err);
        })
        }
        React.useEffect(()=>{
            ParentListData();
        }, [])

    return (
        <Box>
            <Card sx={{ minWidth: 250 }} variant="outlined"  key={card.id}>
                <CardHeader title={card.name}/>
                <Divider/>
                <CardContent>
                    {/* <Typography variant="h5" component="div" >
                     {project.name}
                    </Typography> */}
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Description:</Box>
                    
                    </Typography>
                    <div>
                    <Typography sx={{ fontSize: 14 }} noWrap  dangerouslySetInnerHTML={{__html: card.description}}>
                    
                    </Typography>
                    </div>
                    
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Created on :</Box>
                    {moment(created.slice(0, created.length -1)).format("MMMM Do YYYY, h:mm a")}
                    </Typography>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Due :</Box>
                    {moment(due.slice(0, due.length -1)).utc(true).format("MMMM Do YYYY, h:mm a")}
                    </Typography>

                    
                </CardContent>
                <CardActions >
                    <Button  
                    variant="contained" 
                    disableElevation
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}
                    onClick={(e)=>{
                        e.preventDefault();
                        
                        history.push(`/projects/${parentData.parent_project}/lists/${l_id}/cards/${card.id}`) 
                        }}
                    >Open</Button>
                </CardActions>
        </Card>
        </Box>
    );
};

export default CardShow;   