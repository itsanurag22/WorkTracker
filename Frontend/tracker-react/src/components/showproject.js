// @flow
import axios from 'axios';
import * as React from 'react';
import { useHistory, useParams } from 'react-router';
import cookie from 'react-cookies';
import { Box } from '@mui/system';
import { Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import SideBar from './sidebar';
import Title from './title';
import { Link } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export function ShowProject() {
    const drawerWidth = 240;
    const {p_id}= useParams()
    // const [projDetail, setProjDetail] = React.useState({})
    const [projName, setProjName] = React.useState('')
    const [creator, setCreator] = React.useState([])
    const [des, setDes]=React.useState('')
    const [updateDes, setUpdateDes]=React.useState('')
    const [errDelete, setErrDelete]=React.useState(false)
    // const [current, setCurrent] = React.useState([])
    const [members, setMembers] = React.useState([])
    const [updateMembers, setUpdateMembers] = React.useState([])
    const [name, setName] = React.useState('')
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [users, setUsers] = React.useState([])
    const [updateErr, setUpdateErr] = React.useState(false)
    const [deleteErr, setDeleteErr] = React.useState(false)
    const mytoken = cookie.load("authtoken")
    const history = useHistory();
    const [updateProj, setUpdateProj]=React.useState(false)
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
        }
    },
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
      },
    variant: "menu",
    getContentAnchorEl: null
    };



    const handleUpdateProj = (e) => {
        e.preventDefault()
        updateProj? setUpdateProj(false): setUpdateProj(true)

    }

    const handleDeleteOpen = () => {
        setDeleteOpen(true)

    };
    const handleDeleteClose = () => {
        setDeleteOpen(false);
        setErrDelete(false)
    };
    const handleConfirmDelete = (event) => {
        event.preventDefault()
        console.log("delete")


        axios.delete(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log(response.data)
            console.log("deleted")
            setDeleteOpen(false)
            history.push(`/projects/`)


        })
        .catch(err => {
            
            console.log(err);
            setErrDelete(true)
        })

    };
    

    const handleNameChange =(e)=>{
            
        setName(e.target.value)
        setUpdateErr(false)
    };


    const handleFormSubmit = (e) => {
        e.preventDefault()
        

        console.log(name, updateDes, updateMembers)
        const data = {
            "name": name,
            "description" : updateDes,
            "project_members" : updateMembers

        }
        axios.patch(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/`,data,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
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
            setName(response.data.name);
            setCreator(response.data.creator);
            setDes(response.data.description);
            setUpdateDes(response.data.description)
            setMembers(response.data.project_members)
            setUpdateMembers(response.data.project_members)
            

            

            
            
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
    
    React.useEffect(()=>{
        ProjectDetail();
        UserData();
    }, [])


    return (
        <Box>
            <SideBar/>
            <Title title="Project Details"/>
            <Box mb={2} mr={3} sx={{  ml: `${drawerWidth}px` }}>
                <Grid container justifyContent="flex-end" spacing={2}>
                <Grid item pl={5}>
                <Button
                variant="outlined"
                startIcon={<ArrowBackIcon/>}
                onClick={(e)=>{
                    e.preventDefault();
                    
                    history.push('/projects') 
                    }}
                >
                    All projects
                </Button>
                </Grid>
                <Grid item xs/>
                <Grid item >
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    startIcon={updateProj?<KeyboardArrowUpIcon/>:<KeyboardArrowDownIcon/>} 
                    disableElevation
                    onClick={handleUpdateProj}
                    
                    >
                        Update Project
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
                        Delete Project
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
                {"Are you sure you want to delete this project?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="description" >
                    {errDelete? "Only admins and project members can delete project" : ""}
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
            {updateErr?<Box sx={{fontWeight: 'bold',color: '#D72323'}}>* Not Allowed! Only admin and project members can update project details</Box>: <Box></Box>}   
            {updateProj?
            
            <Box sx={{width: '50%', p:2, border:1,borderRadius:2, mb:4}} >
                <Typography variant="h5" gutterBottom>Update this Project</Typography>
                <Divider/>
            
            <form onSubmit={handleFormSubmit}>
            <Box sx={{ fontWeight: 'bold'}} mt={2} mb ={2} >
                    Project Name :
            </Box>
            <Box >
            <TextField 
            label="Name" 
            variant="outlined" 
            fullWidth
            required
            value={name}
            onChange={handleNameChange}        
            />
            </Box>
            <Box sx={{ fontWeight: 'bold'}} mt={2} mb ={1} >
                Description :
            </Box>
            <CKEditor
            editor={ ClassicEditor }
            onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor);
            }}
            data={updateDes}
            onChange={(event, editor) => {
                const data = editor.getData();
                setUpdateDes(data);
                setUpdateErr(false)
                
            }}
            />
            <Box sx={{ fontWeight: 'bold'}} mt={2} mb={1} >
                Project members :
            </Box>
            <Box>
                <FormControl style={{minWidth: 200}}>
                    <InputLabel id="name-label">Select members</InputLabel>
                        <Select 
                        MenuProps={MenuProps}
                        
                        labelId="name-label"
                        multiple={true}
                        autoWidth
                        
                        value={updateMembers}
                        onChange = {(e) => {
                            setUpdateMembers(e.target.value)
                            setUpdateErr(false)

                        }}
                        >
                        {users.map(user => {
                            if(user.id !== creator.id){
                            return (
                                <MenuItem key={user.id} value={user.id}>
                                {user.fullname}
                                </MenuItem>
                            )}
                        })}
                        </Select>
                </FormControl>
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
                <CardHeader title={projName}/>
                <Divider/>
                <CardContent>
                    
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Description:</Box>
                    
                    </Typography>
                    <div>
                    <Typography sx={{ fontSize: 14 }} style={{ wordWrap: "break-word" }}  dangerouslySetInnerHTML={{__html: des}}>
                    
                    </Typography>
                    </div>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Created By:</Box>
                    {creator.fullname}<br/>

                    </Typography>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1}  >Members:</Box>

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
                <CardActions >
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
                </CardActions>
                
        </Card>
        </Box>
        </Box>
        </Box>
        
    );
};



