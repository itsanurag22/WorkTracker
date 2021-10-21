// @flow
import * as React from 'react';
import axios from 'axios';
import cookie from 'react-cookies'
import { makeStyles } from "@material-ui/core/styles";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Box } from '@mui/system';
import SideBar from './sidebar';
import Title from './title';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { useHistory } from 'react-router';


export function CreateProject() {
    const drawerWidth = 240;
    const [users, setUsers] = React.useState([])
    const [name, setName] = React.useState('')
    const [describe, setDescribe] = React.useState('')
    const [members, setMembers] = React.useState([])
    const [projData, setProjData] = React.useState([])
    const [nameErr, setNameErr] = React.useState(false)
    const [err, setErr] = React.useState(false)
    const [sameErr, setSameErr] = React.useState(false)
    // const [namecheck, setNamecheck] = React.useState(false)
    const history = useHistory();




    const mytoken = cookie.load("authtoken")
    const handleNameChange =(e)=>{
        setName(e.target.value)
        setSameErr(false)
        
        
        
    }
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


    async function UserData(){
        axios.get('http://127.0.0.1:8200/tracker_app/users/',  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log(response.data)
            setUsers(response.data)

        })
        .catch(err => {
            
            console.log(err);
        })
    }
    async function ProjData(){
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
        UserData();
        ProjData()
    }, [])

    const handleFormSubmit = (e) => {
        e.preventDefault()
        console.log(name, describe, members)
        setNameErr(false)
        if (name === '') {
            setNameErr(true)
          }
        else{
            const data = {
                "name":name,
                "description" : describe,
                "project_members" : members
    
            }
            axios.post('http://127.0.0.1:8200/tracker_app/projects/',data,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log("nacho bc")
            history.push(`/projects/`) 

        })
        .catch(err => {
            if(err.response.status === 400){
                setSameErr(true)
                console.log("Name already exists")
              }
            
            
            console.log(err);
        })


        }
        

    }


    
    return (
        <Box>
            <SideBar/>
            <Title title="Create a new project"/>
            <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            >
            {sameErr?<Box sx={{fontWeight: 'bold',color: '#D72323'}}>* Name already exists! Enter another name</Box>: <Box></Box>}
                <Box sx={{width: '60%', mt:2}} >
                    <form onSubmit={handleFormSubmit}>
                    <Box sx={{ fontWeight: 'bold'}} mt={1} mb ={1} >
                            Project Name :
                        </Box>
                        <TextField 
                        label="Name" 
                        variant="outlined" 
                        fullWidth
                        required
                        // helperText={namecheck ? <Typography style={{color:"#D72323"}}>This name already exists! Choose a different name.</Typography> : <Typography style={{color:"#1C7947"}}>Name available !</Typography>}
                        value={name}
                        onChange={handleNameChange}    
                        />
                        
                        <Box sx={{ fontWeight: 'bold'}} mt={2} mb ={1} >
                            Description :
                        </Box>
                        <CKEditor
                        editor={ ClassicEditor }
                        onReady={(editor) => {
                            // You can store the "editor" and use when it is needed.
                            console.log('Editor is ready to use!', editor);
                        }}
                        data=""
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setDescribe(data);
                            
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
                                    value={members}
                                    onChange = {(e) => 
                                        setMembers(e.target.value)
                                    }
                                    >
                                    {users.map(user => {
                                        return (
                                            <MenuItem key={user.id} value={user.id}>
                                            {user.fullname}
                                            </MenuItem>
                                        )
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
                                    
                                    history.push('/projects') 
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
                                    Create project
                                </Button>
                                </Grid>
                            </Grid>
                        </Box>


                        

                    </form>
                </Box>
            </Box>
        
        </Box>
    );
    }