import React, { Component } from 'react';
import './ResetPassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Layout from '../../hoc/Layout/Layout'
import Button from '../../components/Button/Button';
import * as links from '../../Routes/RoutesList';
import { connect } from 'react-redux';
import Modal from '../../components/UI/Modal/Modal';
import Axios from 'axios';
import Spinner from '../../components/UI/Spinner/Spinner';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import MissingNo from './../../Assets/Images/missing_no.png';
import Form from './../../components/Form/Form';
import Input from './../../components/Input/Input';
import PokemonHappy from '../../Assets/Images/pokemon_happy.png';


class ResetPassword extends Component {


    state = {
        error: false,
        errorMessage: null,
        email: null
    }

    closeModal = () => {
        this.setState({ error: false, errorMessage: null });
    }

    sendEmail = () => {
      alert();
    }


    render() {
        let modalError = (
            <Modal top="35%" show={this.state.error} id="ErrorModal" modalClosed={this.closeModal}>
                <h5 style={{textAlign: 'center'}}>{this.state.errorMessage}</h5>
                <Button className="btn btn-warning" clicked={() => this.closeModal()}>
                    <FontAwesomeIcon
                        icon="exclamation-circle" /> It's OK!</Button>
            </Modal>
        );


        return (
                <div className="ResetPassword">
                {this.state.error ? modalError : null}
                    <Form margin_top="75px">
                    <h5>Reset Password</h5>
                    <p>
                        Write your email in the next text box then you click "Send"
                    </p>
                    <img className="imageForResetPassword"
                    alt="pokemon"
                    src={PokemonHappy}
                    ></img>
                    <Input
                    elementType='input'
                    changed={(e)=>this.setState({email: e.target.value})} 
                    value={this.state.email}/>
                    <Button
                     className="btn btn-info resetPass"
                     clicked={()=>this.sendEmail()}
                    >Send email</Button>
                    </Form>
                </div>
             
        )
    }
}




export default ResetPassword;