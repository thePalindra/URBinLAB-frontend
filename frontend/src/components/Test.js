import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Link } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"


let lat = 0
let lng = 0
let size = 0

function circle(e) {
    let result =  "c"
    console.log(result)
    
    lng = e.layer._latlng.lng
    lat = e.layer._latlng.lat 
    size = e.layer._mRadius
    return result;
}

function point(e) {
    let result = ["POINT","(" + e.layer._latlng.lng, e.layer._latlng.lat + ")"].join(" ")
    console.log(result)
    return result;
}

function polygon(e) {
    let result = "POLYGON (("
    for (let i = 0; i < e.layer._latlngs[0].length; i++)
        result = [result + e.layer._latlngs[0][i].lng, e.layer._latlngs[0][i].lat + ","].join(" ")
    
    result = [result + e.layer._latlngs[0][0].lng, e.layer._latlngs[0][0].lat + "))"].join(" ")
    console.log(result)
    return result;
}

export default function Default() {
    let space = ""
    const position = [38, -17.7];
    const [spatialList, setSpatialList]=React.useState(<></>);
    const [editableFG, setEditableFG] = React.useState(null);

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        setEditableFG(reactFGref);
    };
    
    const _created=e=> {
        setSpatialList(<></>)
        const drawnItems = editableFG._layers;
        if (Object.keys(drawnItems).length > 1) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editableFG.removeLayer(layer);
            });
        }
        let parse = require('wellknown');
        switch(e.layerType) {
            case "circle":
                space = circle(e)
                break;
            case "rectangle":
                space = polygon(e)
                break;
            case "marker":
                space = point(e)
                break;
            case "polygon":
                space = polygon(e)
                break;
            default:
                break;
        }
        console.log(e.layerType)
    }

    return (
        <>
            <div 
                style={{ 
                    margin: "auto",
                    position: "relative",
                    border: "1px solid grey",
                    background: "rgba(256, 256, 256, 0.6)",
                    height: "8vh",
                    left: "-10%",
                    width:"120%"}}>
            </div>
            <div 
                style={{ 
                    margin: "auto",
                    position: "relative",
                    background: "rgba(256, 256, 256, 0.6)",
                    height: "90vh",
                    left: "-10%",
                    width:"120%"}}>
                <MapContainer 
                    style={{
                        position: 'absolute',
                        top: '46.6%',
                        left: '66.6%',
                        transform: 'translate(-50%, -50%)',
                        width: "50%",
                        boxShadow: 24,
                        height: "84vh",
                    }} 
                    center={position} 
                    zoom={6} 
                    scrollWheelZoom={true} 
                    minZoom={4}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FeatureGroup ref={featureGroupRef => {
                        onFeatureGroupReady(featureGroupRef);
                    }}>
                        <EditControl 
                            position="topleft"
                            onCreated={_created}
                            draw= {{
                                circlemarker: false,
                                polyline: false,
                                polygon: false
                            }}
                            edit={{edit:false}}/>
                    </FeatureGroup>       
                    {spatialList}
                </MapContainer> 
            </div>
        </>
    );
}