import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import * as actions from './../../store/actions/actions';

import Logo from './../../components/Logo/Logo';

import Form from './../../components/Form/Form';
import Auxi from './../../hoc/Auxi';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from './../../components/Input/Input';
import Button from './../../components/Button/Button';
import Modal from './../../components/UI/Modal/Modal';



import { updateObject, checkValidity } from './../../utility/utility';

import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.css';
import './SignUp.css';
import * as links from './../../Routes/RoutesList';



class SignUp extends Component {

    state = {
        error: false,
        errorMessage:'',
        isLoading: false,
        formIsValid: false,
        userForm: {
            userName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Username'
                },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    maxLength: 20,
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
                    required: true,
                    maxLength: 50,
                }
            },
            firstName: {
                elemenType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'First name'
                },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    maxLength: 25,
                }
            },
            lastName: {
                elemenType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Last name'
                },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    maxLength: 50,
                }
            },
            email: {
                elemenType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Enter your email'
                },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    isEmail: true,
                    maxLength: 50,
                }
            },
            gender: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: '', displayValue: 'Choose your gender' },
                        { value: 'true', displayValue: 'Male' },
                        { value: 'false', displayValue: 'Female' }
                    ]
                },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                }
            },
            address: {
                elemenType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Address'
                },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    maxLength: 100,
                }
            },
            birthDate: {
                elemenType: 'date',
                elementConfig: {
                    type: 'date',
                    placeholder: 'Select your birthdate'
                },
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                }
            },
        },
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



    addUserHandler = (event) => {
        event.preventDefault();
        this.setState({isLoading: true});
        const formData = {
            user: {}
        };
        for (let formElementIdentifier in this.state.userForm) {
            formData.user[formElementIdentifier] = this.state.userForm[formElementIdentifier].value;
        }   
        
        axios.post('/users/create/', formData)
         .then( response => {
          this.setState({isLoading: false});
            this.props.setValidity(false);
            this.props.history.push({ pathname: links.VALIDATE});
         })
       .catch(err => {
             this.setState({error: true, isLoading: false});
             if(err.response){
                 this.setState({errorMessage: err.response.data.errorMessage})
             }else if(err.request){
                this.setState({errorMessage:  "¡Something went wrong! Try later"})
             } else{
                this.setState({errorMessage:  "¡There's something bad in the request!"}) 
             }
         });
    }

    cancelHandler = (event) => {
       event.preventDefault();
       this.props.history.push({pathname: links.LOGIN});

    }

    closeModal = () =>{
        this.setState({error: false, errorMessage: ''});
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
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)} />
            ))

        );
        if( this.state.isLoading){
            controls = <Spinner/>;
        }
        
        return (
            <Auxi>
            <Modal show={this.state.error}  top="30%">
                <h5>Alert!</h5>
           <p>{this.state.errorMessage}</p> 
            <Button className="btn btn-warning" clicked={ ()=> this.closeModal()}>It's OK!</Button>
            </Modal>
            <div className="SignUp">
                <Form margin_top="20px">
                    <div className="form-group">
                        <Logo className="Logo" link={false}/>
                        <h5>Register an account!</h5>
                        <div className="controls">
                           {controls}
                        </div>
                        <Button  disabled={!this.state.formIsValid||this.state.isLoading}  
                        clicked={(event) => this.addUserHandler(event)} 
                        className="btn btn-info signup-btn">Sign up</Button>
                       <Button  disabled={this.state.isLoading} 
                       className="btn btn-light signin-btn"
                       clicked={(e)=>this.cancelHandler(e)}> Have an account?</Button>
                       
                    </div>
                </Form>
            </div>
            </Auxi>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setValidity: (val) => dispatch(actions.setValidity(val)),
    };
};

export default connect(null, mapDispatchToProps)(SignUp);