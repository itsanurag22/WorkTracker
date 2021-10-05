import React from "react";
import { Typography, Button, Container } from "@material-ui/core";
import Titlebar from "./titlebar";
import SideBar from "./sidebar";

const Dashboard =() =>(
    <div>
        {/* <SideBar/> */}
    <Titlebar/>
    <Container>
    <Typography
    variant="h6"
    component="h2"
    color="primary"
    align="center"
    >
    Welcome to dashboard
    </Typography>
        
    </Container>
    </div>
)
export default Dashboard