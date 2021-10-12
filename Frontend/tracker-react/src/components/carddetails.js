// @flow
import axios from 'axios';
import * as React from 'react';
import { useHistory, useParams } from 'react-router';
import cookie from 'react-cookies';
import { Box } from '@mui/system';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@material-ui/core';
import SideBar from './sidebar';
import Title from './title';
import { Link } from 'react-router-dom';

export function CardDetails() {
    const drawerWidth = 240;
    const {c_id}= useParams()
    

    const [cardData, setCardData] = React.useState([])
    const [users, setUsers] = React.useState([])
    const [members, setMembers] = React.useState([])
    const mytoken = cookie.load("authtoken")
    const history = useHistory();

    async function CardDetail(){
        axios.get(`http://127.0.0.1:8200/tracker_app/cards/${c_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log("before card")
            console.log(response.data);
            console.log("after card")
            setCardData(response.data)
            setMembers(response.data.assignees)
            
            

            

            
            
        })
        .catch(err => {
            
            console.log(err);
        })
        }
    async function UserData(){
        axios.get('http://127.0.0.1:8200/tracker_app/users/',  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`, accept:"application/json"}})
        .then(res => {
            console.log(res.data)
            setUsers(res.data)

        })
        .catch(err => {
            
            console.log(err);
        })
    }
    // async function CurrentUserData(){
    //     axios.get('http://127.0.0.1:8200/tracker_app/current_user/',  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`, accept:"application/json"}})
    //     .then(res => {
    //         console.log(res.data)
    //         setCurrent(res.data)

    //     })
    //     .catch(err => {
            
    //         console.log(err);
    //     })
    // }
    React.useEffect(()=>{
        CardDetail();
        UserData();
    }, [])


    return (
        <Box>
            <SideBar/>
            <Title title="Project Details"/>
            <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} 
            display="flex"
            justifyContent="center"
            alignItems="center"
            >
            <Box sx={{width: '60%', mt:2}}>
            <Card variant="outlined" >
                <CardHeader title={cardData.name}/>
                <Divider/>
                <CardContent>
                    
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Description:</Box>
                    
                    </Typography>
                    <div>
                    <Typography sx={{ fontSize: 14 }} style={{ wordWrap: "break-word" }}  dangerouslySetInnerHTML={{__html: cardData.description}}>
                    
                    </Typography>
                    </div>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Created On:</Box>
                    {cardData.created}<br/>

                    </Typography>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Due:</Box>
                    {cardData.due_date}<br/>

                    </Typography>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1}  >Assigned to:</Box>

                    </Typography>
                    {
                                        members.map(function(member,index){
                                            return(
                                                    users.map(function(user,index2){
                                                    if(user.id===member){
                                                        return(
                
                                                                <Link style={{ textDecoration: 'none' }} to={`/members/${user.id}`}><Typography ><li>{user.fullname}</li></Typography></Link>
                                                            // </div>
                                                            
                                                        )
                                                    }
                                                })
                                            )
                                        })}
                    
                   
                    
                </CardContent>
                {/* <CardActions >
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    disableElevation 
                    // onClick={(e)=>{
                    //     e.preventDefault();
                        
                    //     history.push(`/projects/${p_id}/lists`) 
                    //     }}
                    >
                        Show Lists
                    </Button>
                </CardActions> */}
                
        </Card>
        </Box>
        </Box>
        </Box>
        
    );
};