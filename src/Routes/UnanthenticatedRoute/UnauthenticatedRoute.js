import React from 'react';
import PublicRoute from '../PublicRoute/PublicRoute';
import { connect } from 'react-redux';


const authenticatedRoute = ( props ) =>{
    return(
   
        <PublicRoute redirect={props.auth} {...props}/>
    )
} 

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
};

export default connect(mapStateToProps)(authenticatedRoute);