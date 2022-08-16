import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"

function circle(e) {
    let result =  ["CIRCLE","("+e.layer._latlng.lng, e.layer._latlng.lat+",", e.layer._mRadius+")"].join(" ")
    console.log(result)
    
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

export default function IsThis() {
    const position = [38.5, -16];
    const [id, setId] = React.useState()
    let space = ""
    let wkt = "new Wkt.Wkt();"

    function getDocumentBySpaceGeometry() {
        let form = new FormData();
        form.append("page", 0);
        form.append("space", space);
            
        fetch("http://localhost:8080/generic/get_document_by_space_geometry", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
        });
    }

    const _created=e=> {
        console.log(e)
        let res = 0
        switch(e.layerType) {
            case "circle":
                res = circle(e)
                break;
            case "rectangle":
                res = polygon(e)
                break;
            case "marker":
                res = point(e)
                break;
            case "polygon":
                res = polygon(e)
                break;
            default:
                break;
        }
        space = res
        getDocumentBySpaceGeometry()
    }

    return (
        <>
            <div style={{
                margin: "auto",
                width: "90%",
                border: "1px solid black",
                background: "rgba(256, 256, 256, 0.92)",
                borderRadius: "20px",
                padding: "15px"}}>
                    <TextField id="serach" label="Pesquisa" variant="outlined" 
                        style={{
                            width: "15%"
                        }}
                        size="small"/>   
            </div>
            <br/>
            <div style={{   margin: "auto",
                        width: "90%",
                        heigth: "30%",
                        border: "1px solid black",
                        background: "rgba(256, 256, 256, 0.92)",
                        borderRadius: "20px",
                        padding: "30px"}}>
                <MapContainer style={{width: "100%"}} center={position} zoom={6} scrollWheelZoom={true} minZoom={4}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />   
                    <FeatureGroup>
                        <EditControl position="topright"
                            onCreated={_created}
                            draw= {{
                                circlemarker: false,
                                polyline: false
                            }}>
                        </EditControl>      
                    </FeatureGroup>   
                </MapContainer>   
            </div> 
        </>
    );
}