import React from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import FolderIcon from '@mui/icons-material/Folder';

import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup, useMap } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"

let lat = 0
let lng = 0
let size = 0

function circle(e) {
    let result =  "c"
    
    lng = e.layer._latlng.lng
    lat = e.layer._latlng.lat 
    size = e.layer._mRadius
    return result;
}

function point(e) {
    let result = ["POINT","(" + e.layer._latlng.lng, e.layer._latlng.lat + ")"].join(" ")
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

    const [editable_FG, set_editable_FG] = React.useState(null);
    const [position, set_position]=React.useState([39.7, -10])
    const [zoom, set_zoom]=React.useState(7)

    const [spatial_list, set_spatial_list]=React.useState(<></>);
    const [layer_type, set_layer_type]=React.useState([]);
    const [space, set_space]=React.useState([]);
    const [default_space, set_default_space]=React.useState(false);

    const [search, set_earch]=React.useState('');
    const [dictionary, set_dictionary]=React.useState([])

    const [results, set_results]=React.useState([[1,2], [3,4]])

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        set_editable_FG(reactFGref);
    };

    const _created=e=> {
        set_spatial_list(<></>)
        set_default_space(false)
        const drawnItems = editable_FG._layers;
        if (Object.keys(drawnItems).length > 1) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editable_FG.removeLayer(layer);
            });
        }
        let parse = require('wellknown');
        switch(e.layerType) {
            case "circle":
                set_space(circle(e))
                let radius = e.layer._mRadius
                let center = e.layer._latlng
                let temp = zoom_setter(radius*radius*3.1415)
                set_zoom(temp[0])
                set_position([center.lat, center.lng])
                break;
            case "rectangle":
                set_space(polygon(e))
                let center2 = [(e.layer._latlngs[0][3].lat + e.layer._latlngs[0][1].lat)/2, (e.layer._latlngs[0][3].lng + e.layer._latlngs[0][1].lng)/2]
                set_position(center2)
                set_zoom(9)
                break;
            case "marker":
                set_space(point(e))
                let center3 = e.layer._latlng
                set_position([center3.lat, center3.lng])
                set_zoom(9)
                break;
            default:
                break;
        }
        set_layer_type(e.layerType)
    }

    function zoom_setter(temp_area) {
        if (temp_area < 20000000) 
            return [10, 0.5]
        else if (temp_area < 200000000) 
            return [9, 1.5]
        else if (temp_area < 2000000000) 
            return [8, 3]
        else 
            return [7, 5.5]
    }

    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }

    return(
        <>
            <div
                style={{
                    position: "fixed",
                    background: "rgba(256, 256, 256, 0.85)",
                    float: "left",
                    width: "50%",
                    height: "92%",
                }}>
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "10%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    <Autocomplete
                        freeSolo
                        options={dictionary}
                        style={{
                            width: "40%",
                            borderRadius: "5px",
                        }}
                        renderInput={(params) => <TextField 
                            {...params} 
                            label="O quê?" 
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                }
                            }}
                            onChange={(e)=>{
                            }}
                        />}
                        onChange={(e, values)=>{
                        }}/>  

                    <Autocomplete
                        disablePortal
                        options={[]}
                        style={{
                            width: "40%",
                            borderRadius: "5px",
                            marginLeft: "10px"
                        }}
                        renderInput={(params) => <TextField 
                            {...params} 
                            label="Onde?" 
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                }
                            }}
                            onChange={(e)=>{
                            }}
                        />}
                        onChange={(e, values)=>{
                        }}/>
                    <Button 
                        variant="contained" 
                        disabled= {search}
                        onClick= {() => {
                        }}
                        style={{
                            zIndex: 400,  
                            marginLeft: "10px"  
                        }}>
                            Pesquisar 
                    </Button>
                </div>
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "90%",
                        marginTop: "10%",
                        justifyContent: "center"
                    }}>
                    <Typography 
                        variant="h6" 
                        style={{ 
                            top: "5px",
                            color: "rgba(0, 0, 0, 0.7)",
                            margin:"auto",
                            height:"5%"
                        }}>
                        # Resultados
                    </Typography>
                    <div
                        style={{
                            position: "absolute",
                            height: "95%",
                            width: "100%",
                        }}>
                        {results?.length>0 && results.map((doc, index) => {
                            return (
                                <div
                                    style={{
                                        height:"160px",
                                    }}>
                                    <div
                                        style={{
                                            width: "4%",
                                            position: "fixed",
                                            height: "140px",
                                            marginTop: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                        <div
                                            style={{
                                                background: "rgba(0, 0, 0, 0.3)",
                                                height: "60px",
                                                width: "60px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "50%"
                                            }}>
                                            <FolderIcon
                                                fontSize="large"
                                                style={{
                                                    color: "rgba(256, 256, 256, 0.8)",
                                                }}/>
                                        </div>
                                    </div>
                                    <hr
                                        style={{
                                            width: "46%",
                                            left: "4%",
                                            position: "fixed",
                                            marginTop: "155px",
                                        }}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <MapContainer 
                style={{
                    position: 'fixed',
                    marginLeft: "50%",
                    width: "50%",
                    boxShadow: 24,
                    height: "92%",
                }} 
                center={position} 
                zoom={zoom} 
                scrollWheelZoom={true} 
                minZoom={5}>
                <ChangeView center={position} zoom={zoom} /> 
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FeatureGroup ref={featureGroupRef => {
                    onFeatureGroupReady(featureGroupRef);
                }}>
                    <EditControl 
                        style={{
                            display: "none"
                        }}
                        position="topleft"
                        onCreated={_created}
                        onDeleted={()=>{
                            //set_search(true)
                        }}
                        draw= {{
                            circlemarker: false,
                            polyline: false,
                            polygon: false
                        }}
                        edit={{edit:false}}/>
                </FeatureGroup>    
            </MapContainer> 
        </>
    )
}