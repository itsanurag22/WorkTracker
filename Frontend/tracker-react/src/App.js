import './App.css';
import {React} from 'react';
import Login from './components/Login/login';
import OAuth from './components/Login/oauth';
import Dashboard from './components/dashboard';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Sidebar from './components/sidebar';

import { MyProjects } from './components/myprojects';
import { MyCards } from './components/mycards';
import { AllProjects } from './components/allprojects';
import Title from './components/title';
import { Members } from './components/members';
import { CreateProject } from './components/createproject';
import { ShowProject } from './components/showproject';
import { Lists } from './components/lists';
import { ListDetail } from './components/listdetail';
import { ListCards } from './components/cards';
import { CardDetails } from './components/carddetails';
import { MemberDetails } from './components/memberdetails';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/oauth' component={OAuth}/>
        <Route exact path='/dashboard' component={Dashboard}/>
        {/* <Route exact path='/logout' component={Logout}/> */}
        {/* <Route exact path='/titlebar' component={Titlebar}/> */}
        <Route exact path='/myprojects' component={MyProjects}/>
        <Route exact path='/mycards' component={MyCards}/>
        <Route exact path='/projects' component={AllProjects}/>
        <Route exact path='/title' component={Title}/>
        <Route exact path='/members' component={Members}/>
        <Route exact path='/createproject' component={CreateProject}/>
        <Route exact path='/projects/:p_id' component={ShowProject}/>
        <Route exact path='/projects/:p_id/lists' component={Lists}/>
        <Route exact path='/projects/:p_id/lists/:l_id' component={ListDetail}/>
        <Route exact path='/projects/:p_id/lists/:l_id/cards' component={ListCards}/>
        <Route exact path='/projects/:p_id/lists/:l_id/cards/:c_id' component={CardDetails}/>
        <Route exact path='/members/:m_id/' component={MemberDetails}/>
      </Switch>
    </Router>
  );
}

export default App;
