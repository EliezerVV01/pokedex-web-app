import React, { Component } from 'react';
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
                   <Button className="btn btn-primary" clicked={()=>this.props.history.push({pathname: links.HOME})}>Go to Home Page!</Button>
                </Form>
            </div>
        )
    }
}

export default NotFoundPage;