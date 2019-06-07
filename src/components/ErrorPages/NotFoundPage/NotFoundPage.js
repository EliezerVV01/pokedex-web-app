import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Button from './../../Button/Button';

import Form from './../../Form/Form'
import './NotFoundPage.css';
import PokemonSad from '../../../Assets/Images/pokemon_sad.png';

import * as links from './../../../Routes/RoutesList';

class NotFoundPage extends Component {
    render() {
        return (
            <div className="NotFoundPage">
                <Form margin_top="100px">
                    <img alt="pokemon_sad"
                        src={PokemonSad}
                        className="pokemon_sad" />
                    <h3>Error 404: Not Found Page</h3>
                    <NavLink to={links.HOME} exact><Button className="btn btn-primary">Go to Home Page!</Button> </NavLink>
                </Form>
            </div>
        )
    }
}

export default NotFoundPage;