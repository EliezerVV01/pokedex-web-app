import React, { Component } from 'react';

import './Pokedex.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Layout from './../../hoc/Layout/Layout'

import Button from './../../components/Button/Button';

import * as links from './../../Routes/RoutesList';

class Pokedex extends Component {
   

    goToAddPokemon = () =>{
        this.props.history.push({ pathname: links.ADDPOKEMON});
    }



    render() {
        
        return (
            <Layout>
                <div className="Pokedex">
                    <Button className="btn btn-info" clicked={this.goToAddPokemon}> <FontAwesomeIcon
                        icon="plus-circle" /> Add pokemon</Button>
                </div>

            </Layout>
        )
    }
}

export default Pokedex;