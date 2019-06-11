import React, { Component } from 'react';
import { Map, TileLayer, Marker} from 'react-leaflet'

import './MapContainer.css';

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.markerRef = React.createRef();
    }
    state = {
        zoom: 13,
        hasLocation: false,
        latlng: {
            lat: null,
            lng: null,
        },
        marker: {
            lat: null,
            lng: null,
        },
    }

    handleLoad = () => {
        if (!this.state.hasLocation) {
            const map = this.mapRef.current;
            if (map != null) {
                map.leafletElement.locate();
            }
        }

    }

    handleLocationFound = (e) => {
        this.setState({
            hasLocation: true,
            latlng: e.latlng,
            marker: e.latlng
        });
        this.props.setPosition(this.state.latlng['lng'], 
        this.state.latlng['lat'] );
    }

    updatePosition = () => {
        const marker = this.markerRef.current
        if (marker != null) {
            this.setState({
                latlng: marker.leafletElement.getLatLng(),
                marker: marker.leafletElement.getLatLng(),
            })
        }
        this.props.setPosition(this.state.latlng['lng'], 
                            this.state.latlng['lat'] );
    }
    OnZoomHandler = () => {
        const map = this.mapRef.current;
        if (map != null) {
            this.setState({ zoom: map.leafletElement.zom });
        }

    }




    render() {

        const position = this.state.latlng;
        const markerPosition = this.state.marker;

        return (

            <Map children
                onZoom={this.OnZoomHandler}
                center={this.props.center?this.props.center:position}
                length={4}
                onLocationfound={this.handleLocationFound}
                ref={this.mapRef}
                zoom={this.state.zoom}>
                <TileLayer
                    onLoad={this.handleLoad}
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    draggable={this.props.draggable}
                    onDragend={this.updatePosition}
                    position={this.props.center?this.props.center:markerPosition}
                    ref={this.markerRef}>
                </Marker>
            </Map>
        );
    }
}

export default MapContainer;