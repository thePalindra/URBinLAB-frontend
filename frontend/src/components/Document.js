import React from "react";
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup } from 'react-leaflet'
import "leaflet-draw/dist/leaflet.draw.css"

export default function Default() {
    let navigate = useNavigate()
    let { id } = useParams();
    const [position, set_position]=React.useState([39.5, -9])
    const [space, set_space]=React.useState(<></>)
    const [tags, set_tags]=React.useState([]);
    const [document, set_document]=React.useState([])
    const [files, set_files]=React.useState([])
    const [modal1, set_modal1]=React.useState(false);
    const [specifics, set_specifics]=React.useState([])

    React.useEffect(() => {
        let ignore = false;
        if (!ignore) {
            get_space()
            get_document()
            get_files()
        }
        return () => { ignore = true; }
    },[]);

    function get_files() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/file/get", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            set_files(result)
        })
    }

    function get_space() {
        set_space(<></>)
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/generic/get_space", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_position(result[0][1].replace('POINT(', '').replace(')', '').split(" "))
            let parse = require('wellknown');
            set_space(
                <>
                    <GeoJSON key={1} data={parse(result[0][0])}>
                    </GeoJSON>
                </>
            )
        })
    }

    function get_document() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/generic/by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            set_document(result[0])
        })
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
                    width:"120%",
                    left: "-10%",}}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{
                        position: "relative",
                        width: "150%",
                        left:"-25%",
                        top: "20%",
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
                            width: "35%",
                            overflowY: "hidden",
                            overflowX: "hidden"
                        }}>
                        {tags?.length>0 && tags.map((doc, index)=>{
                            return(
                                <Typography 
                                    variant="h6" 
                                    style={{ 
                                        color: "rgba(256, 256, 256, 0.9)",
                                    }}>
                                        {doc[0]} ({doc[1]})
                                </Typography>
                            )
                        })}
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
                    <Tooltip
                        title="Editar tags">
                        <IconButton
                            style={{
                                background: "rgba(3,137,173,255)",
                                left: "2%"
                            }} >
                            <EditIcon
                                style={{
                                    color: "rgba(256, 256, 256, 0.9)"}}/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </div>
            <div
                style={{ 
                    margin: "auto",
                    position: "relative",
                    background: "rgba(256, 256, 256, 0.90)",
                    height: "84vh",
                    width:"100%"}}>
                <div
                    style={{ 
                        margin: "auto",
                        position: "relative",
                        height: "84vh",
                        width:"26%",
                        float: "left"}}>
                    <Box
                        display="flex"
                        alignItems="center"
                        style={{
                            heigth: "5vh",
                            marginTop: "2vh"
                        }}>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                            }}>
                                {document[4]}
                        </Typography>
                        <Tooltip
                            title="Editar meta informação">
                            <IconButton
                                style={{
                                    background: "rgba(3,137,173,255)",
                                    left: "-10%"
                                }} >
                                <EditIcon
                                    style={{
                                        color: "rgba(256, 256, 256, 0.9)"}}/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <div 
                        style={{
                            marginTop: "4vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Tipo de documento:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {document[6]}
                        </Typography>
                    </div>
                    <div 
                        style={{
                            marginTop: "8vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Fornecedor/autor:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {document[7]}
                        </Typography>
                    </div>
                </div>
                <div
                    style={{ 
                        margin: "auto",
                        position: "relative",
                        height: "84vh",
                        width:"28%",
                        float: "left"}}>
                    <Box
                        display="flex"
                        alignItems="center"
                        style={{
                            heigth: "5vh",
                            marginTop: "2vh"
                        }}>
                        <Typography 
                            variant="h5" 
                            style={{ 
                                position: "relative",
                                margin: "auto",
                                color: "rgba(0, 0, 0, 0.9)",
                            }}>
                                Lista de Ficheiros
                        </Typography>
                        <Tooltip
                            title="Editar ficheiros">
                            <IconButton
                                style={{
                                    background: "rgba(3,137,173,255)",
                                    left: "-10%"
                                }} >
                                <EditIcon
                                    style={{
                                        color: "rgba(256, 256, 256, 0.9)"}}/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <List
                        style={{
                            top: "3vh",
                            overflow: "auto",
                            height: "75vh"
                        }}>
                        {files?.length && files.map((doc, index) => {
                            return(
                                <div 
                                    key={index} 
                                    style={{
                                        margin: "auto",
                                        height: "12vh", 
                                        border: "1px solid grey",}}>
                                    <Typography
                                        variant="b2" 
                                        component="h5" 
                                        color="rgba(0, 0, 0, 0.85)"
                                        style={{
                                            float: "left",
                                            marginTop: "3%",
                                            marginLeft: "4%"
                                        }}>
                                        {doc[1]}
                                    </Typography>
                                </div>
                            )
                        })}
                    </List>
                </div>
                <div
                    style={{ 
                        margin: "auto",
                        position: "relative",
                        height: "84vh",
                        width:"42%",
                        float: "left"}}>
                </div>
                <MapContainer 
                    style={{
                        position: 'absolute',
                        top: '70%',
                        left: '77.1%',
                        transform: 'translate(-50%, -50%)',
                        width: "46%",
                        boxShadow: 24,
                        height: "50vh",
                    }} 
                    center={position} 
                    zoom={6} 
                    scrollWheelZoom={true} 
                    minZoom={4}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />     
                    {space}
                </MapContainer> 
            </div>
        </>
    );
}