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
const drawerWidth = 240

const useStyles = makeStyles(() => {
  return {
    page: {
      background: '#f9f9f9',
      width: '100%',

    },
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    active: {
      background: '#f4f4f4'
    },

    
  }
})

export default function SideBar() {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  const menuItems = [
    { 
      text: 'Dashboard', 
      
      path: '/dashboard' 
    },
    { 
      text: 'All Projects', 
      
      path: '/' 
    },
    { 
      text: 'My Projects', 
      
      path: '/myprojects' 
    },
    { 
      text: 'My Cards', 
      
      path: '/' 
    },
  ];
  const logOut = () =>{
    const mytoken = cookie.load("csrftoken")
    axios.get('http://127.0.0.1:8200/tracker_app/logout',  {headers:{"Authorization": `Token ${mytoken}`}})
    .then(response => {
        console.log(response)
        cookie.remove('csrftoken')
        cookie.remove('sessionid')
        cookie.remove('authtoken')
        history.push('/')
        
        
    })
    .catch(err => {
        
        console.log(err);
    })
}

  return (
    <div className={classes.root}>
      {/* app bar */}

      {/* side drawer */}
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
        anchor="left"
      >
        <Box m={3}>
          <Typography variant="h5" >
            WorkTracker
          </Typography>
        </Box>
    <Divider/>
        {/* links/list section */}
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => history.push(item.path)}
              className={location.pathname === item.path ? classes.active : null}
            >
              
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <List style={{ marginTop: `auto` }} >
    <ListItem>
      <ListItemText>
      <Button variant="contained" onClick={()=>{logOut()}}>
              Logout
            </Button>
      </ListItemText>
    </ListItem>
  </List>
        {/* <div className={classes.bottomPush}>
          <Typography>
            <Button variant="contained" onClick={()=>{logOut()}}>
              Logout
            </Button>
          </Typography>
        </div> */}
        
      </Drawer>

      
    </div>
  )
}