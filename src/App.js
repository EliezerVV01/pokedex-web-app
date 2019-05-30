import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Pokedex from './containers/Pokedex/Pokedex'
import SignIn from './containers/SignIn/SignIn'
import SignUp from './containers/SignUp/SignUp'
import Profile from './containers/Profile/Profile'
import Logout from './components/Logout/Logout'
import ValidateEmail from './containers/ValidateEmail/ValidateEmail'
import NotFoundPage from './ErrorPages/NotFoundPage/NotFoundPage'
import AuthenticatedRoute from './Routes/AuthenticatedRoute/AuthenticatedRoute';
import UnauthenticatedRoute from './Routes/UnanthenticatedRoute/UnauthenticatedRoute';



library.add(faUser, faSignOutAlt)

class App extends Component {

  render() {
    return (
      <div>

     
          <Switch>
            <UnauthenticatedRoute path="/signin" exact component={SignIn} />
            <AuthenticatedRoute path="/logout" exact component={Logout} />
            <UnauthenticatedRoute path="/signup" exact component={SignUp} />
            <AuthenticatedRoute path="/profile" exact component={Profile} />
            <AuthenticatedRoute path="/" exact component={Pokedex} />
            <AuthenticatedRoute path="/validate" exact component={ValidateEmail} />
            <AuthenticatedRoute path="/validate/:token" exact component={ValidateEmail} />
            <Route component={NotFoundPage} />
          </Switch>
     

      </div>
    );
  }
}


export default App;
