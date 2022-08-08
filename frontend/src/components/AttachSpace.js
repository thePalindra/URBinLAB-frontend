import * as React from 'react';
import { MapContainer, TileLayer} from 'react-leaflet'

export default function defaultFunction() {
    const position = [39, -8.5];
    return (
        <MapContainer style={{width: "100%"}} center={position} zoom={7} scrollWheelZoom={true} minZoom={4} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>    
    );
}

