import React, {Component} from 'react';
import Button from '@material-ui/core/Button';




function Login(){
    const handleClick = (e) => {
        e.preventDefault();
        window.location.href = "https://channeli.in/oauth/authorise/?client_id=INhtorJkF0OWireWXlzYgdEo4oly2WLBLtYuvABI&redirect_uri=http://localhost:3000/oauth";

    }
    return(
        <Button onClick={handleClick}>Sign In with Channel-I</Button>
    );
}
export default Login;
