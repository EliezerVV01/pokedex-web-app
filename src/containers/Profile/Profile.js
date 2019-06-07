import React, { Component } from 'react';
import './Profile.css';
import { formatDate, updateObject, getDate } from './../../utility/utility';
import UserImg from './../../Assets/Images/user.png';
import Layout from './../../hoc/Layout/Layout'
import Auxi from '../../hoc/Auxi';
import Input from './../../components/Input/Input';
import Button from './../../components/Button/Button';
import Spinner from './../../components/UI/Spinner/Spinner';
import Axios from 'axios';
import { connect } from 'react-redux';
import * as links from './../../Routes/RoutesList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '../../components/UI/Modal/Modal';

class Profile extends Component {
    state = {
        error: false,
        errorMessage: null,
        userPic: null,
        user: {},
        formValid: true,
        isEditing: false,
        isLoading: false,

    }



    saveChanges = () => {
        //This method PUT the data from the form to the api so the data of a user can be update.
        // Then the returned data is set to the states so that the change can be seen automatically
        const data = {
            user: this.state.user,
        };
        this.setState({ isEditing: false, isLoading: true });
        Axios.put('/users/updateUser', data, { headers: { 'Authorization': this.props.token } })
         .then(response => this.setState({user: response.data, isLoading: false}))
         .catch(err => {
            this.setState({ error: true, isLoading: false, errorMessage: "Something went wrong!" });
            if (err.response) {
                if (err.response.status === 401) {
                    this.props.history.push({ pathname: links.LOGOUT });
                }
                else if (err.response.data.errorMessage) {
                    this.setState({ errorMessage: err.response.data.errorMessage })
                }  
            } else {
                this.setState({ errorMessage: "Something went wrong!" });
            }
            this.fetchUser();
        })
    }

    fetchUser = () => {
        //We are requesting the user from a token and setting the state with it
        this.setState({ isLoading: true });
        Axios.get('/users/getUser/', { headers: { 'Authorization': this.props.token } })
            .then(response => this.setState({ user: response.data, isLoading: false }))
            .catch(err => {
                this.setState({ error: true, loading: false, errorMessage: "Something went wrong!" });
                if (err.response) {
                    if (err.response.status === 401) {
                        this.props.history.push({ pathname: links.LOGOUT });
                    }
                    else if (err.response.data.errorMessage) {
                        this.setState({ errorMessage: err.response.data.errorMessage })
                    }  
                } else {
                    this.setState({ errorMessage: "Something went wrong!" });
                }
            })
    }

    componentDidMount() {
        //When componenet didMount we fetch the date of the user
        this.fetchUser();
    }

    cancel() {
        //This method handler the cancel of editing, settig editing to false and returning user state to what it was
        this.setState(() => {
            return {
                isEditing: false,
            }
        });
        this.fetchUser();
    }

    onChangeHandler = (e, element) => {
        const updatedUser = updateObject(this.state.user,
            {
                [element]: e.target.value
            }
        )
        let formValid = true;
        for (let inputIdentifier in updatedUser) {
            formValid = (updatedUser[inputIdentifier] !== '') && formValid;
        }
        this.setState({ user: updatedUser, formValid: formValid });
    }

    closeModal = () => {
        this.setState({ error: null, errorMessage: null });
    }

    edit() {
        //This method set editing to true and set userbackup state with the user state fetched from the api 
        this.setState(() => {
            return {
                isEditing: true,
            }
        });
    }

    render() {
        let modalError = (
            <Modal top="35%" show={this.state.error} id="ErrorModal" modalClosed={this.closeModal}>
                <h5 style={{ textAlign: 'center' }}>{this.state.errorMessage}</h5>
                <Button className="btn btn-warning" clicked={() => this.closeModal()}>
                    <FontAwesomeIcon
                        icon="exclamation-circle" /> It's OK!</Button>
            </Modal>
        );
        let profile = (<h1 style={{ textAlign: "center" }}>
            Loading..
        </h1>);

        if (this.state.isEditing) {
            profile = (<Auxi>
                <div> <strong>Username:</strong> <Input elementType="input" value={this.state.user['userName']} changed={(e) => this.onChangeHandler(e, 'userName')}></Input></div>
                <div> <strong>First Name:</strong> <Input elementType="input" value={this.state.user['firstName']} changed={(e) => this.onChangeHandler(e, 'firstName')}></Input></div>
                <div> <strong>Last Name:</strong> <Input elementType="input" value={this.state.user['lastName']} changed={(e) => this.onChangeHandler(e, 'lastName')}></Input></div>
                <div> <strong>Address:</strong> <Input elementType="input" value={this.state.user['address']} changed={(e) => this.onChangeHandler(e, 'address')}></Input></div>
                <div> <strong>Birthdate:</strong><input onChange={(e) => this.onChangeHandler(e, 'birthDate')}
                    style={{
                        maxWidth: '500px ', marginLeft: 'auto',
                        marginRight: 'auto', marginTop: '15px'
                    }}
                    value={getDate(this.state.user['birthDate'])}
                    className="InputElement"
                    type="date"></input></div>
                <Button style={{ marginTop: '15px' }} disabled={!this.state.formValid} clicked={() => this.saveChanges()} className="btn btn-info FormButtons">Save changes</Button>
                <Button style={{ marginTop: '15px' }} className="btn btn-danger FormButtons" clicked={() => this.cancel()}>Cancel</Button>
            </Auxi>)
        } else {
            profile = (<Auxi>
                <p> <strong>Username:</strong> {this.state.user['userName']}</p>
                <p> <strong>First Name:</strong> {this.state.user['firstName']}</p>
                <p> <strong>Last Name:</strong> {this.state.user['lastName']}</p>
                <p> <strong>Email:</strong> {this.state.user['email']}</p>
                <p> <strong>Gender:</strong> {this.state.user['gender'] ? 'Male' : 'Female'}</p>
                <p> <strong>Address:</strong> {this.state.user['address']}</p>
                <p> <strong>Birthdate:</strong> {formatDate(this.state.user['birthDate'])}</p>
                <Button className="btn btn-info FormButtons" clicked={() => this.edit()}>Edit</Button>
            </Auxi>)
        }

        //Depends on the isEditing state we render a component

        return (
            <Layout>
                <div className="InfoContainer UserContainer">
                    {this.state.error ? modalError : null}
                    <h3>User information</h3>
                    <br></br>
                    <img
                        alt="user"
                        src={UserImg}
                    ></img>
                    {this.state.isLoading ? <Spinner></Spinner> : profile}
                </div>
            </Layout>
        )
    }
}

const mapStatesToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStatesToProps)(Profile);