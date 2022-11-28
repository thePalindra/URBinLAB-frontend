import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Link } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import "leaflet-draw/dist/leaflet.draw.css"
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


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

    React.useEffect(() => {
        let ignore = false;
        if (!ignore) {
            get_all_documents()
        }
        return () => { ignore = true; }
    },[]);

    function get_all_documents() {
        fetch("http://localhost:8080/generic/all", {
            method: "POST",
            headers: window.localStorage
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
        });
    }

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
                    background: "rgba(256, 256, 256, 0.9)",
                    height: "8vh",
                    left: "-10%",
                    width:"120%"}}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{
                        position: "relative",
                        left:"10%",
                        top: "22%"
                    }}>                
                    <IconButton 
                        size="small" 
                        onClick={() => {
                            document.getElementById("overflowing").scrollBy(-300,0)
                        }}>
                        <NavigateBeforeIcon 
                            fontSize="large"/>
                    </IconButton>
                    <Box
                        id="overflowing"
                        display="flex"
                        style={{
                            background: "rgba(0, 0, 0, 0.4)",
                            borderRadius: "17px",
                            position:"relative",
                            left:"1%",
                            maxWidth: "70%",
                            overflowY: "hidden",
                            overflowX: "hidden"
                        }}>
                        <FormControlLabel 
                            control={<Checkbox />} 
                            label={
                                <Typography 
                                    variant="h6" 
                                    style={{ 
                                        color: "rgba(256, 256, 256, 0.9)" 
                                    }}>
                                        Work
                                </Typography>
                            }/>
                        <FormControlLabel control={<Checkbox />} label="Label2" />
                        <FormControlLabel control={<Checkbox />} label="Label3" />
                        <FormControlLabel control={<Checkbox />} label="Label4" />
                        <FormControlLabel control={<Checkbox />} label="Label5" />
                        <FormControlLabel control={<Checkbox />} label="Label6" />
                        <FormControlLabel control={<Checkbox />} label="Label7" />
                        <FormControlLabel control={<Checkbox />} label="Label8" />
                        <FormControlLabel control={<Checkbox />} label="Label9" />
                        <FormControlLabel control={<Checkbox />} label="Label10" />
                        <FormControlLabel control={<Checkbox />} label="Label11" />
                        <FormControlLabel control={<Checkbox />} label="Label12" />
                        <FormControlLabel control={<Checkbox />} label="Label13" />
                        <FormControlLabel control={<Checkbox />} label="Label14" />
                        <FormControlLabel control={<Checkbox />} label="Label15" />
                        <FormControlLabel control={<Checkbox />} label="Label16" />
                        <FormControlLabel control={<Checkbox />} label="Label17" />
                        <FormControlLabel control={<Checkbox />} label="Label18" />
                        <FormControlLabel control={<Checkbox />} label="Label19" />
                        <FormControlLabel control={<Checkbox />} label="Label20" />
                        <FormControlLabel control={<Checkbox />} label="Label21" />
                        <FormControlLabel control={<Checkbox />} label="Label22" />
                        <FormControlLabel control={<Checkbox />} label="Label23" />
                        <FormControlLabel control={<Checkbox />} label="Label24" />
                    </Box>
                    <IconButton 
                        size="small" 
                        style={{left:"2%"}} 
                        onClick={ () => {
                            document.getElementById("overflowing").scrollBy(300,0)
                        }}>
                        <NavigateNextIcon 
                            fontSize="large"/>
                    </IconButton>
                    <Button 
                        variant="filled" 
                        style={{
                            left:"2%", 
                            background: "rgba(0, 0, 0, 0.4)",
                        }} 
                        startIcon={<FilterListIcon />}>
                        Filtros
                    </Button>
                </Box>
            </div>
            <div 
                style={{ 
                    margin: "auto",
                    position: "relative",
                    background: "rgba(256, 256, 256, 0.90)",
                    height: "90vh",
                    width:"100%"}}>
                <div 
                    style={{
                        position:"relative",
                        float:"left",
                        width:"40%"                  
                    }}>
                    <List>
                        <ListItem 
                            disablePadding>
                            <ListItemButton>
                                <ListItemText 
                                    primary="Trash"/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem 
                            disablePadding>
                            <ListItemButton>
                                <ListItemText 
                                    primary="Trash"/>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </div>
                <MapContainer 
                    style={{
                        position: 'absolute',
                        top: '46.7%',
                        left: '70%',
                        transform: 'translate(-50%, -50%)',
                        width: "60%",
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