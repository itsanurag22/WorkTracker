import './App.css';
import {React} from 'react';
import Login from './components/Login/login';
import OAuth from './components/Login/oauth';
import Dashboard from './components/dashboard';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Sidebar from './components/sidebar';
import Titlebar from './components/titlebar';
import { MyProjects } from './components/myprojects';
import { MyCards } from './components/mycards';
import { AllProjects } from './components/allprojects';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/oauth' component={OAuth}/>
        <Route exact path='/dashboard' component={Dashboard}/>
        {/* <Route exact path='/logout' component={Logout}/> */}
        <Route exact path='/titlebar' component={Titlebar}/>
        <Route exact path='/myprojects' component={MyProjects}/>
        <Route exact path='/mycards' component={MyCards}/>
        <Route exact path='/allprojects' component={AllProjects}/>
      </Switch>
    </Router>
  );
}

export default App;
