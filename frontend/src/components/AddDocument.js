import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"

let lat = 0
let lng = 0
let size = 0

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

function polygonAux(origin, limit) {
    let res = "POLYGON (("
    res = [res+origin[0],origin[1]+","].join(" ")
    res = [res+origin[0],limit[1]+","].join(" ")
    res = [res+limit[0],limit[1]+","].join(" ")
    res = [res+limit[0],origin[1]+","].join(" ")
    res = [res+origin[0],origin[1]+"))"].join(" ")
    return res;
}

function range(min, max, step) {
    var len = max - min + 1;
    var arr = new Array(len);
    for (var i=0; i<len; i+=step) {
      arr[i] = (min + i).toString();
    }
    return arr;
}

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 200
        },
    },
};

export default function Default() {
    let navigate = useNavigate()
    const color_list = ["rgba(228,38,76,255)", "rgba(121,183,46,255)", "rgba(247,166,20,255)", "rgba(3,137,173,255)"]
    const [position, set_position]=React.useState([39.5, -9])
    const [color, set_color]=React.useState("")
    const [files, set_files]=React.useState([])
    const [tags, set_tags]=React.useState([]);
    const [tag_input, set_tag_input]=React.useState([]);

    const [modal1, set_modal1]=React.useState(false);
    const [modal2, set_modal2]=React.useState(false);
    const [modal3, set_modal3]=React.useState(false);
    const [modal4, set_modal4]=React.useState(false);
    const [modal5, set_modal5]=React.useState(false);

    const [new_type, set_new_type]=React.useState("none");
    const [URLs, setURL]=React.useState('geographic_map');
    const [new_name, set_new_name]=React.useState('');
    const [new_provider, set_new_provider]=React.useState('');
    const [new_time, set_new_time]=React.useState('');
    const [new_link, set_new_link]=React.useState('');
    const [new_raster, set_new_raster]=React.useState(true);
    const [new_res, set_new_res]=React.useState('');
    const [new_scale, set_new_scale]=React.useState('');
    const [new_theme, set_new_theme]=React.useState('');
    const [new_map_type, set_new_map_type]=React.useState('');
    const [new_desc, set_new_desc]=React.useState('');
    const [new_variable, set_new_variable]=React.useState('');
    const [new_satellite, set_new_satellite]=React.useState('');
    const [new_context, set_new_context]=React.useState('');
    const [new_color, set_new_color]=React.useState(true);
    const [new_tags, set_new_tags]=React.useState([])
    const [new_collection, set_new_collection]=React.useState("")

    const [new_collection_name, set_new_collection_name]=React.useState("")
    const [new_collection_description, set_new_collection_description]=React.useState("")

    const [allProviders, setAllProviders]=React.useState([]);
    const [allURLs, setAllURLs]=React.useState([]);
    const [allDrawingsContext, setAllDrawingsContext]=React.useState([]);
    const [allStatisticsThemes, setAllStatisticsThemes]=React.useState([]);
    const [allPhotoImageResolution, setAllPhotoImageResolution]=React.useState([]);
    const [allAerialPhotoImageResolution, setAllAerialPhotoImageResolution]=React.useState([]);
    const [allAerialPhotoScale, setAllAerialPhotoScale]=React.useState([]);
    const [allSatellite, setAllSatellite]=React.useState([]);
    const [allSatelliteResolution, setAllSatelliteResolution]=React.useState([]);
    const [allLiDARResolution, setAllLiDARResolution]=React.useState([]);
    const [allMapImageResolution, setAllMapImageResolution]=React.useState([]);
    const [allMapScale, setAllMapScale]=React.useState([]);
    const [allMapGeometryType, setAllMapGeometryType]=React.useState([]);
    const [allMapTheme, setAllMapTheme]=React.useState([]);
    const [allMapType, setAllMapType]=React.useState([]);
    const [allOrtosScale, setAllOrtosScale]=React.useState([]);
    const [allOrtosResolution, setAllOrtosResolution]=React.useState([]);
    const [allReportsTheme, setAllReportsTheme]=React.useState([]);
    const [allReportsContext, setAllReportsContext]=React.useState([]);
    const [allSensorsVariable, setAllSensorsVariable]=React.useState([]);
    const [all_collections, set_all_collections]=React.useState([]);

    const [editable_FG, set_editable_FG] = React.useState(null);
    const [wkt, setWKT]=React.useState("[]");
    const [new_space, set_new_space]=React.useState("[]");
    const [selected_hierarchy, set_selected_hierarchy]=React.useState("");
    const [selected_level, set_selected_level]=React.useState("");
    const [spatial_hierarchy, set_spatial_hierarchy]=React.useState([]);
    const [spatial_hierarchy_type, set_spatial_hierarchy_type]=React.useState([]);
    const [selected_spatial_hierarchy_type, set_selected_spactial_hierarchy_type]=React.useState([]);
    const [spatial_level, set_spatial_level]=React.useState([]);
    const [spatial_query, set_spatial_query] =React.useState("");
    const [all_spatial_names, set_all_spatial_names]=React.useState([]);

    React.useEffect(() => {
        let ignore = false;
        if (!ignore) {
            get_color()
            get_tags()
            get_collections()
        }
        return () => { ignore = true; }
    },[]);

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        set_editable_FG(reactFGref);
    };

    const _created=e=> {
        set_new_space(<></>)
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
                setWKT(circle(e))
                break;
            case "rectangle":
                setWKT(parse(polygon(e)))
                break;
            case "marker":
                setWKT(parse(point(e)))
                break;
            case "polygon":
                setWKT(parse(polygon(e)))
                break;
            default:
                break;
        }
    }

    function get_tags() {
        fetch("http://localhost:8080/keyword/get_all", {
            method: "POST",
            headers: window.localStorage,
        })
        .then(res=>res.json())
        .then(result=>{
            set_tags(result)
        })
    }

    function get_collections() {
        fetch("http://localhost:8080/collection/get_all", {
            method: "POST",
            headers: window.localStorage,
        })
        .then(res=>res.json())
        .then(result=>{
            set_all_collections(result)
        })
    }

    function get_color() {
        let res = Math.floor(Math.random() * color_list.length)
        if (color_list[res] === color)
            get_color()
        else
            set_color(color_list[res])
    }

    const get_spaces =()=> {
        const drawnItems = editable_FG._layers;
        if (Object.keys(drawnItems).length > 0) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editable_FG.removeLayer(layer);
            });
        }

        let form = new FormData();
        form.append("name", spatial_query)
        form.append("level", selected_level)
        form.append("hierarchy", selected_hierarchy)

        fetch("http://localhost:8080/space/search_by_name", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)

            let parse = require('wellknown');
            setWKT(result[0][0])
            console.log(wkt)
                
            set_new_space(result.map(doc => (
                <GeoJSON key={doc[0]} data={parse(doc[1])}>
                </GeoJSON>
            )))
        })
    }

    function get_spatial_hierarchy_type() {
        fetch("http://localhost:8080/space/get_hierarchy_type", {
            method: "POST",
            headers: window.localStorage,
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            set_spatial_hierarchy_type(result)
        })
    }

    function get_spatial_hierarchy(value) {
        let form = new FormData()
        form.append("type", value)
        fetch("http://localhost:8080/space/get_hierarchy", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_spatial_hierarchy(result)
        })
    }

    function get_spatial_level(hier) {
        let form = new FormData();
        form.append("hierarchy", hier)

        fetch("http://localhost:8080/space/get_levels", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_spatial_level(result)
        })
    }

    function get_names_from_level(level) {
        let form = new FormData();
        form.append("hierarchy", selected_hierarchy)
        form.append("level", level)

        fetch("http://localhost:8080/space/get_names", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_all_spatial_names(result)
        })
    }

    function add_tag() {
        let form = new FormData()

        form.append("keyword", tag_input)
        fetch("http://localhost:8080/keyword/add", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            tags.push([result.id, result.keyword])
        })
    }

    function create_collection() {
        let form = new FormData()

        form.append("name", new_collection_name)
        form.append("description", new_collection_description)
        fetch("http://localhost:8080/collection/add", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            all_collections.push([result.id, result.name])
            set_modal3(false)
        })
    }

    function create_document() {
        
    }

    async function auto_space(selected_file, file_type, files) {
        const drawnItems = editable_FG._layers;
        if (Object.keys(drawnItems).length > 0) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editable_FG.removeLayer(layer);
            });
        }
        let form = new FormData();
        form.append("file", selected_file)
        
        for (const temp of files) {
            if (selected_file!==temp)
                form.append('aux', temp);
            console.log(temp)
        }

        if (file_type==="raster") {
            let resultRaster = await fetch("http://localhost:5050/transform/raster", {
                method: "POST",
                body: form
            })
            
            resultRaster = await resultRaster.json();

            let parse = require('wellknown');
            setWKT(parse(polygonAux(resultRaster.origin, resultRaster.limit)))

            console.log(resultRaster)

            set_new_space(
                <GeoJSON data={parse(polygonAux(resultRaster.origin, resultRaster.limit))}>
                </GeoJSON>
            )
        } else {
            let resultBox = await fetch("http://localhost:5050/mbox", {
                method: "POST",
                body: form
            })

            resultBox = await resultBox.json();
            console.log(resultBox)

            let parse = require('wellknown');
            setWKT(parse(polygonAux(resultBox.origin, resultBox.limit)))
                
            let resultVector = await fetch("http://localhost:5050/transform/vector", {
                method: "POST",
                body: form
            })

            resultVector = await resultVector.json();

            set_new_space(
                <GeoJSON data={resultVector}>
                </GeoJSON>
            )
            
        }
    }
    
    return (
        <>
            <Modal
                keepMounted
                open={modal1}
                onClose={()=>{
                    set_modal1(false)
                }}>
                <div 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "80%",
                        background: "rgba(256, 256, 256, 0.9)",
                        border: '1px solid #000',
                        boxShadow: 24,
                        borderRadius: "10px",
                        height: "90vh",
                    }}>
                    <Box 
                        display="flex"
                        style={{
                            width:"100%",
                            height:"100%"
                        }}>
                        <div 
                            style={{   
                                position: "relative",
                                width: "40%",
                                left: "0%",
                                textAlign: "center"
                            }}>  
                            <Typography 
                                variant="h4" 
                                style={{ 
                                    color: "rgba(0, 0, 0, 0.9)",
                                    margin:"auto",
                                    maxWidth: "70%",
                                    marginTop: "3vh"
                                }}>
                                Pesquisar por contexto espacial
                            </Typography>
                            <Autocomplete
                                disablePortal
                                options={spatial_hierarchy_type}
                                size="small"
                                renderInput={(params) => <TextField 
                                    style={{
                                        marginTop: "4vh",
                                        width: "70%"
                                    }} 
                                    {...params} 
                                    label="Tipo de contexto"/>}
                                onChange={(e, values)=>{
                                    if (values) {
                                        set_selected_spactial_hierarchy_type(values)
                                        get_spatial_hierarchy(values)
                                    }
                                }}/>
                            <Autocomplete
                                disablePortal
                                options={spatial_hierarchy}
                                size="small"
                                renderInput={(params) => <TextField 
                                    style={{
                                        marginTop: "2vh",
                                        width: "70%"
                                    }} 
                                    {...params} 
                                    label="Nome"/>}
                                onChange={(e, values)=>{
                                    if (values) {
                                        set_selected_hierarchy(values)
                                        get_spatial_level(values)
                                    }
                                }}/>
                            <Autocomplete
                                disablePortal
                                options={spatial_level}
                                size="small"
                                renderInput={(params) => <TextField 
                                    style={{
                                        marginTop: "2vh",
                                        width: "70%"
                                    }} 
                                    {...params} 
                                    label="Nível" 
                                    />}
                                onChange={(e, values)=>{
                                    if (values) {
                                        set_selected_level(values)
                                        get_names_from_level(values)
                                    }
                                }}/>
                            <Autocomplete
                                disablePortal
                                options={all_spatial_names}
                                size="small"
                                renderInput={(params) => <TextField 
                                    style={{
                                        marginTop: "2vh",
                                        width: "70%"
                                    }} 
                                    {...params} 
                                    label={selected_level.charAt(0).toUpperCase() + selected_level.slice(1)}
                                    />
                                }
                                onChange={(e, values)=>{
                                    if (values)
                                        set_spatial_query(values)
                                }}/>
                            <Button 
                                style = {{
                                    marginTop: "2vh"
                                }}
                                variant="contained" 
                                onClick={get_spaces}>
                                    Pesquisar
                            </Button>
                            <br/>
                            <Box
                                style={{
                                    marginTop:"30vh"
                                }}>
                                <Tooltip
                                    title="Escolher ficheiro para o contexto espacial">
                                    <IconButton
                                        style={{
                                            background: "rgba(3,137,173,255)",
                                        }}>
                                        <FindInPageIcon 
                                            style={{
                                                color: "rgba(256, 256, 256, 0.8)"
                                            }}/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </div>
                        <MapContainer 
                            style={{ 
                                margin: "auto",
                                position: "relative",
                                height: "100%",
                                borderRadius: "10px",
                                width:"60%",
                                float: "left"}}
                            center={position} 
                            zoom={7} 
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
                                        marker: false
                                    }}
                                    edit={{edit:false}}/>
                            </FeatureGroup>       
                            {new_space}
                        </MapContainer> 
                        <div
                            style={{ 
                                position: "fixed",  
                                margin: "auto",
                                width: "100%",
                                top: "90%",
                                zIndex: 400
                            }}>
                            <Tooltip
                                title="Cancelar">
                                <IconButton
                                    style={{
                                        background: "rgba(228,38,76,255)",
                                        marginLeft: "38%",
                                        height: "50px",
                                        width: "50px"
                                    }} 
                                    onClick={()=> {
                                        set_modal1(false)
                                    }}>
                                    <ClearIcon
                                        style={{
                                            color: "rgba(256, 256, 256, 0.9)"}}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title="Confirmar criação do documento">
                                <IconButton
                                    style={{
                                        background: "rgba(121,183,46,255)",
                                        left: "10%",
                                        height: "50px",
                                        width: "50px"
                                    }} 
                                    onClick={()=> {
                                        set_modal5(true)
                                    }}>
                                    <CheckIcon
                                        style={{
                                            color: "rgba(256, 256, 256, 1)"}}/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Box>
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
                        width: "40%",
                        background: "rgba(256, 256, 256, 0.9)",
                        border: '1px solid #000',
                        boxShadow: 24,
                        borderRadius: "10px",
                        textAlign: "center",
                        height: "25vh",
                        overflow: "auto"
                    }}>
                    <Box>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "90%",
                                marginTop: "3vh"
                            }}>
                            Pretende cancelar
                        </Typography>
                    </Box>
                    <div
                        style={{ 
                            position: "relative",
                            top: "20%",
                        }}>
                         <Tooltip
                            title="Cancelar">
                            <IconButton
                                style={{
                                    background: "rgba(228,38,76,255)",
                                    height: "60px",
                                    width: "60px"
                                }} 
                                onClick={()=> {
                                    navigate(`/`)
                                }}>
                                <ClearIcon
                                    style={{
                                        color: "rgba(256, 256, 256, 0.9)"}}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </Modal>
            <Modal
                keepMounted
                open={modal3}
                onClose={()=>{
                    set_modal3(false)
                }}>
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
                        textAlign: "left",
                        height: "40vh",
                        overflow: "auto"
                    }}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            position: "relative",
                            width: "100%",
                            marginTop: "2vh",
                        }}>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "65%",
                            }}>
                            Criar nova coleção
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            width: "100%",
                            height: "40px",
                            marginTop: "30px"
                        }}>
                        <TextField 
                            size="small"
                            required
                            style={{
                                width: "50%", 
                            }} 
                            label="Nome" 
                            onChange={(e)=>{
                                set_new_collection_name(e.target.value)
                            }}/>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            width: "100%",
                            marginTop: "20px"
                        }}>
                        <TextField 
                            style={{
                                width: "80%",
                            }}
                            id="descrption"
                            label="Descrição" 
                            variant="outlined" 
                            multiline
                            fullWidth
                            rows={4}
                            onChange={(e)=>set_new_collection_description(e.target.value)}
                            size="small"/>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            width: "100%",
                            marginTop: "20px"
                        }}>
                         <Button 
                            variant="contained" 
                            component="label" 
                            disabled={!new_collection_name}
                            onClick={()=>{
                                create_collection()
                            }}>
                            Criar coleção
                        </Button>
                    </Box>
                </div>
            </Modal>
            <Modal
                keepMounted
                open={modal4}
                onClose={()=>{
                    set_modal4(false)
                }}>
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
                        textAlign: "left",
                        height: "40vh",
                        overflow: "auto"
                    }}>
                    <Box>
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
                    </Box>
                    {!new_name &&
                        <Box>
                             <Typography 
                                variant="h6" 
                                style={{ 
                                    color: "rgba(0, 0, 0, 0.9)",
                                    margin:"auto",
                                    maxWidth: "90%",
                                    marginTop: "3vh"
                                }}>
                                Tem te introduzir um nome ao documento antes de prosseguir
                            </Typography>
                        </Box>
                    }
                    {!new_time &&
                        <Box>
                             <Typography 
                                variant="h6" 
                                style={{ 
                                    color: "rgba(0, 0, 0, 0.9)",
                                    margin:"auto",
                                    maxWidth: "90%",
                                    marginTop: "3vh"
                                }}>
                                Tem te dar um ano ao seu documento antes de prosseguir
                            </Typography>
                        </Box>
                    }
                    {files.length<1 &&
                        <Box>
                             <Typography 
                                variant="h6" 
                                style={{ 
                                    color: "rgba(0, 0, 0, 0.9)",
                                    margin:"auto",
                                    maxWidth: "90%",
                                    marginTop: "3vh"
                                }}>
                                Tem te fazer o upload de pelo menos 1 ficheiro antes de prosseguir
                            </Typography>
                        </Box>
                    }
                </div>
            </Modal>
            <Modal
                keepMounted
                open={modal5}
                onClose={()=>{
                    set_modal5(false)
                }}>
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
                        height: "25vh",
                        overflow: "auto"
                    }}>
                    <Box>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "90%",
                                marginTop: "3vh"
                            }}>
                            Criar documento
                        </Typography>
                    </Box>
                    <div
                        style={{ 
                            position: "relative",
                            top: "20%",
                        }}>
                        <Tooltip
                            title="Confirmar">
                            <IconButton
                                style={{
                                    background: "rgba(121,183,46,255)",
                                    height: "60px",
                                    width: "60px"
                                }} 
                                onClick={()=> {
                                    create_document()
                                }}>
                                <CheckIcon
                                    style={{
                                        color: "rgba(256, 256, 256, 1)"}}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </Modal>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                style={{
                    margin: "auto",
                    position: "relative",
                    border: "1px solid grey",
                    background: "rgba(256, 256, 256, 0.9)",
                    height: "8vh",
                    minHeight: "50px",
                    width:"120%",
                    left: "-10%",
                }}>  
                <Tooltip
                    title="Cancelar">
                    <IconButton
                        style={{
                            background: "rgba(228,38,76,255)",
                            marginLeft: "-8.3%",
                            height: "50px",
                            width: "50px"
                        }} 
                        onClick={()=> {
                            set_modal2(true)
                        }}>
                        <ClearIcon
                            style={{
                                color: "rgba(256, 256, 256, 0.9)"}}/>
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title="Concluir processo de adicionar documentos">
                    <IconButton
                        style={{
                            background: "rgba(121,183,46,255)",
                            left: "10%",
                            height: "50px",
                            width: "50px"
                        }} 
                        onClick={()=> {
                            if (new_name && new_time && files.length > 0)
                                set_modal1(true)
                            else 
                                set_modal4(true)
                        }}>
                        <CheckIcon
                            style={{
                                color: "rgba(256, 256, 256, 1)"}}/>
                    </IconButton>
                </Tooltip>
            </Box>
            <div 
                style={{ 
                    margin: "auto",
                    position: "relative",
                    background: "rgba(256, 256, 256, 0.9)",
                    height: "84vh",
                    width:"100%",
                    }}>
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        width:"25%",
                        float: "left",
                    }}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            position: "relative",
                            width: "100%",
                            top: "2vh",
                        }}>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "80%"
                            }}>
                            Adicionar ficheiros
                        </Typography>
                    </Box>
                    <Box 
                        style={{   
                            margin: "auto",
                            position: "relative",
                            paddingTop: "5vh",
                            }}>
                        <Button
                            variant="contained"
                            component="label"
                            style={{ 
                                margin:"auto",
                                width: "30%",
                            }}>
                            Upload
                            <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e)=> {
                                    let arr = [...files]
                                    for (let i = 0; i<e.target.files.length; i++) {
                                        let current = e.target.files[i]
                                        if (!arr.find(file=> file.name===current.name))
                                            arr.push(e.target.files[i])
                                    }
                                    set_files(arr)

                                    let selected_file = ""
                                    let file_type = ""
                                    loop:
                                    for (let i = 0; i<arr.length; i++) {
                                        let temp = arr[i].name.split(".")
                                        switch(temp[temp.length-1]) {
                                            case "shp":
                                                selected_file = arr[i]
                                                file_type = "vector"
                                                break loop
                                            case "tif":
                                                selected_file = arr[i]
                                                file_type = "raster"
                                                break
                                            default:
                                                break
                                        }
                                    }
                                    if (selected_file)
                                        auto_space(selected_file, file_type, arr)
                                }}/>
                        </Button>
                    </Box>
                    <List
                        style={{
                            top: "2.5vh",
                            overflow: "auto",
                            height: "67vh"
                        }}>
                        {files?.length && files.map((doc, index) => {
                            return(
                                <div 
                                    key={index}
                                    style={{
                                        height: "12vh",
                                        border: "1px solid grey",
                                    }}>
                                    <Box>
                                        <Typography 
                                            variant="h7" 
                                            style={{ 
                                                color: "rgba(0, 0, 0, 0.9)",
                                                maxWidth: "85%",
                                                float: "left",
                                                marginLeft: "2%",
                                                textAlign: "left"
                                            }}>
                                            {doc.name}
                                        </Typography>
                                        <Tooltip
                                            title="Remover ficheiro">
                                            <IconButton 
                                                edge="end" 
                                                aria-label="delete" 
                                                style={{
                                                    float: "right",
                                                    right: "6%"
                                                }}
                                                onClick={()=>{
                                                    let aux = [...files]
                                                    aux.splice(index, 1)
                                                    set_files(aux)
                                                }}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </div>
                            )
                        })}
                    </List>
                </div>
                <div
                    style={{
                        height: "100%",
                        width: "40%",
                        left: "2%",
                        position: "relative",
                        float: "left",
                        borderRadius: "5px",
                    }}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            position: "relative",
                            width: "100%",
                            marginTop: "2vh",
                        }}>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "65%"
                            }}>
                            Meta Informação
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            position: "relative",
                            width: "100%",
                            marginTop: "20px",
                        }}>
                        <FormControl 
                            sx={{ 
                                width: "60%",
                            }}>
                            <InputLabel>Tipo de documento</InputLabel>
                            <Select
                                size="small"
                                value={new_type}
                                label="Tipo de documento"
                                MenuProps={MenuProps}
                                onChange={(e)=>{
                                    set_new_type(e.target.value)
                                    setURL(e.target.value)
                                }}>
                                <MenuItem key="drawings" value="drawings">Desenho</MenuItem>
                                <MenuItem key="thematic_statistics" value="thematic_statistics">Estatísticas</MenuItem>
                                <MenuItem key="photography" value="photography">Fotografia</MenuItem>
                                <MenuItem key="aerial_photography" value="aerial_photography">Fotografia aérea</MenuItem>
                                <MenuItem key="satellite_image" value="satellite_image">Imagem satélite</MenuItem>
                                <MenuItem key="LiDAR" value="LiDAR">LiDAR</MenuItem>
                                <MenuItem key="geographic_map" value="geographic_map">Mapa de Base</MenuItem>
                                <MenuItem key="thematic_map" value="thematic_map">Mapa Temático</MenuItem>
                                <MenuItem key="ortos" value="ortos">Ortofotomapa</MenuItem>
                                <MenuItem key="generic" value="generic">Outro documento</MenuItem>
                                <MenuItem key="reports" value="reports">Relatório</MenuItem>
                                <MenuItem key="sensors" value="sensors">Sensores</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <>
                        {new_type==="thematic_map" &&
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allMapScale}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Escala" 
                                        onChange={(e)=>set_new_scale(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_scale(values)}
                                />
                                <FormControl
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}>
                                    <FormLabel 
                                        id="l"/>
                                    <RadioGroup
                                        style={{
                                            width: "40%",
                                            minWidth: "250px",
                                            background: "rgb(0,0,0, 0.4)",
                                            height: "40px",
                                            margin: "auto",
                                            textAlign: "center",
                                            display:"block",
                                            borderRadius: "5px"
                                        }}
                                        row
                                        aria-labelledby="l"
                                        defaultValue="1"
                                        name="radio-buttons-group">
                                        <FormControlLabel 
                                            value="1"
                                            control={<Radio />} 
                                            label="Raster" 
                                            onClick={(e)=>set_new_raster(true)}/>
                                        <FormControlLabel 
                                            value="2" 
                                            control={<Radio />} 
                                            label="Vetorial" 
                                            onClick={(e)=>set_new_raster(false)}/>
                                    </RadioGroup>
                                </FormControl> 
                                <Autocomplete
                                    freeSolo
                                    options={allMapImageResolution}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    disabled={!new_raster}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "40%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>set_new_res(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_res(values)}
                                /> 
                                <Autocomplete
                                    freeSolo
                                    options={allMapTheme}
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
                                        onChange={(e)=>set_new_theme(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_theme(values)}/>   
                                <Autocomplete
                                    freeSolo
                                    options={allMapType}
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
                                        onChange={(e)=>set_new_map_type(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_map_type(values)}/>   
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="thematic_statistics" &&
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <FormControl 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
                                    }}>
                                    <InputLabel>Tipo de estatística</InputLabel>
                                    <Select
                                        size="small"
                                        value={URLs}
                                        label="Tipo de documento"
                                        MenuProps={MenuProps}
                                        style={{
                                            width: "50%",
                                        }}
                                        onChange={(e)=>{
                                            setURL(e.target.value)
                                            console.log(e.target.value)
                                        }}
                                    >
                                        <MenuItem value="thematic_statistics">Estatística Temática</MenuItem>
                                        <MenuItem value="census">Censos</MenuItem>
                                        <MenuItem value="surveys">Inquérito</MenuItem>
                                    </Select>
                                </FormControl>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allStatisticsThemes}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField  
                                        label="Tema" 
                                        style={{
                                            width: "50%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>set_new_theme(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_theme(values)}/>    
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="sensors" &&
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allSensorsVariable}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Variável medida" 
                                        onChange={(e)=>set_new_variable(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_variable(values)}/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="satellite_image" &&
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allSatelliteResolution}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "40%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>set_new_res(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_res(values)}
                                /> 
                                <Autocomplete
                                    freeSolo
                                    options={allSatellite}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField  
                                        label="Nome do Satélite" 
                                        style={{
                                            width: "50%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>set_new_satellite(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_satellite(values)}
                                /> 
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="reports" &&
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allReportsContext}
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
                                        onChange={(e)=>set_new_context(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_context(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allReportsTheme}
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
                                        onChange={(e)=>set_new_theme(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_theme(values)}/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="photography" &&
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <br/>
                                <FormControlLabel 
                                    style={{
                                        width: "40%",
                                        minWidth: "250px",
                                        background: "rgb(0,0,0, 0.4)",
                                        height: "40px",
                                        margin: "auto",
                                        textAlign: "center",
                                        display:"block",
                                        borderRadius: "5px"
                                    }}
                                    control={<Switch
                                        checked={new_color}
                                        onChange={() => set_new_color(!new_color)}
                                        label="A cores"
                                        color="primary"
                                    />} label="Fotografia a cores" />
                                <Autocomplete
                                    freeSolo
                                    options={allPhotoImageResolution}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "40%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>set_new_res(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_res(values)}
                                />
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="ortos" &&
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allOrtosScale}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Escala" 
                                        onChange={(e)=>set_new_scale(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_scale(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allOrtosResolution}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução" 
                                        style={{
                                            width: "40%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>set_new_res(e.target.value)}
                                        size="small"
                                        disabled={!new_raster}
                                    />}
                                    onChange={(e, values)=>set_new_res(values)}/>
                                <TextField 
                                    id="descrption"
                                label="Descrição" 
                                variant="outlined" 
                                style={{
                                    width: "100%",
                                    height: "40px",
                                    top: "1vh"
                                }}
                                multiline
                                fullWidth
                                rows={4}
                                onChange={(e)=>set_new_desc(e.target.value)}
                                size="small"/>
                            </Box>
                        }

                        {new_type==="LiDAR" &&
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allLiDARResolution}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
                                    }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>set_new_res(e.target.value)}
                                        size="small"
                                        disabled={!new_raster}
                                    />}
                                    onChange={(e, values)=>set_new_res(values)}
                                /> 
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="generic" && 
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="aerial_photography" && 
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allAerialPhotoImageResolution}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "40%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>set_new_res(e.target.value)}
                                        size="small"
                                        disabled={!new_raster}
                                    />}
                                    onChange={(e, values)=>set_new_res(values)}/>   
                                <Autocomplete
                                    freeSolo
                                    options={allAerialPhotoScale}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Escala aproximada" 
                                        onChange={(e)=>set_new_scale(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_scale(values)}/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="geographic_map" && 
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <FormControl 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
                                    }}>
                                    <InputLabel>Tipo de mapa de base</InputLabel>
                                    <Select
                                        size="small"
                                        value={URLs}
                                        label="Tipo de mapa de base"
                                        MenuProps={MenuProps}
                                        style={{
                                            width: "50%",
                                        }}
                                        onChange={(e)=>{
                                            setURL(e.target.value)
                                        }}>
                                        <MenuItem value="geographic_map">Mapa Geográfico</MenuItem>
                                        <MenuItem value="chorographic_map">Mapa Corográfico</MenuItem>
                                        <MenuItem value="topographic_map">Mapa Topográfico</MenuItem>
                                        <MenuItem value="topographic_plan">Planta Topográfica</MenuItem>
                                    </Select>
                                </FormControl>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allMapScale}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Escala aproximada" 
                                        onChange={(e)=>set_new_scale(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_scale(values)}
                                />
                                <FormControl
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}>
                                    <FormLabel 
                                        id="l"/>
                                    <RadioGroup
                                        style={{
                                            width: "40%",
                                            minWidth: "250px",
                                            background: "rgb(0,0,0, 0.4)",
                                            height: "40px",
                                            margin: "auto",
                                            textAlign: "center",
                                            display:"block",
                                            borderRadius: "5px"
                                        }}
                                        row
                                        aria-labelledby="l"
                                        defaultValue="1"
                                        name="radio-buttons-group">
                                        <FormControlLabel 
                                            value="1"
                                            control={<Radio />} 
                                            label="Raster" 
                                            onClick={(e)=>set_new_raster(true)}/>
                                        <FormControlLabel 
                                            value="2" 
                                            control={<Radio />} 
                                            label="Vetorial" 
                                            onClick={(e)=>set_new_raster(false)}/>
                                    </RadioGroup>
                                </FormControl> 
                                <Autocomplete
                                    freeSolo
                                    options={allMapImageResolution}
                                    size="small"
                                    disabled={!new_raster}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>set_new_res(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_res(values)}
                                />     
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="drawings" &&
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "66vh",
                                    margin: "auto",
                                    overflow: "auto"
                                }}>
                                <Autocomplete
                                    freeSolo
                                    options={[]}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "2vh"
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
                                        onChange={(e)=>set_new_name(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>{
                                        set_new_name(values)
                                    }}/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
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
                                        onChange={(e)=>{
                                            set_new_provider(e.target.value)
                                        }}/>}
                                    onChange={(e, values)=>{
                                        set_new_provider(values)
                                    }}/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "30%", 
                                            float:"left",
                                        }} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>set_new_time(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
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
                                        label="URL" 
                                        onChange={(e)=>set_new_link(e.target.value)}/>}
                                    onChange={(e, values)=>set_new_link(values)}/>
                                <Autocomplete
                                    freeSolo
                                    options={allDrawingsContext}
                                    size="small"
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        marginTop: "1vh"
                                    }}
                                    renderInput={(params) => <TextField  
                                        label="Contexto" 
                                        style={{
                                            width: "50%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>set_new_context(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>set_new_context(values)}
                                />
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        top: "1vh"
                                    }}
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>set_new_desc(e.target.value)}
                                    size="small"/>
                            </Box>
                        }

                        {new_type==="none" && 
                            <Box
                                style={{
                                    position: "relative",
                                    width: "90%",
                                    top: "2vh",
                                    height: "52vh",
                                    margin: "auto",
                                    overflow: "auto",
                                    display: "block",
                                    textAlign: "center",
                                }}>
                                <Typography 
                                    variant="h5" 
                                    component="h2"
                                    color="black"
                                    style={{
                                        marginTop: "20vh"
                                    }}>
                                    Selecione um tipo de documento
                                </Typography>
                                <br/>
                            </Box>
                        }
                    </>
                </div>
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        width:"35%",
                        float: "left",
                        borderRadius: "5px"
                    }}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            position: "relative",
                            width: "100%",
                            marginTop: "2vh",
                        }}>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "65%",
                            }}>
                            Coleção
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            position: "relative",
                            width: "100%",
                            marginTop: "10px",
                        }}>
                        <Autocomplete
                            disablePortal
                            options={all_collections}
                            getOptionLabel={(option) => option[1]}
                            size="small"
                            style={{
                                width: "70%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                {...params} 
                                label="Coleção"/>}
                            onChange={(e, values)=>set_new_collection(values[0])}/>
                        <Tooltip
                            title="Criar nova coleção">
                            <IconButton
                                style={{
                                    background: "rgba(3,137,173,255)",
                                    left: "20px"
                                }} 
                                onClick={()=> {
                                    set_modal3(true)
                                }}>
                                <AddIcon
                                    style={{
                                        color: "rgba(256, 256, 256, 1)"}}/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            position: "relative",
                            width: "100%",
                            marginTop: "35vh",
                        }}>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "65%",
                            }}>
                            Keywords
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            position: "relative",
                            width: "100%",
                            marginTop: "5vh",
                        }}>
                        <Autocomplete
                            multiple
                            options={tags}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option[1]}
                            renderOption={(props, option, { selected }) => (
                            <li 
                                {...props}
                                key={option[0]}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}/>
                                {option[1]}
                            </li>
                            )}
                            style={{ width: "70%" }}
                            renderInput={(params) => (
                            <TextField 
                                {...params}
                                size="small" 
                                label="Keywords" 
                                placeholder="Selecione keywords"
                                onChange={(e)=> {
                                    console.log(e.target.value)
                                    set_tag_input(e.target.value)
                                }}/>
                            )}
                            onChange={(e, values)=>{
                                let ids = []
                                for (let i = 0; i<values.length; i++)
                                    ids.push(values[i][0])
                                
                                console.log(ids)

                                set_new_tags(ids)
                            }}
                        />
                        <Tooltip
                            title="Criar nova keyword">
                            <IconButton
                                style={{
                                    background: "rgba(3,137,173,255)",
                                    left: "20px"
                                }} 
                                onClick={()=> {
                                    add_tag()
                                }}>
                                <AddIcon
                                    style={{
                                        color: "rgba(256, 256, 256, 1)"}}/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </div>
            </div>
        </>

    );
}