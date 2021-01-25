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
import PokemonCard from './../../components/PokemonCard/PokemonCard';
import * as links from '../../Routes/RoutesList';
import Button from '../../components/Button/Button';
import './AddPokemon.css';
import Axios from 'axios';
import Spinner from './../../components/UI/Spinner/Spinner';
import MissingNo from './../../Assets/Images/missing_no.png';


const initialState = {
    isUploadig: false,
    pokemonInSearch: '',
    loading: false,
    selectingPokemon: false,
    pokemonsForSelect: [],
    error: false,
    errorMessage: 'Something went wrong',
    success: false,
    formIsValid: false,
    pokemonSelected: {
        image: null,
        name: null,
    },
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
            value: null,
            valid: true,
        },
        locationLatitude: {
            value: null,
            valid: true,
        }


    },
}

class AddPokemon extends Component {

    //This variable is used to know if this component is Mounted or not
    _isMounted = false;

    state = initialState;

    reset() {
        this.setState(initialState);
    }


    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
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



    Axios.post('/pokemons/', formData, { headers: { 'Authorization': this.props.token } })
            .then(response => {
                this.setState({ isUploadig: false });
                this.setState({ success: true });
            }).catch(err => {
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
        this.reset();
    }

    //Functions for getting the data from the form

    setPosition = (lon, lat) => {

        //This method takes coordinates and set the states of the pokemon longitud and latitude 

        const updatedPokemon = updateObject(this.state.pokemon,
            {
            });

        this.setState({ pokemon: updatedPokemon });
    }


    selectChangedHandler = (event) => {
        //This component hanlde the select of captured
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


    selectedPokemonHandler = (pokemon) => {
        //This method set in the sates the pokemon that has been selected
        const updatedSelected = updateObject(this.state.pokemonSelected, {
            image: pokemon.picture,
            name: pokemon.name,
        });
        this.setState({ pokemonSelected: updatedSelected });
        const updatedFormElement = updateObject(this.state.pokemon['pokemonId'], {
            value: pokemon.id,
            valid: checkValidity(pokemon.id, this.state.pokemon['pokemonId'].validation),
            touched: true,
        });

        const updatedForm = updateObject(this.state.pokemon, {
            'pokemonId': updatedFormElement
        });
        let formIsValid = true;
        for (let inputIdentifier in updatedForm) {
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ pokemon: updatedForm, formIsValid: formIsValid });
    }

    //end of functions for getting the data from the form


    pokemonSelectionStart = (event) => {
        //This method set selectingPokemon to true so that a modal be displayed and get all pokemons from their names
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


    searchDebounced = debounce((e) => this.pokemonSelectionStart(e), 250);

    onSearch(event) {
        //This method set the pokemonInSearch state which to be change triggers the fetch of pokemons by their name
        event.persist();
        this.searchDebounced(event);
        this.setState({ pokemonInSearch: event.target.value });
    }


    render() {
        let pokemons = (<div>

        </div>);
        if (!this.state.error && !this.loading) {

            pokemons = this.state.pokemonsForSelect.map(
                pokemon => {

                    return (
                        <PokemonCard
                            key={pokemon.id+2}
                            onClick={() => this.selectedPokemonHandler(pokemon)}
                            onDoubleClick={() => { this.selectedPokemonHandler(pokemon); this.setState({ selectingPokemon: false }) }}
                            src={pokemon.picture}
                            keyCard={pokemon.id + 1}
                            keyImg={pokemon.name + 1}
                            keyName={pokemon.name}
                            name={pokemon.name}> </PokemonCard>
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
                <Button className="btn btn-success" clicked={() => {this.closeModal(); this.props.history.push({ pathname: links.HOME });}}>
                    <FontAwesomeIcon
                        icon="check-circle" /> Great!</Button>
            </Modal>
        );




        let SelectPokemonModal = (
            <Modal top="0%" show={this.state.selectingPokemon} id="PokemonsModal" modalClosed={this.closeModal}>
                <h5 style={{ display: "inline" }}>Choose your pokemon</h5><Button className="btn btn-secondary CancelSelect" clicked={() => this.closeModal()}>
                    Done
                </Button>
                <Input elementType="input"
                 elementConfig={{placeholder: "Search a pokemon"}}
                    value={this.state.pokemonInSearch}
                    changed={(e) => this.onSearch(e)}></Input>
                <div className="PokemonSelected">
                    <img alt="pokemon"
                        src={this.state.pokemonSelected['image'] ? this.state.pokemonSelected['image'] :
                            MissingNo}>
                    </img>
                    <div className="PokemonName" >{this.state.pokemonSelected['name']}</div>
                </div>

                <p style={{ color: 'rgb(103, 103, 103)', marginBottom: 0, fontWeight: 600, fontSize: 18, textAlign: "center" }}>{this.state.pokemonSelected['name'] ?
                    `` :
                    `You haven't selected a pokemon yet`}</p>
                <br></br>
                <div className="PokemonsContainer">
                    {(this.state.loading) ?
                        <Spinner></Spinner> : pokemons
                    }

                    {(!this.state.loading && this.state.pokemonsForSelect.length < 1) ?
                        <div style={{ textAlign: "center" }}> <p className="PokemonNotFound">
                            Pokemon not found!</p>
                            <img src={MissingNo} alt="Missing_No"></img>
                        </div> : null
                    }

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
                    <img src={!this.state.pokemonSelected['image'] ? PokemonHappy : this.state.pokemonSelected['image']} alt="pokemon_happy"
                        className="PokemonHappy">
                    </img>
                    <Input elementType='select'
                        value={this.state.pokemon['captured'].value}
                        elementConfig={{
                            options: [{ value: '', displayValue: 'Did you capture it?' },
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
                            ' Select the pokemon you found' :
                            ` Well done! You have selected ${this.state.pokemonSelected['name']}`}
                    </Button>
                    <br></br>

                    <br></br>
                    <Button className="btn btn-info FormButtons"
                        disabled={!this.state.formIsValid}
                        clicked={(e) => this.addPokemon(e)}>
                        <FontAwesomeIcon
                            icon="plus-circle" /> Add pokemon</Button>

                    <Button className="btn btn-danger FormButtons" clicked={(e) => this.cancelHandler(e)}> <FontAwesomeIcon
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

export default connect(mapStatesToProps)(AddPokemon);