import React from 'react';
import PrivateRoute from './../PrivateRoute/PrivateRoute';
import { connect } from 'react-redux';


const unauthenticatedRoute = ( props ) =>{
    return(
   
        <PrivateRoute redirect={!props.auth} {...props}/>
    )
} 

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
};

export default connect(mapStateToProps)(unauthenticatedRoute);