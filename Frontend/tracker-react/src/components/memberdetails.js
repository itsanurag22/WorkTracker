// @flow
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import axios from 'axios';
import * as React from 'react';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import SideBar from './sidebar';
import Title from './title';
import { useHistory, useParams } from 'react-router';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { blue } from '@material-ui/core/colors';




export function MemberDetails(){
    const drawerWidth = 240;
    const {m_id}= useParams()
    const [userDetails, setUserDetails] = React.useState([])
    const [projData, setProjData] = React.useState([])
    const [created, setCreated] = React.useState([])
    const [admin, setAdmin] = React.useState(false)
    const [banned, setBanned] = React.useState(false)
    const mytoken = cookie.load("authtoken")
    const history = useHistory();
    


    const handleAdminChange = async(state) =>{
        const data = {
            "admin_check" : !state
        };
        axios.patch(`http://127.0.0.1:8200/tracker_app/users/${m_id}/`,data,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log("nacho bc")
            history.go(0) 

        })
        .catch(err => {
            
            console.log(err);
        })


    }

    const handleRestriction = async(state) =>{
        const data2 = {
            "banned" : !state
        };
        axios.patch(`http://127.0.0.1:8200/tracker_app/users/${m_id}/`,data2,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log("nacho bc")
            history.go(0) 

        })
        .catch(err => {
            
            console.log(err);
        })


    }
    async function UserData(){
        axios.get(`http://127.0.0.1:8200/tracker_app/users/${m_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`, accept:"application/json"}})
        .then(res => {
            console.log(res.data)
            setUserDetails(res.data)
            setCreated(res.data.creator_of)
            setAdmin(res.data.admin_check)
            setBanned(res.data.banned)

            

        })
        .catch(err => {
            
            console.log(err);
        })
    }
    async function ProjectData(){
        axios.get('http://127.0.0.1:8200/tracker_app/projects/',  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log(response.data)
            setProjData(response.data)
            

            
            
        })
        .catch(err => {
            
            console.log(err);
        })
        }
    React.useEffect(()=>{
        ProjectData();
        UserData();
    }, [])


    return (
        <Box>
            <SideBar/>
            <Title title="Member Details"/>
            <Box mb={2} mr={3}
            sx={{  ml: `${drawerWidth}px` }}
            >
                <Grid container  justifyContent="flex-end" spacing={2}>
                <Grid item pl={5}>
                <Button
                variant="outlined"
                startIcon={<ArrowBackIcon/>}
                onClick={(e)=>{
                    e.preventDefault();
                    
                    history.push('/members') 
                    }}
                >
                    All members
                </Button>
                </Grid>
                <Grid item xs/>
                <Grid item >
                    {admin? 
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#D72323', color: '#F9F7F7'}}  
                    startIcon={<RemoveCircleOutlineIcon/>} 
                    disableElevation
                    onClick={() => {handleAdminChange(admin)}}
                    
                    >
                        Remove from admin
                    </Button>
                    :
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#FF9A3C', color: '#F9F7F7'}}  
                    startIcon={<AddCircleOutlineIcon/>}
                    disableElevation
                    onClick={() => {handleAdminChange(admin)}}
                    
                    >
                        Make admin
                    </Button>}
                </Grid>
                <Grid item >
                    {banned?
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#1C7947', color: '#F9F7F7'}}  
                    startIcon={<AddCircleOutlineIcon/>}
                    disableElevation
                    onClick={() => {handleRestriction(banned)}}
                    >
                        Allow user
                    </Button>
                    :
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#D72323', color: '#F9F7F7'}}  
                    startIcon={<BlockIcon/>} 
                    disableElevation
                    onClick={() => {handleRestriction(banned)}}
                    >
                        Restrict user
                    </Button>
                    }
                    
                </Grid>
                </Grid>
            </Box>
            <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            >
            <Box sx={{width: '50%', mt:2}}>
            
            <Card variant="outlined" >
                <CardHeader title='HI THERE!'/>
                <Divider/>
                <CardContent>
                <Grid container justifyContent="flex-end"> 
                 
                {userDetails.admin_check? <Box sx={{fontWeight: 'bold',color: '#FF9A3C'}}> Admin</Box> : 
                [(userDetails.banned? <Box sx={{fontWeight: 'bold',color: '#D72323'}}>Restricted</Box>:<Box sx={{fontWeight: 'bold',color: '#1FAB89'}}>Normal User</Box>)]}
                </Grid>   
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Username:</Box>
                    {userDetails.username}<br/>

                    </Typography>
                    
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Full name:</Box>
                    {userDetails.fullname}<br/>

                    </Typography>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Email address:</Box>
                    {userDetails.email_address}<br/>

                    </Typography>


                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1}  >Projects created:</Box>

                    </Typography>
                    {
                                        created.map(function(item,index){
                                            return(
                                                    projData.map(function(proj,index2){
                                                    if(proj.id===item){
                                                        return(
                
                                                                <Link style={{ textDecoration: 'none' }} to={`/projects/${proj.id}`}><Typography ><li>{proj.name}</li></Typography></Link>
                                                            // </div>
                                                            
                                                        )
                                                    }
                                                })
                                            )
                                        })}
                    {created.length>0?null:<Typography>None</Typography>}
                    
                   
                    
                </CardContent>
                {/* <CardActions >
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    disableElevation 
                    onClick={(e)=>{
                        e.preventDefault();
                        
                        history.push(`/projects/${p_id}/lists`) 
                        }}
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