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
import moment from 'moment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function CardDetails() {
    const drawerWidth = 240;
    const {p_id,l_id,c_id}= useParams()
    

    const [cardData, setCardData] = React.useState([])
    const [users, setUsers] = React.useState([])
    const [members, setMembers] = React.useState([])
    const [projMembers, setProjMembers] = React.useState([])

    const [name, setName] = React.useState('')
    const mytoken = cookie.load("authtoken")
    const history = useHistory();
    const [updateCard, setUpdateCard]=React.useState(false)
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [errDelete, setErrDelete]=React.useState(false)
    const [updateDes, setUpdateDes]=React.useState('')
    const [updateMembers, setUpdateMembers] = React.useState([])
    const [cardCreate, setCardCreate] = React.useState('')
    const [cardDue, setCardDue] = React.useState('')
    const [updateErr, setUpdateErr] = React.useState(false)
    const [updateDue, setUpdateDue] = React.useState(new Date())


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

    const handleUpdateCard = (e) => {
        e.preventDefault()
        updateCard? setUpdateCard(false): setUpdateCard(true)

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

        axios.delete(`http://127.0.0.1:8200/tracker_app/cards/${c_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log(response.data)
            console.log("deleted")
            setDeleteOpen(false)
            history.push(`/projects/${p_id}/lists/${l_id}/cards/`)


        })
        .catch(err => {
            
            console.log(err);
            setErrDelete(true)
        })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        
        const data = {
            "name": name,
            "description" : updateDes,
            "assignees" : updateMembers,
            "due_date" : updateDue

        }
        console.log(data)
        axios.patch(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/lists/${l_id}/cards/${c_id}/`,data,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
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
    
    async function CardDetail(){
        axios.get(`http://127.0.0.1:8200/tracker_app/cards/${c_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`}})
        .then(response => {
            console.log("before card")
            console.log(response.data);
            console.log("after card")
            setCardData(response.data)
            setCardCreate(response.data.created)
            setCardDue(response.data.due_date)
            setName(response.data.name)
            setMembers(response.data.assignees)
            setUpdateMembers(response.data.assignees)
            setUpdateDes(response.data.description);
            setUpdateDue(new Date(response.data.due_date))
            
            
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
    async function ProjMembersData(){
        axios.get(`http://127.0.0.1:8200/tracker_app/projects/${p_id}/`,  {headers:{"Content-Type": "application/json", "Authorization": `Token ${mytoken}`, accept:"application/json"}})
        .then(res => {
            console.log(res.data)
            setProjMembers(res.data.project_members)

        })
        .catch(err => {
            
            console.log(err);
        })
    }
    
    React.useEffect(()=>{
        CardDetail();
        UserData();
        ProjMembersData();
    }, [])


    return (
        <Box>
            <SideBar/>
            <Title title="Card Details"/>
            <Box mb={2} mr={3} sx={{  ml: `${drawerWidth}px` }}>
                <Grid container justifyContent="flex-end" spacing={2}>
                <Grid item pl={5}>
                <Button
                variant="outlined"
                startIcon={<ArrowBackIcon/>}
                onClick={(e)=>{
                    e.preventDefault();
                    
                    history.push(`/projects/${p_id}/lists/${l_id}/cards/`) 
                    }}
                >
                    List Cards
                </Button>
                </Grid>
                <Grid item xs/>
                <Grid item >
                    <Button  
                    variant="contained" 
                    style={{backgroundColor: '#3F72AF', color: '#F9F7F7'}}  
                    startIcon={updateCard?<KeyboardArrowUpIcon/>:<KeyboardArrowDownIcon/>} 
                    disableElevation
                    onClick={handleUpdateCard}
                    
                    >
                        Update Card
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
                        Delete Card
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
                {"Are you sure you want to delete this card?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="description">
                    {errDelete? "Only admins and project members can delete cards" : ""}
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
            {updateErr?<Box sx={{fontWeight: 'bold',color: '#D72323'}}>* Not Allowed! Only admin and project members can update card details</Box>: <Box></Box>}   
            {updateCard?
            
            <Box sx={{width: '50%', p:2, border:1,borderRadius:2, mb:4}} >
                <Typography variant="h5" gutterBottom>Update this Project</Typography>
                <Divider/>
            
            <form onSubmit={handleFormSubmit}>
            <Box sx={{ fontWeight: 'bold'}} mt={2} mb ={2} >
                    Card Name :
            </Box>
            <Box >
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
               
                console.log('Editor is ready to use!', editor);
            }}
            data={updateDes}
            onChange={(event, editor) => {
                const data = editor.getData();
                setUpdateDes(data);
                
            }}
            />
            <Box sx={{ fontWeight: 'bold'}} mt={2} mb={1} >
                Assigned to :
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
                        onChange = {(e) => 
                            setUpdateMembers(e.target.value)
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
                
                value={updateDue}
                onChange={(e)=>
                    setUpdateDue(e.target.value)
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
            <Box sx={{width: '60%', mt:2, mb:2}}>
            <Card variant="outlined">
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
                    {moment(cardCreate.slice(0, cardCreate.length-1)).format("MMMM Do YYYY, h:mm a")}<br/>

                    </Typography>
                    <Typography  gutterBottom><Box sx={{ fontWeight: 'bold'}} mt={1} >Due:</Box>
                    {moment(cardDue.slice(0, cardDue.length-1)).format("MMMM Do YYYY, h:mm a")}<br/>

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
                
                
        </Card>
        </Box>
        </Box>
        </Box>
        
    );
};