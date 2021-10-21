// @flow
// @flow
import axios from 'axios';
import * as React from 'react';
import { useHistory, useParams } from 'react-router';
import cookie from 'react-cookies';
import { Box } from '@mui/system';
import { Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, TextField, Typography } from '@material-ui/core';
import SideBar from './sidebar';
import Title from './title';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function ListDetail() {
    const drawerWidth = 240;
    const { p_id, l_id } = useParams()
    const [projName, setProjName] = React.useState('')
    const [members, setMembers] = React.useState([])
    const [listDetails, setListDetails] = React.useState([])
    const [updateList, setUpdateList]=React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [errDelete, setErrDelete]=React.useState(false);
    const [users, setUsers] = React.useState([])
    const mytoken = cookie.load("authtoken")
    const history = useHistory();
    const [updateName, setUpdateName]=React.useState('')
    const [updateErr, setUpdateErr]=React.useState(false)
    const projid = p_id;
    const handleUpdateList = (e) => {
        e.preventDefault()
        updateList? setUpdateList(false): setUpdateList(true)

    }

    const handleDeleteOpen = () => {
        setDeleteOpen(true)

    };
    const handleDeleteClose = () => {
        setDeleteOpen(false);
        setErrDelete(false)
    };

    const handleUpdateNameChange =(e)=>{
            
        setUpdateName(e.target.value)
    };

    const handleConfirmDelete = (event) => {
        event.preventDefault()
        console.log("delete")


        axios.delete(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/lists/${l_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log(response.data)
            console.log("deleted")
            setDeleteOpen(false)
            history.push(`/projects/${p_id}/lists/`)


        })
        .catch(err => {
            
            console.log(err);
            setErrDelete(true)
        })

    };

    const handleFormSubmit = (e) => {
        e.preventDefault()
        

        console.log(updateName)
        const data = {
            "name": updateName,
            "parent_project" : projid

        }
        axios.patch(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/lists/${l_id}/`,data,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log("nacho bc")
            history.go(0) 

        })
        .catch(err => {
            if(err.response.status === 403){
                setUpdateErr(true)
                console.log("Restricted")
              }
            console.log(err);
        })


    }

    async function ProjectDetail(){
        axios.get(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log("before")
            console.log(response.data);
            console.log("after")
            setProjName(response.data.name);
            
            
            setMembers(response.data.project_members)

            
        })
        .catch(err => {
            
            console.log(err);
        })
        }
    
    async function ListDetail(){
        axios.get(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/lists/${l_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(res => {
            console.log("before2")
            console.log(res.data);
            console.log("after2")
            setListDetails(res.data)
            setUpdateName(res.data.name)

            
            
        })
        .catch(err => {
            
            console.log(err);
        })
        }
    
    React.useEffect(()=>{
        ProjectDetail();
        ListDetail();
    }, [])


    return (
        <Box>
            <SideBar/>
            <Title title="List Details"/>
            <Box mb={2} mr={3} sx={{  ml: `${drawerWidth}px` }}>
                <Grid container justifyContent="flex-end" spacing={2}>
                <Grid item pl={5}>
                <Button
                variant="outlined"
                startIcon={<ArrowBackIcon/>}
                onClick={(e)=>{
                    e.preventDefault();
                    
                    history.push(`/projects/${p_id}/lists/`) 
                    }}
                >
                    Project lists
                </Button>
                </Grid>
                <Grid item xs/>
                <Grid item >
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    startIcon={updateList?<KeyboardArrowUpIcon/>:<KeyboardArrowDownIcon/>} 
                    disableElevation
                    onClick={handleUpdateList}
                    
                    >
                        Update List
                    </Button>
                </Grid>
                <Grid item >
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#D72323', color: '#F9F7F7'}}  
                    startIcon={<DeleteIcon/>} 
                    disableElevation
                    onClick={handleDeleteOpen}
                    >
                        Delete List
                    </Button>
                </Grid>
                </Grid>
            </Box>
            <Dialog
                open={deleteOpen}
                onClose={handleDeleteClose}
                aria-labelledby="title"
                aria-describedby="description"
            >
                <DialogTitle id="title">
                {"Are you sure you want to delete this list?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="description">
                    {errDelete? "Only admins and project members can delete this list" : ""}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDeleteClose}>Cancel</Button>
                <Button onClick={handleConfirmDelete} autoFocus>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            >
            {updateErr?<Box sx={{fontWeight: 'bold',color: '#D72323'}}>* Not Allowed! Only admin and project members can update list details</Box>: <Box></Box>}   
            {updateList?
            
            <Box sx={{width: '50%', p:2, border:1,borderRadius:2, mb:4}} >
                <Typography variant="h5" gutterBottom>Update this Project</Typography>
                <Divider/>
            
            <form onSubmit={handleFormSubmit}>
            <Box sx={{ fontWeight: 'bold'}} mt={2} mb ={2} >
                    List Name :
            </Box>
            <Box >
            <TextField 
            label="Name" 
            variant="outlined" 
            fullWidth
            
            value={updateName}
            onChange={handleUpdateNameChange}        
            />
            </Box>
      

            <Box mt={5}>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item >
                    <Button  
                    variant="outlined" 
                    style={{ color: '#D72323'}}  
                    startIcon={<CancelIcon/>} 
                    disableElevation
                    onClick={(e)=>{
                        e.preventDefault();
                        
                        history.go(0) 
                        }}
                    >
                        Close
                    </Button>
                    </Grid>
                    <Grid item >
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    startIcon={<AddCircleOutlineIcon/>} 
                    disableElevation
                    type="submit" 
                    >
                        Update
                    </Button>
                    </Grid>
                </Grid>
            </Box>
            </form>
            </Box>
        
            :
            null
                }
            
            <Box sx={{width: '60%', mt:2}}>
            <Card variant="outlined" >
                <CardHeader title={listDetails.name}/>
                <Divider/>
                <CardContent>
                <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Parent Project:</Box>
                    {projName}<br/>

                </Typography>
                
                    
                </CardContent>
                <CardActions >
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    disableElevation 
                    onClick={(e)=>{
                        e.preventDefault();
                        
                        history.push(`/projects/${p_id}/lists/${l_id}/cards/`) 
                        }}
                    >
                        Show Cards
                    </Button>
                </CardActions>
                
        </Card>
        </Box>
        </Box>
        </Box>
        
    );
};