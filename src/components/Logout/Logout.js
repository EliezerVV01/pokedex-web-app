import React from 'react';
import { connect } from 'react-redux';
import * as actions from './../../store/actions/actions';
import { Redirect } from 'react-router-dom'
import * as links from './../../Routes/RoutesList';


const logout = ( props ) => {
  props.setUserEmail('');
  props.setAuth(false);
  props.setToken('');
  return(<div>
    <Redirect to={links.LOGIN}></Redirect>
  </div>)
};

const mapDispatchToProps = dispatch => {
    return {
        setAuth: (val) => dispatch(actions.setAuth(val)),
        setToken: (token) => dispatch(actions.setToken(token)),
        setUserEmail: (email) => dispatch(actions.setUserEmail(email))
    };
};

export default connect(null, mapDispatchToProps)(logout);
