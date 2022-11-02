import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Link } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
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

export default function Signup() {
    let navigate = useNavigate()
    let navigateCancel = useNavigate()
    let space = ""
    const position = [38, -17.7];
    const [search, setSearch]=React.useState('');
    const [open, setOpen]=React.useState(false);
    const [editableFG, setEditableFG] = React.useState(null);
    const [spatialList, setSpatialList]=React.useState(<></>);

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
        get_document_by_space_geometry()
    }

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        setEditableFG(reactFGref);
    };

    async function get_search_result() {
        let form = new FormData()
        form.append("query", search.toLowerCase().trim())
        const response = await fetch("http://localhost:5050/es/search", {
            method: "POST",
            body: form
        })

        const ar = await response.json();

        form = new FormData()
        form.append("list", ar)
        fetch("http://localhost:8080/generic/from_list", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            window.localStorage.setItem('results', result);
        });
    }

    function get_document_by_space_geometry() {
        let form = new FormData();
        form.append("page", 0);

        if (space === "c") {
            form.append("lng", lng)
            form.append("lat", lat)
            form.append("size", size)

            fetch("http://localhost:8080/generic/get_document_by_space_circle", {
                method: "POST",
                headers: window.localStorage,
                body: form
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)
            });
        } else {
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
    }

    return (
        <>
            <Modal 
                keepMounted
                open={open}
                onClose={()=>{setOpen(false)}}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "25%",
                        background: "rgba(256, 256, 256, 0.92)",
                        border: '5px solid #000',
                        boxShadow: 24,
                        borderRadius: "20px",
                        textAlign: "center"
                    }}>
                    <br/>
                    <Typography variant="h6" component="h2">
                            Ajuda
                    </Typography>
                    <br/>
                </div>
            </Modal>
            <div style={{ 
                border: "1px solid black",
                background: "rgba(256, 256, 256, 0.92)",
                borderRadius: "10px",
                height: "6vh",
                width: "90%",
                margin: "auto"}}>
                <IconButton style={{ position: "fixed", left: "5%"
                }}
                    onClick={()=>{
                        navigateCancel(`/`)
                }}>
                    <ArrowBackIcon sx={{ fontSize: 40 }}/>
                </IconButton>
                <IconButton 
                    style={{
                        position: "fixed", 
                        right: "6%", 
                        paddingTop: "26px"}}
                    onClick={()=>setOpen(true)}>
                    <QuestionMarkIcon sx={{fontSize: 40,position: "fixed"}}/>
                </IconButton>
                <Autocomplete
                    freeSolo
                    options={[]}
                    size="small"
                    sx={{ paddingTop: "10px" }}
                    renderInput={(params) => <TextField 
                        style={{width: "20%"}}
                        {...params} 
                        label="" 
                        variant="outlined"
                        onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    get_search_result()
                                    ev.preventDefault();
                                }
                            }
                        }
                        onChange={(e)=>{
                            setSearch(e.target.value)
                        }}
                        size="small"
                    />}
                    onChange={(e, values)=>{
                        setSearch(values)
                    }}/> 
            </div>
            <div>
                <MapContainer 
                    style={{
                        width: "92%",
                        height: "80vh",
                        margin: "auto"
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
                                polyline: false
                            }}
                            edit={{edit:false}}/>
                    </FeatureGroup>       
                    {spatialList}
                </MapContainer>  
            </div>
        </>

    );
}
