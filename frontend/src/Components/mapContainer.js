import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class MapContainer extends React.Component {
    render() {
        // get props here to do stuff with the map
        return (
            <Map 
                google={this.props.google}
                zome={14}
            >
                <Marker
                    onClick={this.onMarkerClick}
                    name={'Current Location'};
                />
                <InfoWindow onClose={this.onInfoWindowClose}>
                    <div>
                        <h1>{this.state.selectedPlace.name}</h1>
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

export default MapContainer;
export default GoogleApiWrapper({
    apiKey: (TYPE_MY_KEY_HERE)
})(MapContainer);