import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';

import JSZip from "jszip"

import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
import "leaflet-draw/dist/leaflet.draw.css"



export default function Default() {
    let navigate = useNavigate()
    let { id } = useParams();

    const [position, set_position]=React.useState([39.7, -9.3])
    const [zoom, set_zoom]=React.useState(7)
    const [space, set_space]=React.useState(<></>);

    const [document, set_document]=React.useState([])    
    const [files, set_files]=React.useState([])
    const [archiver, set_archiver]=React.useState([])
    const [type_translation, set_type_translation]=React.useState([])

    const [specifics, set_specifics]=React.useState(<></>)

    const [auth, set_auth]=React.useState(false)

    const [modal1, set_modal1]=React.useState(false);
    const [modal2, set_modal2]=React.useState(false);


    React.useEffect(() => {
        const start = async () => {
            let ignore = await check_token("A");
            if (ignore) {
                let temp = await check_token("R")
                get_space()
                get_document()
                get_files()  
                set_auth(temp)                  
            } else {
                window.localStorage.removeItem("token")
                navigate(`/login`)
            }
            return () => { ignore = true; }
        }
        start()
    },[]);

    async function check_token(type) {
        let form = new FormData();
        form.append("type", type)
        form.append("token", window.localStorage.getItem("token"))

        let res = await fetch("http://urbingeo.fa.ulisboa.pt:8080/token/check", {
            method: "POST",
            body: form
        })

        return res.ok
    }

    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
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

    function get_files() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/file/get", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_files(result)
            console.log(result)
        })
    }

    function get_space() {
        set_space(<></>)
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_space", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            if (result.length == 0)
                return

            let temp_zoom = zoom_setter(result[0][3])
            
            let temp_pos = result[0][1].replace('POINT(', '').replace(')', '').split(" ").reverse()
            set_position(temp_pos)
            set_zoom(temp_zoom[0])
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            result[0][8] = result[0][8].split(" ")[2]
            set_document(result[0])
            
            get_archiver(result[0][2])
            get_type(result[0][6])
        })
    }

    function get_archiver(archiver_id) {
        let form = new FormData();
        form.append("id", archiver_id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/user/archiver_name", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_archiver(result)
        })
    }

    function get_type(type) {
        switch(type) {
            case "AERIAL PHOTOS":
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
            case "SATELLITE IMAGES":
                set_type_translation("Imagem satélite")
                get_satellite()
                break
            case "CHOROGRAPHIC MAPS":
                set_type_translation("Carta corográfica")
                get_base_map()
                break
            case "TOPOGRAPHIC MAPS":
                set_type_translation("Carta topográfica")
                get_base_map()
                break
            case "GEOGRAPHIC MAPS":
                set_type_translation("Carta geográfica")
                get_base_map()
                break
            case "TOPOGRAPHIC PLANS":
                set_type_translation("Plano topográfico")
                get_base_map()
                break
            case "THEMATIC MAPS":
                set_type_translation("Carta temática")
                get_thematic_map()
                break
            case "DRAWINGS":
                set_type_translation("Desenhos")
                get_drawings()
                break
            case "PHOTOS":
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
                set_type_translation("Outro")
                break
        }
    }

    function get_base_map() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/geographic_map/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Escala:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            1:{result[0]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Resolução de Imagem:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[2]}
                    </Typography>
                    <br/>
                </>
            )
        })
    }

    function get_statistics() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/thematic_statistics/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Escala:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result}
                    </Typography>
                    <br/>
                </>
            )
        })
    }

    function get_aerial_photography() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/aerial_photography/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Resolução de imagem:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[0]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Escala aproximada:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            1:{result[1]}
                    </Typography>
                    <br/>
                </>
            )
        })
    }

    function get_lidar() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/LiDAR/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Resolução:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result}
                    </Typography>
                    <br/>
                </>
            )
        })
    }

    function get_orto() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/ortos/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Escala:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[0]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Escala:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            1:{result[1]}
                    </Typography>
                    <br/>
                </>
            )
        })
    }

    function get_satellite() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/satellite_image/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Satélite:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[0]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Resolução:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[1]}
                    </Typography>
                    <br/>
                </>
            )
        })
    }

    function get_thematic_map() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/thematic_map/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Escala:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            1:{result[0]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Natureza:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[1]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Escala:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            1:{result[0]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Resolução de imagem:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[2]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Tema:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[4]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Tipo de mapa temático:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[5]}
                    </Typography>
                    <br/>
                </>
            )
        })
    }

    function get_drawings() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/drawings/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Contexto:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result}
                    </Typography>
                    <br/>
                </>
            )
        })
    }

    function get_photography() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/photography/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Resolução de imagem:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result}
                    </Typography>
                    <br/>
                </>
            )
        })
    }

    function get_reports() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/reports/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Contexto:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[0]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Tema:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result[1]}
                    </Typography>
                    <br/>
                </>
            )
        })
    }

    function get_sensors() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/sensors/get_by_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_specifics(
                <>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Variável medida:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {result}
                    </Typography>
                    <br/>
                </>
            )
        })
    }
    
    async function download_files() {
        set_modal1(true)
        let zip = new JSZip();
        let FileSaver = require('file-saver');
        for (let i = 0; i<files.length; i++) {
            let form = new FormData();
            form.append("id", files[i][0])

            let download_res = await fetch("http://urbingeo.fa.ulisboa.pt:8080/file/download", {
                method: "POST",
                
                body: form
            })

            download_res = await download_res.blob()
            await zip.file(files[i][1], download_res)
        }
        zip.generateAsync({type:"blob"}).then(function(content) {
            FileSaver.saveAs(content, document[4] + ".zip");
        });
        set_modal1(false)
    }

    function delete_document() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/delete", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            navigate(`/`)    
        })
    }

    return (
        <>
            <Modal
                keepMounted
                open={modal1}
                >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <CircularProgress/>
                </div>
            </Modal>
            <Modal
                keepMounted
                open={modal2}>
                <div 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "40%",
                        background: "rgba(256, 256, 256, 0.9)",
                        border: '1px solid #000',
                        boxShadow: 24,
                        borderRadius: "10px",
                        textAlign: "center",
                        height: "35%",
                        overflow: "auto"
                    }}>
                    <Typography 
                        variant="h6"
                        fontSize={30} 
                        align="center"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            marginTop:"20px"
                        }}>
                            Pretende apagar este documento?
                    </Typography>
                    <Button
                        size="large"
                        variant="contained" 
                        onClick= {() => {
                            set_modal2(false)
                        }}
                        style={{
                            top: "35%",
                        }}>
                        Cancelar
                    </Button>
                    <Button
                        size="large"
                        variant="contained" 
                        onClick= {() => {
                            delete_document()
                        }}
                        style={{
                            background: "rgba(228,38,76,255)",
                            top: "35%",
                            marginLeft: "20px",
                        }}>
                        Apagar documento
                    </Button>
                </div>
            </Modal>
            <div
                style={{
                    position: "fixed",
                    background: "rgba(256, 256, 256, 0.85)",
                    float: "left",
                    width: "55%",
                    height: "92%",
                }}>
                <div
                    style={{
                        width: "100%",
                        height: "50%"
                    }}>
                    <Typography 
                        variant="h6"
                        fontSize={35} 
                        fontWeight= "bold"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            margin:"auto",
                        }}>
                            {document[4]}
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Arquivista:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {archiver}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Tipo de documento:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {type_translation}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Fornecedor/Autor:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {document[7]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Ano:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {document[8]}
                    </Typography>
                    <br/>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Adicionado a:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "5px"
                        }}>
                            {document[9]}
                    </Typography>
                    <br/>
                    {specifics}
                    <Typography 
                        variant="body2"
                        fontSize={14}
                        color="black"
                        fontWeight="bold"
                        style={{
                            marginLeft: "10px",
                            float: "left"
                        }}>
                            Descrição:
                    </Typography>
                    <Typography 
                        variant="body2"
                        fontSize={12}
                        color="black"
                        align="left"
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            float: "left",
                            marginLeft: "10px",
                            overflow: "auto"
                        }}>
                            {document[5]}
                    </Typography>
                </div>
                {
                    auth? 
                    <Button
                        size="large"
                        variant="contained" 
                        onClick= {() => {
                            set_modal2(true)
                        }}
                        style={{
                            position: "fixed",
                            top: "9%",
                            left: "45%",
                            background: "rgba(228,38,76,255)",
                        }}>
                        Apagar
                    </Button>
                    :
                    <></>
                }
                
                <div
                    style={{
                        width: "100%",
                        height: "50%"
                    }}>
                    <Button
                        size="large"
                        variant="contained" 
                        onClick= {() => {
                            download_files()
                        }}
                        style={{
                            marginTop: "20px",
                        }}>
                        Download
                    </Button>
                    <Typography 
                        variant="h6" 
                        fontSize={60}
                        style={{ 
                            position: "fixed",
                            fontWeight: "bold",
                            color: "rgba(0, 0, 0, 0.1)",
                            top: "75%",
                            left: "25%"
                        }}>
                        {files.length} Ficheiros
                    </Typography>
                    <div
                        style={{
                            marginTop: "5%px",
                            height: "83%",
                            width: "100%",
                            overflow: "auto"
                        }}>
                        {files?.length>0 && files.map((doc, index) => {
                            let temp_size = (doc[3] / (1024*1024)).toFixed(2);

                            return(
                                <div
                                    key={index}
                                    style={{
                                        height:"130px",
                                        marginTop: "10px",
                                        position: "relative"
                                    }}>
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "95%",
                                            height: "100%",
                                            marginTop: "10px",
                                            display: "flex",
                                            justifyContent: "left",
                                            marginLeft: "20px"
                                        }}>
                                        <Typography
                                            variant="h6"
                                            fontSize={20}
                                            color="black"
                                            sx={{fontWeight: 'bold'}}>
                                            {doc[1]}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontSize={14}
                                            color="black"
                                            style={{
                                                position:"absolute",
                                                marginTop:"65px",
                                                fontWeight: 'bold'
                                            }}>
                                            Dimensão: 
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontSize={14}
                                            color="black"
                                            style={{
                                                position:"absolute",
                                                marginTop:"65px",
                                                marginLeft: "80px"
                                            }}>
                                            {temp_size} MB 
                                        </Typography>
                                    </div>
                                    <hr
                                        style={{
                                            width: "98%",
                                            left: "2%",
                                            position: "absolute",
                                            top: "120px",
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
                    marginLeft: "55%",
                    width: "45%",
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
                {space}
            </MapContainer> 
        </>

    );
}