import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SignIn.css';
import axios from 'axios';
import * as actions from './../../store/actions/actions';

import Logo from './../../components/Logo/Logo';


import { updateObject, checkValidity } from './../../utility/utility';

import Form from './../../components/Form/Form';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from './../../components/Input/Input';
import Button from './../../components/Button/Button';
import Modal from './../../components/UI/Modal/Modal';
import * as links from './../../Routes/RoutesList';
import Auxi from './../../hoc/Auxi';


class SignIn extends Component {

    _isMounted = false;

    state = {
        error: false,
        errorMessage: '',
        isLoading: false,
        formIsValid: false,
        userForm: {
            user: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter your email or user'
                },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true
                }
            },
            password: {
                elemenType: 'password',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true
                }
            },
        },
    }

    componentDidMount(){
        this._isMounted = true;
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedFormElement = updateObject(this.state.userForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.userForm[inputIdentifier].validation),
            touched: true,
        });

        const updatedUserForm = updateObject(this.state.userForm, {
            [inputIdentifier]: updatedFormElement
        });
        let formIsValid = true;
        for (let inputIdentifier in updatedUserForm) {
            formIsValid = updatedUserForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ userForm: updatedUserForm, formIsValid: formIsValid });
    }

    logUserHandler = (event) => {
        //This methods consume the login resource of the api 
        event.preventDefault();
        this.setState({ isLoading: true });
        const formData = {
            user: {}
        };
        for (let formElementIdentifier in this.state.userForm) {
            formData.user[formElementIdentifier] = this.state.userForm[formElementIdentifier].value;
        }
        axios.post('/users/login/', formData)
            .then(response => {    
               
                this.props.setToken(response.data.token);
                this.props.setUserEmail(response.data.email);
                this.props.setAuth(true);
               if(this._isMounted){
                    this.setState({ isLoading: false });
                }
            })
            .catch(err => {
                this.setState({ error: true, isLoading: false });
                if (err.response) {
                    this.setState({ errorMessage: err.response.data.errorMessage })
                } else if (err.request) {
                    this.setState({ errorMessage: "¡Something went wrong! Try later" })
                } else {
                    this.setState({ errorMessage: "¡There's something bad in the request!" })
                }
            });
    }

   

    cancelHandler = (event) => {
        event.preventDefault();
        this.props.history.push({ pathname: links.SIGNUP });

    }

    closeModal = () => {
        this.setState({ error: false, errorMessage: '' });
    }


    render() {
        const formElementsArray = [];
        for (let key in this.state.userForm) {
            formElementsArray.push({
                id: key,
                config: this.state.userForm[key]
            });
        }
        let controls = (
            formElementsArray.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)} />
            ))

        );
        if (this.state.isLoading) {
            controls = <Spinner />;
        }

        return (
            <Auxi>
                <Modal show={this.state.error} top="30%">
                    <h5>Failed</h5>
                    <p>{this.state.errorMessage}</p>
                    <Button className="btn btn-warning" clicked={() => this.closeModal()}>It's OK!</Button>
                </Modal>
                <div className="SignIn">
                    <Form margin_top="150px">
                        <div className="form-group">
                            <Logo className="Logo" link={false} />
                            <h5>Sign in now!</h5>
                            <div className="controls">
                                {controls}
                            </div>
                            <Button disabled={!this.state.formIsValid || this.state.isLoading}
                                clicked={(event) => this.logUserHandler(event)}
                                className="btn btn-info signin-btn">Sign in</Button>
                            <Button disabled={this.state.isLoading}
                                className="btn btn-light signup-btn"
                                clicked={(e) => this.cancelHandler(e)}> Need an account?</Button>
                               <Button disabled={this.state.isLoading}
                                className="btn btn-link resetPass"
                                clicked={(e) => { e.preventDefault(); this.props.history.push({pathname: links.RESETPASSWORD})}}> Forgot your password?</Button> 
                        </div>
                    </Form>
                </div>
            </Auxi>

        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.token,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setToken: (token) => dispatch(actions.setToken(token)),
        setAuth: (val) => dispatch(actions.setAuth(val)),
        setUserEmail: (email) => dispatch(actions.setUserEmail(email))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);