import React, { Component } from 'react';
import './Pokedex.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Layout from './../../hoc/Layout/Layout'
import Button from './../../components/Button/Button';
import * as links from './../../Routes/RoutesList';
import { connect } from 'react-redux';
import Modal from '../../components/UI/Modal/Modal';
import Axios from 'axios';
import Spinner from './../../components/UI/Spinner/Spinner';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import MissingNo from './../../Assets/Images/missing_no.png';


class Pokedex extends Component {


    state = {
        error: false,
        errorMessage: null,
        pokemons: [],
        loading: false,
    }
   
  componentDidMount() {
        this.setState({ loading: true });
       Axios.get('/users/user-pokemons/', { headers: { 'Authorization': this.props.token } })
        .then(response => {
            this.setState({ loading: false, pokemons: response.data.pokemons });
        }).catch(err => {
            this.setState({ error: true, loading: false });
            if (err.response) {
                err.response.data.errorMessage? 
                this.setState({ errorMessage: err.response.data.errorMessage }):
                this.setState({ errorMessage: "There's something wrong in your request" })
            } else if (err.request) {
                this.setState({ errorMessage: "¡Something went wrong! Try later" })
            } else {
                this.setState({ errorMessage: "¡There's something bad in the request!" })
            }
        })
    }

    closeModal = () => {
        this.setState({ error: false, errorMessage: null });
    }

    selectPokemon = (pokemon) => {
        this.props.history.push({ pathname: links.POKEMONDETAILS+"/"+pokemon.id});
    }

    goToAddPokemon = () => {
        this.props.history.push({ pathname: links.ADDPOKEMON });
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

        let pokemons = (<div>

            </div>);
            if (!this.state.error && !this.loading) {
                pokemons = this.state.pokemons.map(
                    pokemon => {
    
                        return (
                            <PokemonCard key={pokemon.id}
                            onClick={() => this.selectPokemon(pokemon)}
                            src={pokemon.picture}
                            keyCard={pokemon.id + 1}
                            keyImg={pokemon.name + 1}
                            keyName={pokemon.name}
                            name={pokemon.name}> </PokemonCard>
                        )
    
                    });
            }

        return (
            <Layout>
                <div className="Pokedex">
                {this.state.error ? modalError : null}
                        <Button className=" PokedexAddPokemon btn btn-info " clicked={this.goToAddPokemon}> <FontAwesomeIcon
                            icon="plus-circle" /> Add pokemon</Button>
                    <div className="Pokemons-Container">
                    {(this.state.loading) ?
                        <Spinner></Spinner> : pokemons
                    }
                    {(!this.state.loading && this.state.pokemons.length < 1) ?
                        <div style={{ textAlign: "center" }}> <p className="PokemonNotFound">
                            You dont have any pokemon :'c !</p>
                            <img className="NoPokemonsAdded" src={MissingNo} alt="Missing_No"></img>
                        </div> : null
                    }

                    </div>
                </div>
            </Layout>
        )
    }
}

const mapStatesToProps = state => {
    return {
        token: state.token,
    }
};


export default connect(mapStatesToProps)(Pokedex);