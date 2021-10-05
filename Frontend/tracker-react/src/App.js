import './App.css';
import {React} from 'react';
import Login from './components/Login/login';
import OAuth from './components/Login/oauth';
import Dashboard from './components/dashboard';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Sidebar from './components/sidebar';
import Titlebar from './components/titlebar';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/oauth' component={OAuth}/>
        <Route exact path='/dashboard' component={Dashboard}/>
        {/* <Route exact path='/logout' component={Logout}/> */}
        <Route exact path='/titlebar' component={Titlebar}/>
      </Switch>
    </Router>
  );
}

export default App;
