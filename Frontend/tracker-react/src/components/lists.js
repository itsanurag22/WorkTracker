// @flow
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, TextField, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import axios from 'axios';
import * as React from 'react';
import cookie from 'react-cookies';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import SideBar from './sidebar';
import Title from './title';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export function Lists() {
    const {p_id}= useParams()
    const mytoken = cookie.load("authtoken")
    const [lists, setLists] = React.useState([])
    const drawerWidth = 240;
    const history = useHistory();
    const [createList, setCreateList]=React.useState(false)
    const [name, setName] = React.useState('')
    const projid=p_id;
    const handleNameChange =(e)=>{
            
        setName(e.target.value)
    }
    const handleFormSubmit = (e) => {
        e.preventDefault()
        console.log(name)
        const data = {
            "name":name,
            "parent_project":projid

        }
        axios.post(`http://127.0.0.1:8200/tracker_app/projects/${projid}/lists/`,data,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log("nacho bc")
            // history.push(`/projects/${projid}/lists`)
            history.go(0); 

        })
        .catch(err => {
            
            console.log(err);
        })

    }
    const handleCreateList = (e) => {
        e.preventDefault()
        createList? setCreateList(false): setCreateList(true)

    }



    async function ListsGet(){
        axios.get(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/lists/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log("hi")
            console.log(response.data);
            console.log("hello")
            setLists(response.data);
            

            

            
            
        })
        .catch(err => {
            
            console.log(err);
        })
        }
        React.useEffect(()=>{
            ListsGet();
            
        }, [])


    return (
        <Box>
            <SideBar/>
            <Title title="Project Lists"/>
            <Box mb={2} mr={3}>
                <Grid container justifyContent="flex-end">
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    startIcon={createList?<KeyboardArrowUpIcon/>:<KeyboardArrowDownIcon/>} 
                    disableElevation
                    onClick={handleCreateList}
                    >
                        Create a list
                    </Button>
                </Grid>
            </Box>
            <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            >
            {createList?
            
            <Box sx={{width: '50%', p:2, border:1,borderRadius:2, mb:4}} >
                <Typography variant="h5" gutterBottom>Create a  List</Typography>
                <Divider/>
            
            <form onSubmit={handleFormSubmit}>
            <Box sx={{ fontWeight: 'bold'}} mt={2} mb ={2} >
                    List Name :
            </Box>
            <Box mb={2}>
            <TextField 
            label="Name" 
            variant="outlined" 
            fullWidth
            required
            value={name}
            onChange={handleNameChange}        
            />
            </Box>
            

            <Button  
            variant="contained" 
            style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
            startIcon={<AddCircleOutlineIcon/>} 
            disableElevation
            type="submit" 
            >
                Create
            </Button>
            </form>
            </Box>
        
            :
            null
                }
            
            <Box sx={{width: '50%', mt:2, border:1, p:2, borderRadius:2}}>
            <Typography variant="h5" gutterBottom>Lists</Typography>
                <Divider/>
                {lists.length > 0 ?
                lists.map(list => (
                    <Box sx={{mt:2}}>
                        <Card variant="outlined" >
                            <CardHeader title={`${list.name}`} />
                            {/* <CardContent>
                            <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Name:</Box>
                                {list.name}
                            </Typography>
                            </CardContent> */}
                            <CardActions >
                                <Button  
                                variant="contained" 
                                style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                                disableElevation 
                                onClick={(e)=>{
                                    e.preventDefault();
                                    
                                    history.push(`/projects/${p_id}/lists/${list.id}`) 
                                    }}
                                >
                                    List Details
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>   

                    )): <p>No lists to show</p>}
                
            </Box>
            </Box>

        </Box>
    );
};