import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateObject, checkValidity } from '../../utility/utility';

import { debounce } from '../../utility/debounce';


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
import MissingNo from './../../Assets/Images/missing_no.png';


class AddPokemon extends Component {

    state = {
        isUploadig: false,
        pokemonInSearch: '',
        loading: false,
        selectingPokemon: false,
        pokemonsForSelect: [],
        error: false,
        errorMessage: 'Something went wrong',
        success: false,
        formIsValid: false,
        pokemonSelected: null,
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


    /*Cancel or Post data*/

    cancelHandler = (event) => {
        event.preventDefault();
        this.props.history.push({ pathname: links.HOME });
    }


    addPokemon = (e) => {
        e.preventDefault();
        this.setState({ isUploadig: false });
        const formData = {
            pokemon: {}
        };
        for (let element in this.state.pokemon) {
            formData.pokemon[element] = this.state.pokemon[element].value;
        }
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        formData.pokemon['date'] = date;


        Axios.post('/pokemons/add/', formData, { headers: { 'Authorization': this.props.token } })
            .then(response => {
                this.setState({ isUploadig: false });
                this.setState({ success: true });
            }).catch(err => {
                this.setState({ isUploadig: false });
                if (!err.response) {
                    this.setState({ errorMessage: 'Something went wrong!' })
                    this.setState({ error: true });
                } else if (err.response.status === 401) {
                    this.setState({ errorMessage: err.response.data.errorMessage })
                    this.setState({ error: true });
                };
            })

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


    selectedPokemonHandler = (id, name) => {

        this.setState({ pokemonSelected: name });
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
        Axios.get(`http://localhost:8080/api/pokemons/?name=${this.state.pokemonInSearch}`)
            .then((response) => {
                const AllPokemons = response.data;
                this.setState({ pokemonsForSelect: AllPokemons, loading: false });
            }).catch((err) => {
                console.log(err);
                this.setState({ error: true, loading: false, selectingPokemon: false });
            })

    }


    searchDebounced = debounce((e) => this.pokemonSelectionStart(e), 200);

    onSearch(event) {
        event.persist();
        this.searchDebounced(event);
        this.setState({ pokemonInSearch: event.target.value });
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
                            onClick={() => this.selectedPokemonHandler(pokemon.id, pokemon.name)}>
                            <img alt="pokemon"
                                src={pokemon.picture}
                                key={pokemon.name + 1}></img>
                            <div className="PokemonName" key={pokemon.name}>{pokemon.name}</div>
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
            <Modal top="0%" show={this.state.selectingPokemon} id="PokemonsModal" modalClosed={this.closeModal}>
                <h5 style={{ display: "inline" }}>Choose your pokemon</h5><Button className="btn btn-danger CancelSelect" clicked={() => this.closeModal()}>
                    X
                </Button>
                <Input elementType="input"
                    value={this.state.pokemonInSearch}
                    changed={(e) => this.onSearch(e)}></Input>
                <p style={{ color: 'rgb(103, 103, 103)', fontWeight: 600, fontSize: 18, textAlign: "center" }}>{this.state.pokemonSelected ?
                    `You had selected: ${this.state.pokemonSelected}` :
                    null}</p>
                <br></br>
                <div className="PokemonsContainer">
                    {(this.state.pokemonsForSelect.length < 1) && !this.state.loading ?
                        <div style={{ textAlign: "center" }}> <p className="PokemonNotFound">
                            Pokemon not found!</p>
                            <img src={MissingNo} alt="Missing_No"></img></div>
                        : pokemons}
                    {this.state.loading ? spinner : pokemons}
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


                    <Button className={!this.state.pokemon['pokemonId'].value ?
                        'btn btn-light select-pokemon space' :
                        'btn btn-dark select-pokemon space'} clicked={(event) => this.pokemonSelectionStart(event)}>
                        <FontAwesomeIcon
                            icon="paw" />
                        {!this.state.pokemon['pokemonId'].value ?
                            'Select the pokemon you found' :
                            'You have selected a pokemon!'}
                    </Button>
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

                    <Button className="btn btn-danger FormButtons" clicked={(e)=>this.cancelHandler(e)}> <FontAwesomeIcon
                        icon="window-close" /> Cancel</Button>
                </Form>


            </div>
        </Layout>);
    }
}

const mapStatesToProps = state => {
    return {
        token: state.token,
    }
};

export default connect(null, mapStatesToProps)(AddPokemon);