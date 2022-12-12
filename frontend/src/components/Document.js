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
    const [collection, set_collection]=React.useState([])
    const [archiver, set_archiver]=React.useState([])
    const [type_translation, set_type_translation]=React.useState([])
    const [specifics, set_specifics]=React.useState(<></>)
    const [files, set_files]=React.useState([])
    const [modal1, set_modal1]=React.useState(false);

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
            if (result.length == 0)
                return
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
            console.log(result[0])
            set_document(result[0])
            if (!result[0][1])
                set_collection("")
            
            get_archiver(result[0][2])
            get_type(result[0][6])
        })
    }

    function get_archiver(archiver_id) {
        let form = new FormData();
        form.append("id", archiver_id)

        fetch("http://localhost:8080/user/archiver_name", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_archiver(result)
        })
    }

    function get_base_map() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/geographic_map/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Escala:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[0]}
                        </Typography>
                    </div>
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
                                Natureza:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[1]}
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
                                Resolução de imagem:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[2]}
                        </Typography>
                    </div>
                    <div 
                        style={{
                            marginTop: "12vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Tipo de geometria:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[3]}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_statistics() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/thematic_statistics/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Tema:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_aerial_photography() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/aerial_photography/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Resolução de imagem:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[0]}
                        </Typography>
                    </div>
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
                                Escala aproximada:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[1]}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_lidar() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/lidar/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Resolução:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_orto() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/ortos/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Resolução:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[0]}
                        </Typography>
                    </div>
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
                                Escala:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[1]}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_satellite() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/satellite_image/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Satelite:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[0]}
                        </Typography>
                    </div>
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
                                Resolução:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[1]}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_thematic_map() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/thematic_map/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Escala:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[0]}
                        </Typography>
                    </div>
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
                                Natureza:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[1]}
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
                                Resolução de imagem:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[2]}
                        </Typography>
                    </div>
                    <div 
                        style={{
                            marginTop: "12vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Tipo de geometria:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[3]}
                        </Typography>
                    </div>
                    <div 
                        style={{
                            marginTop: "16vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Tema:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[4]}
                        </Typography>
                    </div>
                    <div 
                        style={{
                            marginTop: "20vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Tipo de mapa temático:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[5]}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_drawings() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/drawings/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Contexto:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_photography() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/photography/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Resolução de imagem:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_reports() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/reports/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Contexto:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[0]}
                        </Typography>
                    </div>
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
                                Tema:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result[1]}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_sensors() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/sensors/get_by_id", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <div 
                        style={{
                            marginTop: "0vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Variável medida:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {result}
                        </Typography>
                    </div>
                </>
            )
        })
    }

    function get_type(type) {
        switch(type) {
            case "AERIAL PHOTOGRAPHY":
                set_type_translation("Fotografia aérea")
                get_aerial_photography()
                break
            case "LiDAR":
                set_type_translation("LiDAR")
                get_lidar()
                break
            case "ORTOS":
                set_type_translation("Ortofotomapa")
                get_orto()
                break
            case "SATELLITE IMAGE":
                set_type_translation("Imagem satélite")
                get_satellite()
                break
            case "CHOROGRAPHIC MAP":
                set_type_translation("Carta corográfica")
                get_base_map()
                break
            case "TOPOGRAPHIC MAP":
                set_type_translation("Carta topográfica")
                get_base_map()
                break
            case "GEOGRAPHIC MAP":
                set_type_translation("Carta geográfica")
                get_base_map()
                break
            case "TOPOGRAPHIC PLAN":
                set_type_translation("Plano topográfico")
                get_base_map()
                break
            case "THEMATIC MAP":
                set_type_translation("Carta temática")
                get_thematic_map()
                break
            case "DRAWINGS":
                set_type_translation("Desenhos")
                get_drawings()
                break
            case "PHOTOGRAPHY":
                set_type_translation("Fotografia")
                get_photography()
                break
            case "REPORTS":
                set_type_translation("Relatório")
                get_reports()
                break
            case "SENSORS":
                set_type_translation("Dados de sensores")
                get_sensors()
                break
            case "CENSUS":
                set_type_translation("Censos")
                get_statistics()
                break
            case "SURVEYS":
                set_type_translation("Estatística de formulário")
                get_statistics()
                break
            case "THEMATIC STATISTICS":
                set_type_translation("Estatística temática")
                get_statistics()
                break
            default:
                set_type_translation("Documento não especificado")
                break
        }
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
                                Coleção:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {collection}
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
                                Arquivista:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {archiver}
                        </Typography>
                    </div>
                    <div 
                        style={{
                            marginTop: "12vh"
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
                                {type_translation}
                        </Typography>
                    </div>
                    <div 
                        style={{
                            marginTop: "16vh"
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
                    <div 
                        style={{
                            marginTop: "20vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Ano:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {document[8].split(" ")[2]}
                        </Typography>
                    </div>
                    <div 
                        style={{
                            marginTop: "24vh"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Adicinado a:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%"
                            }}>
                                {document[9]}
                        </Typography>
                    </div>
                    <div 
                        style={{
                            marginTop: "28vh",
                            height: "20%",
                            border: "1px solid grey",
                            borderRadius: "5px",
                            overflow: "auto"
                        }}>
                        <Typography 
                            variant="b3" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.7)",
                                marginLeft: "2%",
                                marginTop: "0.5vh",
                                float: "left"
                            }}>
                                Descrição:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                float: "left",
                                marginLeft: "1%",
                            }}>
                                {document[5]} 
                        </Typography>
                    </div>
                    {specifics}
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