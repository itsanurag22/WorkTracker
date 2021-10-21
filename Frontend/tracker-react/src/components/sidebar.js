import React from 'react'
import { Divider, makeStyles } from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import { useHistory, useLocation } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
// import { AddCircleOutlineOutlined, SubjectOutlined } from '@material-ui/icons'
import cookie from 'react-cookies'
import axios from "axios";
import { Button } from '@material-ui/core'
import { Box } from '@mui/system'
import WorkIcon from '@mui/icons-material/Work';
import ContentPasteSharpIcon from '@mui/icons-material/ContentPasteSharp';
import { autocompleteClasses } from '@mui/material'
import ContentPasteSharp from '@mui/icons-material/ContentPasteSharp'



const drawerWidth = 240
const useStyles = makeStyles(() => {
  return {
    
    page: {
      background: '#f9f9f9',
      width: '100%',

    },
    listitem:{
      '&:hover': {
        backgroundColor: '#FFFFFF',
      },
    },
    root2: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: "#DBE2EF"
    },
    active: {
      background: '#ffffff',
      '&:hover': {
        backgroundColor: '#ffffff',
      },
    },
    largeIcon: {
      width: 30,
      height: 30,
    },
  

    
  }
})

export default function SideBar() {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const user_id = cookie.load("userid")
  const menuItems = [
    
    { 
      text: 'All Projects', 
      
      path: '/projects' 
    },
    { 
      text: 'My Projects', 
      
      path: '/myprojects' 
    },
    { 
      text: 'My Cards', 
      
      path: '/mycards' 
    },
    { 
      text: 'My Profile', 
      
      path: `/members/${user_id}/` 
    },
    
    { 
      text: 'Members', 
      
      path: '/members' 
    },
  ];
  

  return (
    <div className={classes.root2}>
      {/* app bar */}

      {/* side drawer */}
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
        anchor="left"
      >
        <Box mt={2} mb={2} ml={3.75} mr={3.75}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent:'space-between'
        }}>
            <ContentPasteSharp className={classes.largeIcon}/>
            <Typography variant="h5" >
            <strong>WorkTracker</strong>
            
          </Typography>
        </div> 
          
        </Box>
    <Divider/>
        {/* links/list section */}
        <List>
          {menuItems.map((item) => (
            <ListItem 
              
              button 
              key={item.text} 
              onClick={() => history.push(item.path)}
              className={location.pathname === item.path ? classes.active : classes.listitem}
            >
              
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        {/* <List style={{ marginTop: `auto` }} >
    <ListItem>
      <ListItemText>
      <Button variant="contained" onClick={()=>{logOut()}}>
              Logout
            </Button>
      </ListItemText>
    </ListItem>
  </List> */}
        
      </Drawer>

      
    </div>
  )
}