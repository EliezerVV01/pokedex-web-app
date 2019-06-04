import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faSignOutAlt, faPlusCircle, faMapMarker, 
  faWindowClose, faCheckCircle, faExclamationCircle, faHandPointer, faPaw } from '@fortawesome/free-solid-svg-icons'
import Pokedex from './containers/Pokedex/Pokedex'
import AddPokemon from './containers/AddPokemon/AddPokemon'
import SignIn from './containers/SignIn/SignIn'
import SignUp from './containers/SignUp/SignUp'
import Profile from './containers/Profile/Profile'
import Logout from './components/Logout/Logout'
import ValidateEmail from './containers/ValidateEmail/ValidateEmail'
import NotFoundPage from './ErrorPages/NotFoundPage/NotFoundPage'
import AuthenticatedRoute from './Routes/AuthenticatedRoute/AuthenticatedRoute';
import UnauthenticatedRoute from './Routes/UnanthenticatedRoute/UnauthenticatedRoute';
import Axios from 'axios';



Axios.defaults.baseURL = 'http://localhost:8080/api/';


Axios.interceptors.request.use(request => {
    return request;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

/*
Axios.defaults.headers.common['Authorization'] = 'sadasd';
*/


library.add(faUser, faSignOutAlt, faPlusCircle, 
  faMapMarker, faWindowClose, faCheckCircle, 
  faExclamationCircle, faHandPointer, faPaw)

class App extends Component {

  render() {
    return (
      <div>

     
          <Switch>
            <UnauthenticatedRoute path="/signin" exact component={SignIn} />
            <UnauthenticatedRoute path="/validate" exact component={ValidateEmail} />
            <UnauthenticatedRoute path="/validate/:token" exact component={ValidateEmail} />
            <UnauthenticatedRoute path="/signup" exact component={SignUp} />
            <AuthenticatedRoute path="/logout" exact component={Logout} />
            <AuthenticatedRoute path="/profile" exact component={Profile} />
            <AuthenticatedRoute path="/" exact component={Pokedex} />
            <AuthenticatedRoute path="/addpokemon" exact component={AddPokemon} />
            <Route component={NotFoundPage} />
          </Switch>
     

      </div>
    );
  }
}


export default App;
