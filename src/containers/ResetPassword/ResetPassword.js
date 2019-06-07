import React, { Component } from 'react';
import './ResetPassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '../../components/Button/Button';
import * as links from '../../Routes/RoutesList';
import Modal from '../../components/UI/Modal/Modal';
import Axios from 'axios';
import Form from './../../components/Form/Form';
import Input from './../../components/Input/Input';
import PokemonHappy from '../../Assets/Images/pokemon_happy.png';


class ResetPassword extends Component {

    state = {
        success: false,
        successMsg: 'Well done!',
        reseting: false,
        error: false,
        errorMessage: null,
        email: '',
        password: '',
    }

    closeModal = () => {
        this.setState({ error: false, errorMessage: null, success: false, successMsg:'' });
    }

    sendEmail = (e) => {
     e.preventDefault();
     const data ={
         email: this.state.email,
     }
     Axios.post('/users/tokenpassword/', data)
     .then((response) => {
         if(response.status===200){
            this.setState({success: true, successMsg: 'We have sent a email to you, so please click in a link in that email'});
         }else{
            this.setState({ error: true, errorMessage: "Something isn't OK, try later" })
         }
     } )
     .catch(err => {
        this.setState({ error: true });
        if (err.response) {
          this.setState({ errorMessage: err.response.data.errorMessage })
        } else if (err.request) {
          this.setState({ errorMessage: "¡Something went wrong! Try later" })
        } else {
          this.setState({ errorMessage: "¡There's something bad in the request!" })
        }
      })
    }

    resetPassword = (e) => {
        e.preventDefault();  
       const data={
            token: this.props.match.params.token,
            password: this.state.password
        }
       Axios.put('http://localhost:8080/api/users/resetpassword', data)
       .then((response)=>{
          if(response.status===200){
              this.setState({success: true, successMsg: 'Well done! your password has been updated'});
          }else{
              this.setState({error: true, errorMessage: 'Something is not good!'})
          }
       }).catch(err => {
        this.setState({ error: true });
        if (err.response) {
          this.setState({ errorMessage: err.response.data.errorMessage })
        } else if (err.request) {
          this.setState({ errorMessage: "¡Something went wrong! Try later" })
        } else {
          this.setState({ errorMessage: "¡There's something bad in the request!" })
        }
      });
    }

    componentDidMount = () => {
      this.props.match.params.token ? this.setState({reseting: true}) : this.setState({reseting: false})
    }

    render() {
        let modalError = (
            <Modal top="35%" show={this.state.error} id="ErrorModal">
                <h5 >{this.state.errorMessage}</h5>
                <Button className="btn btn-warning" clicked={() => this.closeModal()}>
                    <FontAwesomeIcon
                        icon="exclamation-circle" /> It's OK!</Button>
            </Modal>
        );
        let successModal= (
            <Modal top="35%" show={this.state.success} id="ErrorModal">
                <h5 >{this.state.successMsg}</h5>
                <Button className="btn btn-success" clicked={() => this.closeModal()}>
                 Great!</Button>
            </Modal>
        );

        let response = (<div>

        </div>);
        if (!this.state.reseting) {
            response = (
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
                        changed={(e) => this.setState({ email: e.target.value })}
                        value={this.state.email}/>
                    <Button
                        className="btn btn-info resetPass"
                        clicked={(e) => this.sendEmail(e)}
                    >Send email</Button>
                    <Button className="btn btn-link resetPass" clicked={(e)=> { e.preventDefault(); this.props.history.push({pathname: links.LOGIN})} }>
                    Want to log in?
                </Button>
                </Form>
            )
        } else {
            response = (
                <Form margin_top="75px">
                    <h5>New Password</h5>
                    <p>
                        Enter your password and click "reset"
                </p>
                    <img className="imageForResetPassword"
                        alt="pokemon"
                        src={PokemonHappy}
                    ></img>
                    <input 
                        className="InputElement" style={{marginTop: '7px'}}
                        type='password'
                        onChange={(e) => this.setState({ password: e.target.value })}
                        value={this.state.password} />
                    <Button
                        className="btn btn-info resetPass"
                        clicked={(e) => this.resetPassword(e)}
                    >Reset Password</Button>
                    <Button className="btn btn-link resetPass" clicked={(e)=> { e.preventDefault();  this.props.history.push({pathname: links.LOGIN})} }>
                    Want to log in?
                </Button>
                </Form>
            )
        }


        return (
            <div className="ResetPassword">
             {this.state.error ? modalError : null}
                {this.state.success? successModal : null}
                {response}
                
            </div>

        )
    }
}

export default ResetPassword;