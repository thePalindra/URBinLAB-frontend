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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

export default function Default() {
    let navigate = useNavigate()
    let navigateCancel = useNavigate()
    let space = ""
    const position = [38, -17.7];
    const [search, setSearch]=React.useState('');
    const [open, setOpen]=React.useState(false);
    const [editableFG, setEditableFG] = React.useState(null);
    const [spatialList, setSpatialList]=React.useState(<></>);

    React.useEffect(() => {
        let ignore = false;

        if (!ignore) {

        }
        return () => { ignore = true; }
    },[]);

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
    }

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        setEditableFG(reactFGref);
    };
    
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <div style={{ 
                    border: "1px solid black",
                    background: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "10px",
                    height: "6vh",
                    width: "96%",
                    margin: "auto"}}>
                    <IconButton style={{ position: "fixed", left: "2%"
                    }}
                        onClick={()=>{
                            navigateCancel(`/`)
                    }}>
                        <ArrowBackIcon sx={{ fontSize: 40, color: "#FFFFFF" }}/>
                    </IconButton>
                    <IconButton 
                        style={{
                            position: "fixed", 
                            right: "3%", 
                            paddingTop: "26px"}}
                        onClick={()=>setOpen(true)}>
                        <QuestionMarkIcon sx={{fontSize: 40, position: "fixed", color: "#FFFFFF"}}/>
                    </IconButton>
                    <div style={{ paddingTop: "10px" }}>
                        <Button variant="contained"  onClick={()=>{
                            navigateCancel(`/`)
                            }}>
                            Nova pesquisa
                        </Button>
                    </div>
                </div>
                <div>
                    <div style={{ 
                        border: "1px solid black",
                        background: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "10px",
                        height: "80vh",
                        left:"1%",
                        width: "15%",
                        marginTop: "10px",
                        position: "fixed"}}>
                        <br/>
                        <Typography variant="h5" component="h2" color="#FFFFFF">
                            Filtros
                        </Typography>
                    </div>
                    <div style={{ 
                        border: "1px solid black",
                        background: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "10px",
                        height: "80vh",
                        left:"17%",
                        width: "22%",
                        marginTop: "10px",
                        position: "fixed"}}>
                        <br/>
                        <Typography variant="h5" component="h2" color="#FFFFFF">
                            Lista de Resultados
                        </Typography>
                        <Autocomplete
                            freeSolo
                            options={[]}
                            size="small"
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField 
                                style={{width: "80%", float:"left"}}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                        />
                    </div>
                    <MapContainer 
                        style={{   
                            margin: "auto",
                            width: "59%",
                            padding: "1px",
                            position: "fixed",
                            left: "40%",
                            height: "81vh",
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
            </ThemeProvider>
        </>
    )
}