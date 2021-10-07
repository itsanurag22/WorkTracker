import React from "react";
import axios from "axios";
import { useLocation } from "react-router";
import cookie from 'react-cookies'
import  { Redirect } from 'react-router-dom'
import Progress from '../progress'

class OAuth extends React.Component{
    constructor(props){
        super(props)
        this.state={isLoggedIn : false}
    }
    // checkLoginStatus(){
    //     axios.get('http://127.0.0.1:8200/tracker_app/checklogin', {withCredentials: false})
    //     .then(response => {
    //         console.log(response)
    //         if(response.data.loggedin){
    //             this.setState({isLoggedIn : true})
    //             console.log("Hi")
    //             window.location = "/dashboard"
    //         }
    //         else{
    //             this.setState({isLoggedIn : false})
    //         }
    //     })
    //     .catch(err => {
            
    //         console.log(err);
    //     })

    // }
    async componentDidMount(){
        // this.checkLoginStatus()
        const params = new URLSearchParams(window.location.search);
        const auth = params.get("code");

        axios.get('http://127.0.0.1:8200/tracker_app/token/?code='+auth+'&state=state', {withCredentials: true})
        .then(response => {
            console.log(response)
            cookie.save('csrftoken', response.data['csrftoken'], {path:"/"})
            cookie.save('sessionid', response.data['sessionid'], {path:"/"})
            cookie.save('authtoken', response.data['authtoken'], {path:"/"})
            this.setState({isLoggedIn : true})
            
        })
        .catch(err => {
            this.setState({isLoggedIn : false})
            console.log("error while authenticating");
        })
        
        

    }
    render(){
        if(this.state.isLoggedIn){
            return <Redirect to='/dashboard' />
        }
        else{
            return <Progress/>
        }
    }
}

export default OAuth;