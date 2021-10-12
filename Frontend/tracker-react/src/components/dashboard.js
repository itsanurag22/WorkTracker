import React from "react";
import { Typography, Button, Container } from "@material-ui/core";

import SideBar from "./sidebar";
import { Box } from "@mui/system";
import Title from "./title";

const drawerWidth = 240;
const Dashboard =() =>(
    
    <Box>
        <SideBar/>
        <Title title="Dashboard"/>
    {/* <Titlebar/> */}
    {/* <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
    <Typography
    variant="h6"
    component="h2"
    color="primary"
    align="center"
    >
    Welcome to dashboard
    </Typography>
        
    </Box> */}
    </Box>
)
export default Dashboard