// @flow
import { Button, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import axios from 'axios';
import * as React from 'react';
import cookie from 'react-cookies'
import ProjectCard from './projectcard';
import SideBar from './sidebar';
import { makeStyles } from "@material-ui/core/styles";
import { ClassNames } from '@emotion/react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CardShow from './cardshow';
import Title from './title';
import { useHistory, useParams } from 'react-router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const useStyles = makeStyles({
  cardGrid: {
    margin: "auto"

  },
  
});

export function ListCards() {
        const mytoken = cookie.load("authtoken")
        const { p_id, l_id } = useParams()
        const [cardData, setCardData] = React.useState([])
        const drawerWidth = 240;
        const [name, setName] = React.useState('')
        const [describe, setDescribe] = React.useState('')
        const classes = useStyles();
        const [due, setDue] = React.useState(new Date())
        const [createCard, setCreateCard]=React.useState(false)
        const [assignees, setAssignees] = React.useState([])
        const [users, setUsers] = React.useState([])
        const [createErr, setCreateErr]=React.useState(false)
        const [projMembers, setProjMembers] = React.useState([])
        const history = useHistory();
        const handleCreateCard = (e) => {
            e.preventDefault()
            createCard? setCreateCard(false): setCreateCard(true)
    
        }
        const handleFormClose = (e) => {
            e.preventDefault()
            setName('')
            setDescribe('')
            setDue(new Date())
            setAssignees([])
            setCreateCard(false)

        }
        const handleFormSubmit = (e) => {
            e.preventDefault()
            
            const data={
                "name": name,
                "description" : describe,
                "parent_list": l_id,
                "due_date": due,
                "assignees": assignees

            }
            console.log(data)
            axios.post(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/lists/${l_id}/cards/`,data,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log("nacho bc")
            history.go(0)

        })
        .catch(err => {
            if(err.response.status === 403){
                setCreateErr(true)
                console.log("Restricted")
              }
            console.log(err);
        })



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
        async function ProjMembersData(){
            axios.get(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
            .then(response => {
                console.log(response.data)
                setProjMembers(response.data.project_members)
    
            })
            .catch(err => {
                
                console.log(err);
            })
        }
        async function ListCardData(){
        axios.get(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/lists/${l_id}/cards`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log(response.data)
            setCardData(response.data)

            
            
        })
        .catch(err => {
            
            console.log(err);
        })
        }
        React.useEffect(()=>{
            ListCardData();
            UserData();
            ProjMembersData();
        }, [])
        
    

  return (
    <Box>

        <SideBar/>
        <Title title="List Cards"/>
        <Box mb={2} mr={3} sx={{  ml: `${drawerWidth}px` }}>
                <Grid container justifyContent="flex-end" spacing={2}>
                <Grid item pl={5}>
                <Button
                variant="outlined"
                startIcon={<ArrowBackIcon/>}
                onClick={(e)=>{
                    e.preventDefault();
                    
                    history.push(`/projects/${p_id}/lists/${l_id}/`) 
                    }}
                >
                    Parent list
                </Button>
                </Grid>
                <Grid item xs/>
                <Grid item >
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    startIcon={createCard?<KeyboardArrowUpIcon/>:<KeyboardArrowDownIcon/>} 
                    disableElevation
                    onClick={handleCreateCard}
                    >
                        Create a card
                    </Button>
                    </Grid>
                </Grid>
        </Box>

        <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        >
        {createErr?<Box sx={{fontWeight: 'bold',color: '#D72323'}}>* Not Allowed! Only admin and project members can create a card</Box>: <Box></Box>}
        {createCard?
            
        <Box sx={{width: '50%', p:2, border:1,borderRadius:2, mb:4}} >
            <Typography variant="h5" gutterBottom>Create a  Card</Typography>
            <Divider/>
            
            <form onSubmit={handleFormSubmit}>
            <Box sx={{ fontWeight: 'bold'}} mt={2} mb ={2} >
                    Card Name :
            </Box>
            <Box mb={2}>
            <TextField 
            label="Name" 
            variant="outlined" 
            fullWidth
            required
            value={name}
            onChange={(e)=>
                setName(e.target.value)
            }        
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
            data=""
            onChange={(event, editor) => {
                const data = editor.getData();
                setDescribe(data);
                
            }}
            />
            <Box sx={{ fontWeight: 'bold'}} mt={2} mb={1} >
                Assigned to :
            </Box>
            <Box mb={2}>
                <FormControl style={{minWidth: 200}}>
                    <InputLabel id="name-label">Select assignees</InputLabel>
                        <Select 
                        MenuProps={MenuProps}
                        
                        labelId="name-label"
                        multiple={true}
                        autoWidth
                        
                        value={assignees}
                        onChange = {(e) => 
                            setAssignees(e.target.value)
                        }
                        >
                        {
                        projMembers.map(function(member,index){
                            return(
                                    users.map(function(user,index2){
                                    if(user.id===member){
                                        return(

                                            <MenuItem key={user.id} value={user.id}>
                                            {user.fullname}
                                            </MenuItem>
                                            
                                        )
                                    }
                                })
                            )
                        })}  
                        
                        </Select>
                </FormControl>
            </Box>
            <Box sx={{ fontWeight: 'bold'}} mt={2} mb ={2} >
                    Due date & time :
            </Box>
            <Box mb={2}>
                <TextField 
                 
                variant="outlined" 
                type="datetime-local"
                fullWidth
                required
                value={due}
                onChange={(e)=>
                    setDue(e.target.value)
                }        
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
                    onClick={handleFormClose}
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
                        Create card
                    </Button>
                    </Grid>
                </Grid>
            </Box>
            </form>
            </Box>
        
            :
            null
                }
            
            <Container disableGutters>
                <Box sx={{pl:2}}>
                <Grid container spacing={4} xs={12} sx={{m:0}} >
                    {cardData.length>0 ? 
                    cardData.map(card => (
                        <Grid item xs={12} md={6} lg={4} key={card.id}>
                            <CardShow cardState ={card}/>

                        </Grid>
                        

                    )) : <Box sx={{m:2}}><Typography>No Cards to show</Typography></Box>}
                </Grid>
                </Box>
            </Container>
        </Box>
    </Box>
  );
};