import React, { Component } from 'react';

import { updateObject, checkValidity } from '../../utility/utility';

import PokemonHappy from './../../Assets/Images/pokemon_happy.png'
import Input from '../../components/Input/Input';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Layout from '../../hoc/Layout/Layout'
import Form from '../../components/Form/Form';

import Modal from '../../components/UI/Modal/Modal';

import * as links from '../../Routes/RoutesList';

import Button from '../../components/Button/Button';
import MapContainer from '../Map/MapContainer';

import './AddPokemon.css';
import Axios from 'axios';
import Spinner from './../../components/UI/Spinner/Spinner';

import { tsImportEqualsDeclaration } from '@babel/types';

class AddPokemon extends Component {

    state = {
        loading: false,
        selectingPokemon: false,
        pokemonsForSelect: [],
        error: false,
        errorMessage: 'Something went wrong',
        success: false,
        formIsValid: false,
        pokemon: {
            captured: {
                value: '',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                }
            },
            pokemonId: {
                value: null,
                valid: false,
                touched: false,
                validation: {
                    isNumeric: true,
                }
            },
            locationLongitude: {
                value: 0.5,
                valid: true,
            },
            locationLatitude: {
                value: 0.5,
                valid: true,
            }


        },
    }


    /*Functions to handle the inputs*/

    /*Functions*/

    closeModal = () => {
        this.setState({ error: false, success: false, selectingPokemon: false });
    }


    /*Cancel or OK*/

    goToHome = () => {
        this.props.history.push({ pathname: links.HOME });
    }


    addPokemon = (e) => {
        e.preventDefault();
        console.log("working");
    }



    //Functions for getting the data from the form

    setPosition = (lon, lat) => {

        const updatedLongitude = updateObject(this.state.pokemon['locationLongitude'],
            {
                value: lon,
            })
        const updatedLatitude = updateObject(this.state.pokemon['locationLatitude'],
            {
                value: lat,
            })

        const updatedPokemon = updateObject(this.state.pokemon,
            {
                locationLongitude: updatedLongitude,
                locationLatitude: updatedLatitude,
            });

        this.setState({ pokemon: updatedPokemon });
    }


    selectChangedHandler = (event) => {
        const updatedFormElement = updateObject(this.state.pokemon['captured'], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.pokemon['captured'].validation),
            touched: true,
        });

        const updatedForm = updateObject(this.state.pokemon, {
            'captured': updatedFormElement
        });
        let formIsValid = true;
        for (let inputIdentifier in updatedForm) {
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ pokemon: updatedForm, formIsValid: formIsValid, selectingPokemon: false });

    }


    selectedPokemonHandler = (id) => {


        const updatedFormElement = updateObject(this.state.pokemon['pokemonId'], {
            value: id,
            valid: checkValidity(id, this.state.pokemon['pokemonId'].validation),
            touched: true,
        });

        const updatedForm = updateObject(this.state.pokemon, {
            'pokemonId': updatedFormElement
        });
        let formIsValid = true;
        for (let inputIdentifier in updatedForm) {
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ pokemon: updatedForm, formIsValid: formIsValid, selectingPokemon: false });
    }

    //end of functions for getting the data from the form

    pokemonSelectionStart = (event) => {
        event.preventDefault();
        this.setState({ selectingPokemon: true, loading: true });
        Axios.get("http://localhost:8080/api/pokemons/")
            .then((response) => {
                const AllPokemons = response.data;
                this.setState({ pokemonsForSelect: AllPokemons, loading: false });
            }).catch((err) => {
                console.log(err);
                this.setState({ error: true, loading: false });
            })

    }


    render() {
        let spinner = (
            <Spinner></Spinner>
        )
        let pokemons = (<div>

        </div>);
        if (!this.state.error && !this.loading) {
            pokemons = this.state.pokemonsForSelect.map(
                pokemon => {
                    return (
                        <div className="PokemonCard" key={pokemon.id + 1}
                            onClick={() => this.selectedPokemonHandler(pokemon.id)}>
                            <img alt="pokemon"
                                src={pokemon.picture}
                                key={pokemon.id}></img>
                            <div className="PokemonName" key={pokemon.id + 2}>{pokemon.name}</div>
                        </div>
                    )

                });
        }

        let modalError = (
            <Modal top="35%" show={this.state.error} id="ErrorModal" modalClosed={this.closeModal}>
                <h5>{this.state.errorMessage}</h5>
                <Button className="btn btn-warning" clicked={() => this.closeModal()}>
                    <FontAwesomeIcon
                        icon="exclamation-circle" /> It's OK!</Button>
            </Modal>
        );

        let modalSuccess = (
            <Modal top="35%" show={this.state.success} id="SuccessModal" modalClosed={this.closeModal}>
                <h5>You have added a great pokemon to your pokedex!</h5>
                <Button className="btn btn-success" clicked={() => this.closeModal()}>
                    <FontAwesomeIcon
                        icon="check-circle" /> Great!</Button>
            </Modal>
        );

        let SelectPokemonModal = (
            <Modal top="0%" height="100%" show={this.state.selectingPokemon} id="PokemonsModal" modalClosed={this.closeModal}>
                <h5>Choose your pokemon</h5>
                {this.state.loading ? spinner : pokemons}
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <Button className="btn btn-danger CancelSelect" clicked={() => this.closeModal()}>
                            Cancel </Button>
                    </div>
                    <div className="col-sm-4"></div>
                </div>

            </Modal>
        );



        return (<Layout>
            <div className="AddPokemon">
                {this.state.error ? modalError : null}
                {this.state.success ? modalSuccess : null}
                {this.state.selectingPokemon ? SelectPokemonModal : null}


                <Form>
                    <h4 style={{ textAlign: "center" }}>Add a pokemon to your pokedex</h4>
                    <img src={PokemonHappy} alt="pokemon_happy"
                        className="PokemonHappy">
                    </img>
                    <Input elementType='select' elementConfig={{
                        options: [{ value: '', displayValue: 'Did you captured it?' },
                        { value: true, displayValue: 'Yes' },
                        { value: false, displayValue: 'No' }]
                    }}
                        invalid={!this.state.pokemon.captured.valid}
                        touched={this.state.pokemon.captured.touched}
                        changed={(event) => this.selectChangedHandler(event)}></Input>

                    <Button className="btn btn-secondary select-pokemon space" clicked={(event) => this.pokemonSelectionStart(event)}>
                        <FontAwesomeIcon
                            icon="paw" /> {!this.state.pokemon['pokemonId'].value ? 'Select the pokemon you found' : 'You have selected a pokemon!'}</Button>
                    <strong>Pick where you found it (Drag the pointer)</strong>
                    <br></br>

                    <div className="Map">
                        <MapContainer setPosition={(lon, lat) => this.setPosition(lon, lat)}></MapContainer>
                    </div>
                    <br></br>
                    <Button className="btn btn-info FormButtons"
                        disabled={!this.state.formIsValid}
                        clicked={(e) => this.addPokemon(e)}>
                        <FontAwesomeIcon
                            icon="plus-circle" /> Add pokemon</Button>

                    <Button className="btn btn-danger FormButtons" clicked={this.goToHome}> <FontAwesomeIcon
                        icon="window-close" /> Cancel</Button>
                </Form>
            </div>
        </Layout>);
    }
}

export default AddPokemon;