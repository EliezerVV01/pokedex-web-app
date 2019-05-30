import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import * as actions from '../../store/actions/actions';

import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../../hoc/Auxi';
import * as links from './../../Routes/RoutesList';

import './ValidateEmail.css';



class validateEmail extends Component {
    state = {
        error: false,
        errorMessage: '',
    }
    
    componentWillMount() {
        let token = this.props.match.params.token;
        let tokenData = {
            token: token,
        };
        if(token){
            axios.post('/users/verifyEmail', tokenData)
            .then(res => {
                this.props.setValidity(true);
            }).catch(err => {
                this.setState({error: true, isLoading: false});
                if(err.response){
                    this.setState({errorMessage: err.response.data.errorMessage})
                }else if(err.request){
                   this.setState({errorMessage:  "¡Something went wrong! Try later"})
                } else{
                   this.setState({errorMessage:  "¡There's something bad in the request!"}) 
                }
            })
        }
        
    }

    closeModal = () =>{
        this.setState({error: false, errorMessage: ''});
    }

    render() {
        let msg = (<div> You havent register or sign in yet!, do it now and get yourself an
        amazing pokedex,  <NavLink to={links.SIGNUP} exact>Click here!</NavLink> or <NavLink to={links.LOGIN} exact>Sign in</NavLink></div>);
        if (this.props.validatedUser) {
            msg = (<div>Congrats! Your account has been activated.
                Start now adding pokemons to
                your awesome pokedex. <NavLink to={links.LOGIN} exact>Sign in!</NavLink></div>);
        }
        if (this.props.validatedUser === false) {
            msg = (<div>Click in a link we have sent in an email to you, please look into the spam/junk folder
             if you cant find it. In case you haven't recieve any
             email, maybe you mistyped. <NavLink to={links.SIGNUP} exact>Sign up again!</NavLink></div>);
        }

        return (
            <Aux>
            <Modal show={this.state.error}>
                <h5>Alert!</h5>
           <p>{this.state.errorMessage}</p> 
            <Button className="btn btn-warning" clicked={ ()=> this.closeModal()}>It's OK!</Button>
            </Modal>
                <div className="ValidateEmail">
                    <Form margin_top="230px">
                        {msg}
                    </Form>
                </div>
            </Aux>

        )
    }

}
const mapStateToProps = state => {
    return {
        validatedUser: state.validated,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setValidity: (val) => dispatch(actions.setValidity(val)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(validateEmail);