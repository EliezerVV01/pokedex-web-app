
import './PokemonCard.css';

import React from 'react';

const pokemonCard = ( props ) => (
    <div className="PokemonCard" key={props.keyCard}
    onClick={props.onClick}
    onDoubleClick={props.onDoubleClick}>
    <img alt="pokemon"
        src={props.src}
        key={props.keyImg}></img>
    <div className="PokemonName" key={props.keyName}>{props.name}</div>
</div>
);

export default pokemonCard;