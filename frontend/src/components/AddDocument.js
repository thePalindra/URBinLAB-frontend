import React from "react";
import { useNavigate } from "react-router-dom";
import Dropzone from 'react-dropzone';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Switch from '@mui/material/Switch';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CircularProgress from '@mui/material/CircularProgress';
import { Modal, Tooltip } from "@mui/material";
import { createFilterOptions } from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { MapContainer, TileLayer, GeoJSON, FeatureGroup, useMap } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"


let lat = 0
let lng = 0
let size = 0

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
      <div 
        style={{ 
            display: 'flex', 
            alignItems: 'center' 
        }}>
        <div style={{ width: '100%', mr: 10 }}>
          <LinearProgress variant="determinate" {...props} />
        </div>
        <div sx={{ minWidth: 35 }}>
            <Typography 
                style={{
                    marginLeft: "10px"
                }}
                fontSize={16} 
                variant="body2" 
                color="text.secondary">{`${Math.round(
                props.value,
          )}%`}</Typography>
        </div>
      </div>
    );
}

function range(min, max, step) {
    var len = max - min + 1;
    var arr = new Array(len);
    for (var i=0; i<len; i+=step) {
      arr[i] = (min + i).toString();
    }
    return arr;
}

function circle(e) {
    let result =  "c"
    
    lng = e.layer._latlng.lng
    lat = e.layer._latlng.lat 
    size = e.layer._mRadius
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

function polygonAux(origin, limit) {
    let res = "POLYGON (("
    res = [res+origin[0],origin[1]+","].join(" ")
    res = [res+origin[0],limit[1]+","].join(" ")
    res = [res+limit[0],limit[1]+","].join(" ")
    res = [res+limit[0],origin[1]+","].join(" ")
    res = [res+origin[0],origin[1]+"))"].join(" ")
    return res;
}

function measure(coord1, coord2) {
    const R = 6371e3; // Earth's radius in meters
    const lat1 = toRadians(coord1[0]);
    const lat2 = toRadians(coord2[0]);
    const deltaLat = toRadians(coord2[0] - coord1[0]);
    const deltaLon = toRadians(coord2[1] - coord1[1]);
  
    // Haversine formula
    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
  
    // Calculate length and width in meters
    const length = Math.abs(coord2[0] - coord1[0]) * distance;
    const width = Math.abs(coord2[1] - coord1[1]) * distance;
  
    // Calculate area in square meters
    const area = length * width;
  
    return area;
  }
  
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  

export default function Default() {
    let navigate = useNavigate()
    const types = [ 
        ["drawings", "Desenho"],
        ["thematic_statistics", "Estatísticas"],
        ["photography", "Fotografia"],
        ["aerial_photography", "Fotografia aérea"],
        ["satellite_image", "Imagem satélite"],
        ["LiDAR", "LiDAR"],
        ["geographic_map", "Mapa de Base"],
        ["thematic_map", "Mapa Temático"],
        ["ortos", "Ortofotomapa"],
        ["generic", "Outro documento"],
        ["reports", "Relatório"],
        ["sensors", "Sensores"]
    ];
    const OPTIONS_LIMIT = 20;
    const defaultFilterOptions = createFilterOptions();

    const [step, set_step]=React.useState(0)

    const [files, set_files]=React.useState([])
    const [key, set_key]=React.useState("")

    const [progress, set_progress] = React.useState(0);
    const [upload, set_upload] = React.useState(true);
    const [uploading, set_uploading] = React.useState(false);

    const [name, set_name] = React.useState("");
    const [description, set_description] = React.useState("");
    const [context, set_context] = React.useState("");
    const [link, set_link] = React.useState("");
    const [time, set_time] = React.useState("");
    const [provider, set_provider] = React.useState("");
    const [theme, set_theme] = React.useState("");
    const [color, set_color] = React.useState(true);
    const [resolution, set_resolution] = React.useState("");
    const [scale, set_scale] = React.useState("");
    const [satellite, set_satellite] = React.useState("");
    const [map_type, set_map_type] = React.useState("");
    const [raster, set_raster] = React.useState("Raster");
    const [variable, set_variable] = React.useState("");

    const [contexts, set_contexts] = React.useState([]);
    const [links, set_links] = React.useState([]);
    const [providers, set_providers] = React.useState([]);
    const [themes, set_themes] = React.useState([]);
    const [resolutions, set_resolutions] = React.useState([]);
    const [scales, set_scales] = React.useState([]);
    const [satellites, set_satellites] = React.useState([]);
    const [map_types, set_map_types] = React.useState([]);
    const [variables, set_variables] = React.useState("");

    const [raster_aux, set_raster_aux] = React.useState(true)

    const [type, set_type]=React.useState({id:"none", label: "Selecione uma opção"});
    const [type_id, set_type_id]=React.useState("");

    const [editable_FG, set_editable_FG] = React.useState(null);
    const [position, set_position]=React.useState([39.7, -9.3])
    const [zoom, set_zoom]=React.useState(7)
    const [layer_type, set_layer_type]=React.useState([]);
    const [default_space, set_default_space]=React.useState(false);

    const [spaces, set_spaces]=React.useState([]);
    const [temp_spaces, set_temp_spaces]=React.useState([]);

    const [space, set_space]=React.useState([]);
    const [space_name, set_space_name]=React.useState([]);
    const [aux_space_name, set_aux_space_name]=React.useState("");
    const [space_type, set_space_type]=React.useState(0);

    const [aux_file_name, set_aux_file_name]=React.useState("");
    const [aux_type, set_aux_type]=React.useState(true);

    const [modal1, set_modal1]=React.useState(false);
    const [modal2, set_modal2]=React.useState(false);

    const [ready_form, set_ready_form]=React.useState(false);


    React.useEffect(() => {
        const start = async () => {
            let ignore = await check_token("R");
            if (!ignore) {
                navigate(`/login`)
            }
            return () => { ignore = true; }
        }
        start()
    },[]);

    React.useEffect(() => {
        set_upload(files.length==0)
    }, [files]);

    React.useEffect(() => {
        switch(type.id) {
            case "drawings":
                get_contexts("drawings")
                break
            case "thematic_statistics":
            case "census":
            case "surveys":
                get_themes("thematic_statistics")
                break
            case "photography":
                get_resolutions("photography")
                break
            case "aerial_photograhy":
                get_resolutions("aerial_photography")
                get_scales("aerial_photography")
                break
            case "satellite_image":
                get_resolutions2("satellite_image")
                get_satellites()
                break
            case "LiDAR":
                get_resolutions2("LiDAR")
                break
            case "geographic_map":
            case "chorographic_map":
            case "topographic_map":
            case "topographic_plan":
                get_resolutions("geographic_map")
                get_scales("geographic_map")
                break
            case "thematic_map":
                get_map_types()
                get_themes("thematic_map")

                break
            case "ortos":
                get_scales("ortos")
                get_resolutions2("ortos")
                break
            case "reports":
                get_contexts("reports")
                get_themes("reports")
                break
            case "sensors":
                get_variables()
                break
            default:
                break
        }
    }, [type]);

    React.useEffect(()=> {
        if (default_space)
            set_space(<></>)
    }, [default_space])

    React.useEffect(() => {
        if (type.id === "geographic_map" || type.id === "thematic_statistics")
            set_ready_form(name !== "" && time !== "" && type_id !== "")
        else 
            set_ready_form(type.id !== "none" && name !== "" && time !== "")
        
    }, [type, name, time, type_id]);

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

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        set_editable_FG(reactFGref);
    }

    const filterOptions = (options, state) => {
        return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
    }

    function _created(e) {
        set_default_space(true)
        const drawnItems = editable_FG._layers;
        if (Object.keys(drawnItems).length > 1) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editable_FG.removeLayer(layer);
            });
        }
        switch(e.layerType) {
            case "circle":
                set_space_type(2)
                set_space_name(circle(e))
                let radius = e.layer._mRadius
                let center = e.layer._latlng
                let temp = zoom_setter(radius*radius*3.1415)
                set_zoom(temp[0])
                set_position([center.lat, center.lng])
                break;
            case "rectangle":
                set_space_type(3)
                set_space_name(polygon(e))
                let center2 = [(e.layer._latlngs[0][3].lat + e.layer._latlngs[0][1].lat)/2, (e.layer._latlngs[0][3].lng + e.layer._latlngs[0][1].lng)/2]
                set_position(center2)
                let temp_zoom = measure([e.layer._latlngs[0][3].lat, e.layer._latlngs[0][3].lng], [e.layer._latlngs[0][1].lat, e.layer._latlngs[0][1].lng])
                temp_zoom = zoom_setter(temp_zoom)[0]
                set_zoom(temp_zoom)
                break;
            case "polygon":
                console.log(e.layer._bounds._northEast.lat)
                set_space_name(polygon(e))
                let center3 = [(e.layer._bounds._northEast.lat + e.layer._bounds._southWest.lat)/2, (e.layer._bounds._northEast.lng + e.layer._bounds._southWest.lng)/2]
                set_position(center3)
                let temp_zoom2 = measure([e.layer._bounds._northEast.lat, e.layer._bounds._southWest.lng], [e.layer._bounds._southWest.lat, e.layer._bounds._northEast.lng])
                temp_zoom2 = zoom_setter(temp_zoom2)
                console.log(temp_zoom2)
                set_zoom(temp_zoom2[0]+1)
                set_space_type(3)
                break;
            default:
                break;
        }
        set_layer_type(e.layerType)
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

    function starter() {
        get_providers()
        get_links()
    }

    function get_links() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_all_urls", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{ 
            result = result.filter(Boolean)
            set_links(result)
        })
    }

    function get_providers() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_all_providers", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            result = result.filter(Boolean)
            console.log(result)
            set_providers(result)
        })
    }

    function get_resolutions (temp_url) {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/" + temp_url + "/get_image_resolution", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            result = result.filter(Boolean)
            set_resolutions(result)
        })
    }

    function get_scales (temp_url) {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/" + temp_url + "/get_scale", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            result = result.filter(Boolean)
            set_scales(result)
        })
    }

    function get_themes(temp_url) {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/" + temp_url + "/get_theme", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            result = result.filter(Boolean)
            set_themes(result)
        })
    }

    function get_contexts(temp_url) {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/" + temp_url + "/get_context", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            result = result.filter(Boolean)
            set_contexts(result)
        })
    }

    function get_resolutions2 (temp_url) {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/"+ temp_url + "/get_resolution", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            result = result.filter(Boolean)
            set_resolutions(result)
        })
    }

    function get_satellites() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/satellite_image/get_satellite", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            result = result.filter(Boolean)
            set_satellites(result)
        })
    }

    function get_map_types() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/thematic_map/get_type", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            result = result.filter(Boolean)
            set_map_types(result)
        })
    }

    function get_variables() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/sensors/get_variable", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            result = result.filter(Boolean)
            set_variables(result)
        })
    }

    async function get_spaces() {
        let res = await fetch("http://urbingeo.fa.ulisboa.pt:8080/space/get_spaces", {
            method: "GET"
        })
        res = await res.json();
        set_spaces(res)
    }

    async function get_space(temp_space_id) {
        set_modal1(true)
        let form = new FormData();
        form.append("id", temp_space_id)

        let res = await fetch("http://urbingeo.fa.ulisboa.pt:8080/space/by_id", {
            method: "POST",
            body: form
        })
        res = await res.json();

        let temp_zoom = zoom_setter(res[0][4])
            
        let temp_pos = res[0][3].replace('POINT(', '').replace(')', '').split(" ").reverse()
        set_position(temp_pos)
        set_zoom(temp_zoom[0])

        let parse = require('wellknown');
        set_space(res[0][0])
            
        set_space(res.map(doc => (
            <GeoJSON key={doc[0]} data={parse(doc[1])}>
            </GeoJSON>
        )))
        set_modal1(false)
    }
    
    async function file_space(selected_file, file_type) {
        set_space(<></>)
        set_modal1(true)
        const drawnItems = editable_FG._layers;
        if (Object.keys(drawnItems).length > 0) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editable_FG.removeLayer(layer);
            }); 
        }
        let form = new FormData();
        form.append("id", key)
        form.append("file", selected_file.name)
        
        if (file_type==="raster") {
            let resultRaster = await fetch("http://urbingeo.fa.ulisboa.pt:7000/raster", {
                method: "POST",
                body: form
            })
            try {
                resultRaster = await resultRaster.json();

                let temp_pos = [(resultRaster.origin[0] + resultRaster.limit[0]) / 2, (resultRaster.origin[1] + resultRaster.limit[1]) / 2]
                let temp_zoom = zoom_setter(measure([resultRaster.origin[0], resultRaster.origin[1]], [resultRaster.limit[0], resultRaster.limit[1]]))
                let parse = require('wellknown');

                set_position(temp_pos)
                set_space_name(parse(polygonAux(resultRaster.origin, resultRaster.limit)))
                set_zoom(temp_zoom)


                set_space(
                    <GeoJSON data={parse(polygonAux(resultRaster.origin, resultRaster.limit))}>
                    </GeoJSON>
                )
            } catch (error) {
                set_space_name("")
                set_aux_space_name("")
                set_aux_file_name("")
                set_modal1(false)
                set_modal2(true)
                set_default_space(false)
                set_space_type(0)
            } 
        } else {
            let resultBox = await fetch("http://urbingeo.fa.ulisboa.pt:7000/vector", {
                method: "POST",
                body: form
            })
            try {
                resultBox = await resultBox.json();
                let temp_zoom = zoom_setter(measure([resultBox.origin[0], resultBox.origin[1]], [resultBox.limit[0], resultBox.limit[1]]))
                let parse = require('wellknown');

                let temp_pos = [(resultBox.origin[1] + resultBox.limit[1]) / 2,(resultBox.origin[0] + resultBox.limit[0]) / 2]

                set_position(temp_pos)
                set_space_name(parse(polygonAux(resultBox.origin, resultBox.limit)))
                    
                /*let resultVector = await fetch("http://urbingeo.fa.ulisboa.pt:5050/transform/vector", {
                    method: "POST",
                    body: form
                })

                resultVector = await resultVector.json();*/

                set_zoom(temp_zoom[0])

                set_space(
                    <GeoJSON data={parse(polygonAux(resultBox.origin, resultBox.limit))}>
                    </GeoJSON>
                )
            } catch (error) {
                set_space_name("")
                set_aux_space_name("")
                set_aux_file_name("")
                set_modal1(false)
                set_modal2(true) 
                set_default_space(false)
                set_space_type(0)
            } 
        }
        set_modal1(false)
    }

    const get_form=()=> {
        switch(type.id) {
            case "drawings":
                return(
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}>
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={contexts}
                            value={context}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Contexto" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_context("")
                                else
                                    set_context(values)
                            }}
                        />
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined"
                            value={description} 
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                )
            case "thematic_statistics":
            case "census":
            case "surveys":
                return(
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de estatística</InputLabel>
                            <Select
                                size="small"
                                style={{
                                    textAlign:'left',
                                    width: "60%",
                                }}
                                label="Tipo de estatística"
                                onChange={(e)=>{
                                    set_type_id(e.target.value)
                                }}
                            >
                                <MenuItem value="thematic_statistics">Estatística Temática</MenuItem>
                                <MenuItem value="census">Censos</MenuItem>
                                <MenuItem value="surveys">Inquérito</MenuItem>
                            </Select>
                        </FormControl>
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={themes}
                            value={theme}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Tema" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_theme("")
                                else
                                    set_theme(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={contexts}
                            value={context}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Contexto" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_context("")
                                else
                                    set_context(values)
                            }}
                        />
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            value={description}
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                )
            case "photography":
                return (
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}>
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <div>
                            <Typography
                                style={{
                                    color: "rgb(0,0,0,0.5)",
                                    fontWeight: "bold"
                                }}>
                                A cores:
                            </Typography>
                            <Switch
                                style={{
                                    float: "left",
                                }}
                                checked={color}
                                onChange={() => set_color(!color)}
                                color="primary"
                            />
                        </div>
                        <Autocomplete
                            freeSolo
                            options={resolutions}
                            value={resolution}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Resolução de Imagem" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_resolution("")
                                else
                                    set_resolution(values)
                            }}
                        />
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined"
                            value={description} 
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                )
            case "aerial_photography":
                return (
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}>
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={resolutions}
                            value={resolution}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Resolução de Imagem" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_resolution("")
                                else
                                    set_resolution(values)
                            }}
                        />
                        <Autocomplete
                            freeSolo
                            options={scales}
                            value={scale}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Escala aproximada" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_scale("")
                                else
                                    set_scale(values)
                            }}
                        />
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            value={description}
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                )
            case "satellite_image":
                return (
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}>
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={resolutions}
                            value={resolution}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Resolução de Imagem" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_resolution("")
                                else
                                    set_resolution(values)
                            }}
                        />
                        <Autocomplete
                            freeSolo
                            options={satellites}
                            value={satellite}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Nome do satélite" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_satellite("")
                                else
                                    set_satellite(values)
                            }}
                        />
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            value={description}
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                )  
            case "LiDAR":
                return (
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}>
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={resolutions}
                            value={resolution}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Resolução" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_resolution("")
                                else
                                    set_resolution(values)
                            }}
                        />
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            value={description}
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                )   
            case "geographic_map":
            case "chorographic_map":
            case "topographic_map":
            case "topographic_plan":
                return (
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de mapa de base</InputLabel>
                            <Select
                                size="small"
                                style={{
                                    width: "60%",
                                    textAlign:'left'
                                }}
                                label="Tipo de mapa de base"
                                onChange={(e)=>{
                                    set_type_id(e.target.value)
                                }}
                            >
                                <MenuItem value="geographic_map">Mapa Geográfico</MenuItem>
                                <MenuItem value="chorographic_map">Mapa Corográfico</MenuItem>
                                <MenuItem value="topographic_map">Mapa Topográfico</MenuItem>
                                <MenuItem value="topographic_plan">Planta Topográfica</MenuItem>
                            </Select>
                        </FormControl>
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                marginTop: "1vh",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={scales}
                            value={scale}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Escala" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_scale("")
                                else
                                    set_scale(values)
                            }}
                        />
                        <Autocomplete
                            freeSolo
                            options={resolutions}
                            value={resolution}
                            disabled={!raster_aux}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Resolução de imagem" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_resolution("")
                                else
                                    set_resolution(values)
                            }}
                        />
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            value={description}
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                ) 
            case "thematic_map":
                return (
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}> 
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={scales}
                            value={scale}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Escala" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_scale("")
                                else
                                    set_scale(values)
                            }}
                        />
                        <Autocomplete
                            disablePortal
                            value={raster}
                            options={["Raster", "Vetorial"]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Tipo"/>}
                            onInputChange={(e, values, reason) => {
                                console.log(e)
                                if (reason === 'clear') 
                                    set_raster("Raster")
                                else {
                                    set_raster(values)  
                                    set_raster_aux(values==="Raster")
                                }
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={resolutions}
                            value={resolution}
                            disabled={!raster_aux}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Resolução de imagem" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_resolution("")
                                else
                                    set_resolution(values)
                            }}
                        />
                        <Autocomplete
                            freeSolo
                            options={themes}
                            value={theme}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Tema" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_theme("")
                                else
                                    set_theme(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={map_types}
                            value={map_type}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Tipo de Mapa" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_map_type("")
                                else
                                    set_map_type(values)
                            }}/>
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            value={description}
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                ) 
            case "ortos":
                return (
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}> 
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={scales}
                            value={scale}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Escala" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_scale("")
                                else
                                    set_scale(values)
                            }}
                        />
                        <Autocomplete
                            freeSolo
                            options={resolutions}
                            value={resolution}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Resolução" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_resolution("")
                                else
                                    set_resolution(values)
                            }}
                        />
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            value={description}
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                ) 
            case "generic":
                return (
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}> 
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            value={description}
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                ) 
            case "reports":
                return (
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}> 
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={themes}
                            value={theme}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Tema" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_theme("")
                                else
                                    set_theme(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={contexts}
                            value={context}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Contexto" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_context("")
                                else
                                    set_context(values)
                            }}
                        />
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            value={description}
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                ) 
            case "sensors":
                return (
                    <div
                        style={{
                            position: "relative",
                            top: "5px",
                            margin: "auto",
                        }}> 
                        <Autocomplete
                            freeSolo
                            value={name}
                            options={[]}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "60%", 
                                    float:"left",
                                }}
                                {...params} 
                                required
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_name("")
                                else
                                    set_name(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={providers}
                            value={provider}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Fornecedor" 
                                />}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_provider("")
                                    else
                                        set_provider(values)
                                }}/>
                        <Autocomplete
                            disablePortal
                            value={time}
                            options={range(1700, new Date().getFullYear(), 1).reverse()}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "40%", 
                                    float:"left",
                                }} 
                                {...params} 
                                label="Ano" 
                                required/>}
                            onChange={(e, values)=>set_time(values)}/>
                        <Autocomplete
                            freeSolo
                            options={links}
                            value={link}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "50%", 
                                    float:"left",
                                }}
                                {...params} 
                                label="Link"/>}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_link("")
                                else
                                    set_link(values)
                            }}/>
                        <Autocomplete
                            freeSolo
                            options={variables}
                            value={variable}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField  
                                label="Variável medida" 
                                style={{
                                    width: "60%", 
                                    float:"left"}}
                                variant="outlined" 
                                {...params}
                                size="small"
                            />}
                            onInputChange={(e, values, reason) => {
                                if (reason === 'clear') 
                                    set_variable("")
                                else
                                    set_variable(values)
                            }}/>
                        <TextField 
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            value={description}
                            style={{
                                float: "left",
                                width: "97%",
                                height: "40px",
                                top: "1vh"
                            }}
                            multiline
                            fullWidth
                            rows={5}
                            onChange={(e)=>set_description(e.target.value)}
                            size="small"/>
                    </div>
                ) 
            default:
                return(
                    <div
                        style={{
                            position: "relative",
                            margin: "auto",
                            overflow: "auto",
                            display: "block",
                            textAlign: "center",
                            height: "100%"
                        }}>
                        <Typography 
                            variant="h5" 
                            component="h2"
                            style={{
                                marginTop: "30%",
                                color: "rgb(0,0,0,0.4",
                                fontWeight: "bold"
                            }}>
                            Selecione um tipo de documento
                        </Typography>
                    </div>
                )
        }
    }

    function get_phase() {
        switch(step) {
            case 0:
                return (
                    <>
                        <div
                            style={{
                                position: "absolue",
                                float: "left",
                                width: "40%",
                                height: "100%",
                            }}>
                            <div
                                style={{
                                    position: "relative",
                                    border: "3px solid grey",
                                    float: "right",
                                    width: "80%",
                                    height: "25%",
                                    justifyContent: "center",
                                    display: "flex",
                                    top: "25%",
                                    margin: "auto",
                                    borderRadius: "10px"
                                }}>
                                <Typography 
                                    variant="h6" 
                                    style={{ 
                                        position: "absolute",
                                        fontWeight: "bold",
                                        marginTop: "10px",
                                        color: "rgba(0, 0, 0, 0.7)",
                                        margin:"auto",
                                    }}>
                                    Upload de ficheiros
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    fontSize={14}
                                    style={{ 
                                        position: "absolute",
                                        top: "65%",
                                        color: "rgba(0, 0, 0, 0.5)",
                                        margin:"auto",
                                    }}>
                                    Arraste os ficheiros e pastas ou clique aqui para selecionar os ficheiros.
                                </Typography>
                                <div
                                    style={{
                                        position: "absolute",
                                        background: "rgba(0, 0, 0, 0.2)",
                                        height: "40px",
                                        width: "40px",
                                        top: "30%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "50%",
                                    }}>
                                    <FileUploadIcon/>
                                </div>
                                <Dropzone
                                    style={{
                                        width: "100%",
                                        height: "100%"
                                    }}
                                    onDrop={(acceptedFiles) => {
                                        let arr = [...files];
                                        acceptedFiles.forEach((file) => {
                                        if (!arr.find((f) => f.name === file.name)) {
                                            arr.push(file);
                                        }
                                        });
                                        set_files(arr);
                                    }}
                                    >
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                zIndex: 1,
                                                cursor: "pointer"
                                            }}>
                                        <input {...getInputProps()} multiple />
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                            <Button
                                size="large"
                                variant="contained" 
                                disabled= {upload}
                                onClick= {() => {
                                    set_uploading(true)
                                    upload_files()
                                    set_upload(true)
                                }}
                                style={{
                                    zIndex: 400,  
                                    marginLeft: "20%",  
                                    top: "30%"
                                }}>
                                Continuar
                            </Button>
                            {uploading ? 
                                <div
                                    style={{
                                        position: "fixed",
                                        width: "18%",
                                        left: "15%",
                                        top: "65%",
                                        borderRadius: "50px",
                                        background: "rgb(0,0,0,0.5)"
                                    }}>
                                    <LinearProgressWithLabel
                                        variant="determinate" 
                                        value={progress} />
                            </div>:<></>}
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                width: "55%",
                                marginLeft: "45%",
                                height: "100%",
                                justifyContent: "center",
                            }}>
                            <Typography 
                                variant="h6" 
                                style={{ 
                                    fontWeight: "bold",
                                    paddingTop: "10px",
                                    color: "rgba(0, 0, 0, 0.7)",
                                    margin:"auto",
                                    height:"5%"
                                }}>
                                {files.length} Ficheiros
                            </Typography>
                            <div
                                style={{
                                    marginTop: "20px",
                                    position: "absolute",
                                    height: "92%",
                                    width: "100%",
                                    overflow: "auto"
                                }}>
                                {files?.length>0 && files.map((doc, index) => {
                                    let temp_time = new Date(doc.lastModified).toString().split(" ")
                                    temp_time = temp_time[2] + " " + temp_time[1]   + "," + temp_time[3]
                                    let temp_size = (doc.size / (1024*1024)).toFixed(2);

                                    return(
                                        <div
                                            key={index}
                                            style={{
                                                height:"170px",
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
                                                    fontSize={22}
                                                    color="black"
                                                    sx={{fontWeight: 'bold'}}>
                                                    {doc.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    fontSize={14}
                                                    color="black"
                                                    style={{
                                                        position:"absolute",
                                                        marginTop:"35px",
                                                        fontWeight: 'bold'
                                                    }}>
                                                    Data de modificação:
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    fontSize={14}
                                                    color="black"
                                                    style={{
                                                        position:"absolute",
                                                        marginTop:"35px",
                                                        marginLeft: "150px"
                                                    }}>
                                                    {temp_time} 
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    fontSize={14}
                                                    color="black"
                                                    style={{
                                                        position:"absolute",
                                                        marginTop:"55px",
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
                                                        marginTop:"55px",
                                                        marginLeft: "80px"
                                                    }}>
                                                    {temp_size} MB 
                                                </Typography>
                                                <Button 
                                                    size="small"
                                                    variant="contained" 
                                                    style={{
                                                        position: "absolute",
                                                        marginTop: "100px",
                                                        background: "rgba(228,38,76,255)",
                                                    }}
                                                    onClick= {() => {
                                                        let arr = [...files]
                                                        arr.splice(index, 1)
                                                        set_files(arr)
                                                    }}>
                                                    Remover
                                                </Button>
                                            </div>
                                            <hr
                                                style={{
                                                    width: "98%",
                                                    left: "2%",
                                                    position: "absolute",
                                                    top: "160px",
                                                }}/>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                )
            case 1:
                return (
                    <>
                        <Button
                            size="large"
                            variant="contained" 
                            onClick= {() => {
                                set_step(0)
                                set_upload(false)
                            }}
                            style={{
                                position: "fixed",
                                height: "50px",
                                left: "20px",
                                top: "10%",
                            }}>
                            Retroceder
                        </Button>
                        <div
                            style={{
                                border: "3px solid grey",
                                borderRadius: "10px",
                                height: "80%",
                                width: "40%",
                                margin:"auto",
                                marginTop: "2%",
                            }}>
                            <Autocomplete
                                disablePortal
                                value={type}
                                options={types.map((option)=>({id: option[0], label: option[1]}))}
                                style={{
                                    width: "60%",
                                    margin: "auto",
                                    marginTop: "4%"
                                }}
                                getOptionLabel={option => option.label}
                                onInputChange={(e, values, reason) => {
                                    if (reason === 'clear') 
                                        set_type({id:"none", label: "Selecione uma opção"})
                                }}
                                renderInput={(params) => <TextField 
                                    {...params} 
                                    label="Tipo de documento" 
                                    />}
                                onChange={(e, value) => {
                                    if (value) {
                                        set_type(value)
                                        set_type_id("")
                                    }
                                }}/> 
                            <div
                                style={{
                                    marginTop: "4%",
                                    overflow: "auto",
                                    marginLeft: "3%",
                                    height: "80%"
                                }}>
                                {get_form()}
                            </div>
                        </div>
                        <Tooltip
                            title="Preencha os campos obrigatórios* antes de prosseguir">
                            <div>
                                <Button
                                    size="large"
                                    variant="contained" 
                                    disabled={!ready_form}
                                    onClick= {() => {
                                        get_spaces()
                                        set_step(2)
                                    }}
                                    style={{
                                        height: "50px",
                                        top: "20px"
                                    }}>
                                    Continuar
                                </Button>
                            </div>
                        </Tooltip>
                    </>
                )
            case 2:
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
                            open={modal2}
                            onClose={()=>{
                                set_modal2(false)
                            }}>
                            <div 
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: "30%",
                                    background: "rgba(256, 256, 256, 0.9)",
                                    border: '1px solid #000',
                                    boxShadow: 24,
                                    borderRadius: "10px",
                                    textAlign: "left",
                                    height: "30vh",
                                    overflow: "auto"
                                }}>
                                <div>
                                    <Typography 
                                        variant="h4" 
                                        style={{ 
                                            color: "rgba(0, 0, 0, 0.9)",
                                            margin:"auto",
                                            maxWidth: "90%",
                                            marginTop: "3vh"
                                        }}>
                                        Erros
                                    </Typography>
                                </div>
                                <div>
                                    <Typography 
                                        variant="h6" 
                                        style={{ 
                                            color: "rgba(0, 0, 0, 0.9)",
                                            margin:"auto",
                                            maxWidth: "90%",
                                            marginTop: "3vh"
                                        }}>
                                        Não foi possível extrair um contexto espacial a partir do ficheiro selecionado.
                                    </Typography>
                                </div>
                            </div>
                        </Modal>
                        <Button
                            size="large"
                            variant="contained" 
                            onClick= {() => {
                                set_step(1)
                            }}
                            style={{
                                position: "fixed",
                                height: "50px",
                                left: "20px",
                                top: "10%",
                            }}>
                            Retroceder
                        </Button>
                        <div
                            style={{
                                position: "fixed",
                                width: "55%",
                                marginTop: "130px",

                            }}>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "10%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>  
                                <Stack direction="row" alignItems="center">
                                    <Typography 
                                        fontSize={12}
                                        fontWeight="bold"
                                        color= "black"
                                        style={{
                                            width: "40px"
                                        }}>
                                        Local
                                    </Typography>
                                    <Switch 
                                        disabled={space_type!=0} 
                                        value={aux_type} 
                                        onClick={()=>set_aux_type(!aux_type)} 
                                        inputProps={{ 'aria-label': 'ant design' }} 
                                        />
                                    <Typography 
                                        fontSize={12}
                                        fontWeight="bold"
                                        color= "black"
                                        style={{
                                            width: "50px"
                                        }}>
                                        Ficheiro
                                    </Typography>
                                </Stack>
                                {aux_type? 
                                    (
                                        <>
                                            {/*<Button 
                                                size="large"
                                                variant="contained" 
                                                disabled= {space_type!=0}
                                                onClick= {() => {
                                                    set_aux_type(false)
                                                }}
                                                style={{
                                                    zIndex: 400, 
                                                    width: "22%",
                                                }}>
                                                    Usar ficheiros
                                            </Button>*/}
                                            <Autocomplete
                                                disablePortal
                                                disabled={default_space}
                                                filterOptions={filterOptions}
                                                inputValue={aux_space_name}
                                                options={temp_spaces.map((option)=>({id: option[0], label: option[1]}))}
                                                style={{
                                                    width: "60%",
                                                    borderRadius: "5px",
                                                    marginLeft: "10px"
                                                }}
                                                getOptionLabel={option => option.label}
                                                onInputChange={(e, values, reason) => {
                                                    if (reason === "input") {
                                                        set_aux_space_name(values)
                                                        if (values.length >= 1)
                                                            set_temp_spaces(spaces)
                                                        else 
                                                            set_temp_spaces([])
                                                    }
                                                }}
                                                renderInput={(params) => <TextField 
                                                    {...params} 
                                                    label="Selecionar local para contexto espacial" 
                                                    />}
                                                onChange={(e, value) => {
                                                    if (value) {
                                                        set_space_type(1)
                                                        set_aux_space_name(value.label)
                                                        set_space_name(value.id)
                                                        get_space(value.id)
                                                    }
                                                }}/>
                                        </>
                                    ) :
                                        <>
                                            {/*<Button 
                                                size="large"
                                                variant="contained" 
                                                disabled= {space_type!=0}
                                                onClick= {() => {
                                                    set_aux_type(true)
                                                }}
                                                style={{
                                                    zIndex: 400, 
                                                    width: "22%",
                                                }}>
                                                    Usar Locais
                                            </Button>*/}
                                            <Autocomplete
                                                disablePortal
                                                disabled={default_space}
                                                options={files.map((option) => ({label: option.name, file: option}))}
                                                inputValue={aux_file_name}
                                                getOptionLabel={option => option.label}
                                                size="large"
                                                style={{
                                                    width: "60%",
                                                    borderRadius: "5px",
                                                    marginLeft: "10px"
                                                }}
                                                renderInput={(params) => <TextField 
                                                    {...params} 
                                                    getOptionLabel={option => option.name}
                                                    label="Selecionar ficheiro para contexto espacial"
                                                    onInputChange={(e, values, reason) => {
                                                        if (reason === "input") 
                                                            set_aux_file_name(values)
                                                    }}
                                                    />}
                                                onChange={(e, values)=>{
                                                    if (values) {
                                                        set_space_type(3)
                                                        let temp = values.file.name.split(".")[values.file.name.split(".").length-1]
                                                    
                                                        if (temp==="jpg" || temp==="jpeg" || temp==="tif" || temp==="png" || temp==="asc") 
                                                            file_space(values.file, "raster") 
                                                        else file_space(values.file, "vector") 

                                                        set_aux_file_name(values.label)
                                                    }
                                                }}/>
                                        </>
                                }
                                <Button 
                                    size="large"
                                    variant="contained" 
                                    disabled= {space_type==0}
                                    onClick= {() => {
                                        set_space_name("")
                                        set_aux_space_name("")
                                        set_aux_file_name("")
                                        set_space(<></>)
                                        const drawnItems = editable_FG._layers;
                                        if (Object.keys(drawnItems).length > 0) {
                                            Object.keys(drawnItems).forEach((layerid, index) => {
                                                if (index > 0) return;
                                                const layer = drawnItems[layerid];
                                                editable_FG.removeLayer(layer);
                                            });
                                        }
                                        set_default_space(false)
                                        set_space_type(0)
                                        set_position([39.7, -9.3])
                                        set_zoom(7)
                                    }}
                                    style={{
                                        zIndex: 400,  
                                        marginLeft: "10px"  
                                    }}>
                                        Limpar 
                                </Button>
                            </div>
                            <div 
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "10%",
                                    marginTop: "20%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <Button 
                                    size="large"
                                    variant="contained" 
                                    onClick= {() => {
                                        create_document()
                                    }}
                                    style={{
                                        zIndex: 400,   
                                    }}>
                                        Confirmar documento
                                </Button>
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
                            <FeatureGroup ref={featureGroupRef => {
                                onFeatureGroupReady(featureGroupRef);
                            }}>
                                <EditControl 
                                    style={{
                                        display: "none"
                                    }}
                                    position="topleft"
                                    onCreated={(e) => {
                                        _created(e)
                                    }}
                                    draw= {{
                                        circlemarker: false,
                                        polyline: false,
                                        marker: false
                                    }}
                                    edit={{
                                        edit:false, 
                                        remove: false
                                    }}/>
                            </FeatureGroup>  
                            {space}
                        </MapContainer> 
                    </>
                )
            default:
                return <></>
        }
    }

    function update_progress(temp) {
        let result = Math.round((temp/(files.length*2))*100)
        set_progress(result)
    }

    function all_form_append() {
        let form = new FormData()
        form.append("name", name);
        form.append("description", description);
        form.append("provider", provider);
        form.append("timeScope", time+"/01/01");
        form.append("link", link);

        switch(type) {
            case "aerial_photography": 
                form.append("resolution", resolution)
                form.append("scale", scale)
                break;
            case "geographic_map":
            case "chorographic_map":
            case "topographic_map":
            case "topographic_plan":
                form.append("scale", scale)
                form.append("resolution", resolution)
                form.append("raster", raster)
                break;
            case "drawings":
                form.append("context", context);
                break;
            case "LiDAR":
                form.append("resolution", resolution)
                break;
            case "ortos":
                form.append("resolution", resolution)
                form.append("scale", scale)
                break;
            case "photography":
                form.append("color", color);
                form.append("resolution", resolution)
                break;
            case "reports":
                form.append("context", context);
                form.append("theme", theme)
                break;
            case "satellite_image":
                form.append("resolution", resolution)
                form.append("satellite", satellite)
                break;
            case "sensors":
                form.append("variable", variable);
                break;
            case "thematic_statistics":
            case "census":
            case "surveys":
                form.append("theme", theme)
                break;
            case "thematic_map":
                form.append("scale", scale)
                form.append("resolution", resolution)
                form.append("type", raster)
                form.append("raster", raster)
                form.append("theme", theme)
                form.append("mapType", map_type)
                break;
            default:
                break;
        }
        return form;
    }

    async function upload_files() {
        let form = new FormData();
        form.append("files", files[0]);
        let response = await fetch("http://urbingeo.fa.ulisboa.pt:7000/upload", {
          method: "POST",
          body: form,
        });
        let key = await response.json();
        update_progress(1)

        for (let i = 1; i<files.length; i++) {
            update_progress(i*2)
            form = new FormData();
            form.append("file", files[i]);
            form.append("key", key);

            response = await fetch("http://urbingeo.fa.ulisboa.pt:7000/add", {
                method: "POST",
                body: form,
            });

            update_progress(i*2+1)
        }
     
        set_key(key);
        set_step(1)
        set_uploading(false)
        set_progress(0)
        starter()
    }

    function remove_duplicates(arr) {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }

    async function create_document() {
        let form = all_form_append()
        form.append("token", window.localStorage.getItem("token"))
        set_modal1(true)
        let temp_url = type.id
        if (temp_url === "thematic_statistics" || temp_url === "geographic_map")
            temp_url = type_id
        
        let docId = await fetch("http://urbingeo.fa.ulisboa.pt:8080/"+ temp_url +"/add_document", {
            method: "POST",
            body: form
        })
        if (docId.ok) {
            docId = await docId.json();
            console.log(docId)

            let es_form = all_form_append()
            es_form.append("id", docId)
            es_form.append("timeScope", time)

            let temp_arr = []
            for (let i = 0; i<files.length; i++) {
                console.log(files[i])
                console.log(temp_arr)
                temp_arr = temp_arr.concat(files[i].name.split("."))
            }
            temp_arr = remove_duplicates(temp_arr)
            console.log(temp_arr.join(" "))
            es_form.append("files", temp_arr.join(" "))
            es_form.append("archiver", JSON.parse(window.localStorage.getItem("token")).researcher.name)
            

            fetch("http://urbingeo.fa.ulisboa.pt:5050/es/put", {
                method: "POST",
                body: es_form
            })

            let sform = new FormData();
            sform.append("document", docId);

            switch(space_type) {
                case 1:
                    sform.append("id", space_name);
                    fetch("http://urbingeo.fa.ulisboa.pt:8080/space/attach", {
                        method: "POST",
                        body: sform
                    })
                    break;
                case 2:
                    if (lng > 1 || lat > 1 || size > 1) {
                        sform.append("lng", lng)
                        sform.append("lat", lat)
                        sform.append("size", size)
                        sform.append("name", name)
                        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/add_circle", {
                            method: "POST",
                            
                            body: sform
                        })
                    }
                    break;
                case 3:
                    let wkttemp = JSON.stringify(space_name);
                    sform.append("name", name)
                    sform.append("space", space_name)
                    fetch("http://urbingeo.fa.ulisboa.pt:8080/space/add", {
                        method: "POST",
                        
                        body: sform
                    })
                    break;
                default:
                    
            }

            let fform = new FormData();
            fform.append("id", docId)
            fform.append("files", key)

            let fileres = await fetch("http://urbingeo.fa.ulisboa.pt:7000/save", {
                method: "POST",
                body: fform
            })

            fileres = await fileres.json()
            navigate(`/document/${docId}`)
        }
    }
    
    return(
        <>
            <div
                style={{
                    position: "fixed",
                    background: "rgba(256, 256, 256, 0.85)",
                    float: "left",
                    width: "100%",
                    height: "92%",
                }}>
                {get_phase()}
            </div>
        </>
    )
}