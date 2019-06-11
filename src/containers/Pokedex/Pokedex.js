import React, { Component } from 'react';
import './Pokedex.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Layout from './../../hoc/Layout/Layout'
import Button from './../../components/Button/Button';
import { debounce } from '../../utility/debounce';
import * as links from './../../Routes/RoutesList';
import { connect } from 'react-redux';
import Modal from '../../components/UI/Modal/Modal';
import Axios from 'axios';
import Spinner from './../../components/UI/Spinner/Spinner';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import MissingNo from './../../Assets/Images/missing_no.png';
import Input from '../../components/Input/Input';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';



class Pokedex extends Component {


    state = {
        name: '',
        error: false,
        errorMessage: null,
        pokemons: [],
        loading: false,
        offset: 0,
        limit: 12,
        currentPage: 1,
        count: 0,
    }

    fetchPokemons() {
    
        this.setState({ loading: true});
        Axios.get(`/users/user-pokemons/?name=${this.state.name}&offset=${this.state.offset}&limit=${this.state.limit}`,
            { headers: { 'Authorization': this.props.token } })
            .then(response => {
                this.setState({ loading: false, pokemons: response.data.pokemons, count: response.data.count.count });
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
    }

    componentDidMount() {
        this.fetchPokemons();
    }

    closeModal = () => {
        this.setState({ error: false, errorMessage: null });
    }

    searchDebounced = debounce((e) =>{this.fetchPokemons(e)}, 250);

    onSearch(event) {
        //This method set the pokemonInSearch state which to be change triggers the fetch of pokemons by their name
        event.persist();
        this.setState({currentPage:1, offset: 0});
        this.searchDebounced(event);
        this.setState({ name: event.target.value });
    }


    selectPokemon = (pokemon) => {
        this.props.history.push({ pathname: links.POKEMONDETAILS + "/" + pokemon.id });
    }

    goToAddPokemon = () => {
        this.props.history.push({ pathname: links.ADDPOKEMON });
    }
  //Pagiantion methods
    onChangePaginate = (page) => {
      this.setState(prevState => {
          return {
            currentPage: page,
            offset: (page-1)*prevState.limit,
          }
         
        },this.fetchPokemons);
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
                        <Input elementType="input"
                            elementConfig={{ placeholder: "Search a pokemon" }}
                            value={this.state.name}
                            changed={(e) => this.onSearch(e)}></Input>
                        <br></br>
                        {(this.state.loading) ?
                            <Spinner></Spinner> : pokemons
                        }
                        {(!this.state.loading && this.state.pokemons.length < 1) ?
                            <div style={{ textAlign: "center" }}> <p className="PokemonNotFound">
                                You dont have any pokemon :'c !</p>
                                <img className="NoPokemonsAdded" src={MissingNo} alt="Missing_No"></img>
                            </div> : null
                        }
                        <div className="PaginationContainer">
                        <Pagination style={{display: 'inline-block'}} 
                        className="Paginate" onChange={this.onChangePaginate} 
                        current={this.state.currentPage} total={this.state.count} />
                        </div>
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