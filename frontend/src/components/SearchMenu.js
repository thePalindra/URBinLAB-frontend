import * as React from 'react';
import TextField from '@mui/material/TextField';
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import "leaflet-draw/dist/leaflet.draw.css"

let lat = 0
let lng = 0
let size = 0

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    background: "rgba(256, 256, 256, 0.92)",
    border: '1px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius: "20px"
  };

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

export default function IsThis() {
    const position = [38.5, -16];
    const [id, setId] = React.useState()
    const [open, setOpen] = React.useState(false);
    let space = ""
    let wkt = "new Wkt.Wkt();"

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    function getDocumentBySpaceGeometry() {
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
            
            <Grid justify="space-between"
                style={{
                margin: "auto",
                width: "90%",
                border: "1px solid black",
                background: "rgba(256, 256, 256, 0.92)",
                borderRadius: "20px",
                padding: "15px"}}
                >
                    <Button variant="contained" 
                        style={{backgroundColor: "black",
                        marginRight: "200px"}}
                        onClick={handleOpen}> Formulário
                    </Button>

                    <Modal
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                    >
                    <Box sx={style}>
                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                            Text in a modal
                        </Typography>
                        <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                        </Box>
                    </Modal>
                    <TextField id="serach" 
                        label="Pesquisa" 
                        variant="outlined" 
                        size="small"
                        style={{marginLeft: "200px"}}/>  
                    <Button variant="contained" 
                        style={{backgroundColor: "black"}}> Pesquisar
                    </Button>     
            </Grid>

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