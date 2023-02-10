import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Link } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FormControlLabel from '@mui/material/FormControlLabel';
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import "leaflet-draw/dist/leaflet.draw.css"
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Select, { SelectChangeEvent } from '@mui/material/Select';


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
    let navigate = useNavigate()
    const position = [38, -17.7];
    const color_list = ["rgba(228,38,76,255)", "rgba(121,183,46,255)", "rgba(247,166,20,255)", "rgba(3,137,173,255)"]
    const [spatial_list, set_spatial_list]=React.useState(<></>);
    const [editable_fg, set_editable_fg]=React.useState(null);
    const [tags, set_tags]=React.useState([]);
    const [documents, set_documents]=React.useState([]);
    const [years, set_years]=React.useState("")
    const [types, set_types]=React.useState("")
    const [all_name, set_all_name]=React.useState([]);
    const [search, set_search]=React.useState("")
    const [archivists, set_archivists]=React.useState([])
    const [selected_years, set_selected_years]=React.useState([])
    const [selected_providers, set_selected_providers]=React.useState([])
    const [selected_archivers, set_selected_archivers]=React.useState([])
    const [selected_types, set_selected_types]=React.useState([])
    const [providers, set_providers]=React.useState("")
    const [modal1, set_modal1]=React.useState(false);
    const [color, set_color]=React.useState("")
    const [order, set_order]=React.useState("")

    React.useEffect(() => {
        const start = async () => {
            let ignore = await check_token("A");
            if (ignore) {
                get_all_documents()
                get_all_tags()
                get_color()
                group_providers()
                group_years()
                group_types()
                group_archivists()
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
        let res = await fetch("http://localhost:8080/token/check", {
            method: "POST",
            body: form
        })

        return res.ok
    }
    
    const _created=e=> {
        set_spatial_list(<></>)
        const drawnItems = editable_fg._layers;
        if (Object.keys(drawnItems).length > 1) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editable_fg.removeLayer(layer);
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
        get_document_by_space_geometry(e.layerType)
    }

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        set_editable_fg(reactFGref);
    };

    function get_all_names(js) {
        let temp = []
        for (let i = 0; i<js.length; i++) 
            temp.push(js[i][4])
        set_all_name(Array.from(new Set(temp)).sort())
    }

    function get_color() {
        let res = Math.floor(Math.random() * color_list.length)
        if (color_list[res] === color)
            get_color()
        else
            set_color(color_list[res])
    }

    function get_all_documents() {
        let form = new FormData()
        form.append("limit", 1*100)
        fetch("http://localhost:8080/generic/all", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_documents(result)
            get_all_names(result)
        });
    }

    function get_all_tags() {
        fetch("http://localhost:8080/keyword/group", {
            method: "POST",
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
        });
    }

    function group_providers() {
        fetch("http://localhost:8080/generic/group_provider", {
            method: "POST",
        })
        .then(res=>res.json())
        .then(result=>{
            set_providers(result)
        });
    }

    function group_years() {
        fetch("http://localhost:8080/generic/group_year", {
            method: "POST",
            
        })
        .then(res=>res.json())
        .then(result=>{
            set_years(result)
        });
    }

    function group_types() {
        fetch("http://localhost:8080/generic/group_type", {
            method: "POST",
            
        })
        .then(res=>res.json())
        .then(result=>{
            set_types(result)
        });
    }

    function group_archivists() {
        fetch("http://localhost:8080/generic/group_archivist", {
            method: "POST",
            
        })
        .then(res=>res.json())
        .then(result=>{
            set_archivists(result)
        });
    }

    function get_document_by_name() {
        let form = new FormData()
        form.append("name", search)
        fetch("http://localhost:8080/generic/name", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_documents(result)
            get_all_names(result)
        });
    }

    function get_order(url) {
        let temp = []
        for (let i = 0; i<documents.length; i++)
            temp.push(documents[i][0])

        let form = new FormData()
        form.append("list", temp)
        fetch("http://localhost:8080/generic/" + url, {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_documents(result)
            console.log(result)
        });
    }

    function get_space_from_document(id) {
        set_spatial_list(<></>)
        let form = new FormData();
        form.append("id", id)

        fetch("http://localhost:8080/generic/get_space", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            let parse = require('wellknown');
            set_spatial_list(
                <>
                    <GeoJSON key={1} data={parse(result[0][0])}>
                    </GeoJSON>
                </>
            )
        })
    }

    function get_document_by_space_geometry(layer_type) {
        let form = new FormData();
        form.append("page", 0);

        switch(layer_type) {
            case "circle":
                form.append("lng", lng)
                form.append("lat", lat)
                form.append("size", size)

                fetch("http://localhost:8080/generic/get_document_by_space_circle", {
                    method: "POST",
                    
                    body: form
                })
                .then(res=>res.json())
                .then(result=>{
                    window.localStorage.setItem('results', JSON.stringify(result));
                    navigate(`/results`)
                });
                break;
            case "marker":
                form.append("space", space);
                
                fetch("http://localhost:8080/generic/get_document_by_space_marker", {
                    method: "POST",
                    
                    body: form
                })
                .then(res=>res.json())
                .then(result=>{
                    let temp = []
                    for (let i = 0; i<result.length; i++)
                        temp.push(result[i][0])
                    window.localStorage.setItem('results', JSON.stringify(temp));
                    navigate(`/results`)
                });
                break;
            default:
                form.append("space", space);
                
                fetch("http://localhost:8080/generic/get_document_by_space_geometry", {
                    method: "POST",
                    
                    body: form
                })
                .then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    window.localStorage.setItem('results', JSON.stringify(result));
                    navigate(`/results`)
                });
                break;
        }
    }
    
    function filter(years_temp, providers_temp, archivers_temp, types_temp) {
        let form = new FormData()

        if (years_temp.length == 0) {
            for (let i = 0; i<years.length; i++)
                years_temp.push(years[i][0])
            set_selected_years([])
        } else
            set_selected_years(years_temp)
        
        if (providers_temp.length == 0) {
            for (let i = 0; i<providers.length; i++)
                providers_temp.push(providers[i][0])
            set_selected_providers([])
        } else
            set_selected_providers(providers_temp)

        if (archivers_temp.length == 0) {
            for (let i = 0; i<archivists.length; i++)
                archivers_temp.push(archivists[i][1])
            set_selected_archivers([])
        } else
            set_selected_archivers(archivers_temp)

        if (types_temp.length == 0) {
            for (let i = 0; i<types.length; i++)
                types_temp.push(types[i][0])
            set_selected_types([])
        } else
            set_selected_types(types_temp)

        form.append("years", years_temp)
        form.append("providers", providers_temp)
        form.append("archivers", archivers_temp)
        form.append("types", types_temp)
        fetch("http://localhost:8080/generic/filter", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result);
            set_documents(result)
            get_all_names(result)
        });
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
                        width: "20%",
                        background: "rgba(256, 256, 256, 0.9)",
                        border: '1px solid #000',
                        boxShadow: 24,
                        borderRadius: "10px",
                        textAlign: "left",
                        maxHeight: "60vh",
                        overflow: "auto"
                    }}>
                        <br/>
                        <FormControl 
                            style={{
                                marginLeft:"20px"
                            }}
                            component="fieldset" 
                            variant="standard">
                            <FormLabel 
                                style={{
                                    color: "black"
                                }}
                                component="legend">
                                Ano:</FormLabel>
                            <FormGroup 
                                style={{
                                    float:"left",
                                    marginLeft:"20px",
                                    color: "grey"
                                }}>                                
                                {years?.length>0 && years.map((doc, index)=> {
                                    return (
                                        <div
                                            key={index}>
                                            <FormControlLabel
                                                control={
                                                <Checkbox 
                                                    onChange={(e)=> {
                                                        let temp=[...selected_years]
                                                        if (temp.includes(doc[0])) 
                                                            temp.splice(selected_years.indexOf(doc[0]), 1);
                                                        else 
                                                            temp.push(doc[0])

                                                        filter(temp, selected_providers, selected_archivers, selected_types)
                                                }}/>
                                                }
                                                label={doc[0] + " (" + doc[1] + ")"}
                                            />
                                        </div>
                                    )
                                })}
                            </FormGroup>
                        </FormControl>
                        <br/>
                        <br/>
                        <FormControl 
                            style={{
                                marginLeft:"20px"
                            }}
                            component="fieldset" 
                            variant="standard">
                            <FormLabel 
                                component="legend"
                                style={{
                                    color: "black"
                                }}>
                                Fornecedor:</FormLabel>
                            <FormGroup 
                                style={{
                                    float:"left",
                                    marginLeft:"20px",
                                    color: "grey"
                                }}>                                 
                                {providers?.length>0 && providers.map((doc, index)=> {
                                    return (
                                        <div
                                            key={index}>
                                            <FormControlLabel
                                                control={
                                                <Checkbox 
                                                    onChange={(e)=> {
                                                        let temp=[...selected_providers]
                                                        if (temp.includes(doc[0])) 
                                                            temp.splice(selected_providers.indexOf(doc[0]), 1);
                                                        else 
                                                            temp.push(doc[0])

                                                        filter(selected_years, temp, selected_archivers, selected_types)
                                                }}/>
                                                }
                                                label={doc[0] + " (" + doc[1] + ")"}
                                            />
                                        </div>
                                    )
                                })}
                            </FormGroup>
                        </FormControl>
                        <br/>
                        <br/>
                        <FormControl 
                            style={{
                                marginLeft:"20px"
                            }}
                            component="fieldset" 
                            variant="standard">
                            <FormLabel 
                                component="legend"
                                style={{
                                    color: "black"
                                }}>
                                Arquivista:</FormLabel>
                            <FormGroup 
                                style={{
                                    float:"left",
                                    marginLeft:"20px",
                                    color: "grey"
                                }}>                                
                                {archivists?.length>0 && archivists.map((doc, index)=> {
                                    return (
                                        <div
                                            key={index}>
                                            <FormControlLabel
                                                control={
                                                <Checkbox 
                                                    onChange={(e)=> {
                                                        let temp=[...selected_archivers]
                                                        if (temp.includes(doc[1])) 
                                                            temp.splice(selected_archivers.indexOf(doc[1]), 1);
                                                        else 
                                                            temp.push(doc[1])

                                                        filter(selected_years, selected_providers, temp, selected_types)
                                                }}/>
                                                }
                                                label={doc[0] + " (" + doc[2] + ")"}
                                            />
                                        </div>
                                    )
                                })}
                            </FormGroup>
                        </FormControl>
                        <br/>
                        <br/>
                        <FormControl 
                            style={{
                                marginLeft:"20px"
                            }}
                            component="fieldset" 
                            variant="standard">
                            <FormLabel 
                                component="legend"
                                style={{
                                    color: "black"
                                }}>
                                Tipos de Documento:</FormLabel>
                            <FormGroup 
                                style={{
                                    float:"left",
                                    marginLeft:"20px",
                                    color: "grey"
                                }}>                                 
                                {types?.length>0 && types.map((doc, index)=> {
                                    return (
                                        <div
                                            key={index}>
                                            <FormControlLabel
                                                control={
                                                <Checkbox 
                                                    onChange={(e)=> {
                                                        let temp=[...selected_types]
                                                        if (temp.includes(doc[0])) 
                                                            temp.splice(selected_types.indexOf(doc[0]), 1);
                                                        else 
                                                            temp.push(doc[0])

                                                        filter(selected_years, selected_providers, selected_archivers, temp)
                                                }}/>
                                                }
                                                label={doc[0] + " (" + doc[1] + ")"}
                                            />
                                        </div>
                                    )
                                })}
                            </FormGroup>
                        </FormControl>
                </div>
            </Modal>
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
                                <FormControlLabel 
                                    control={
                                        <Checkbox 
                                            style={{
                                                marginLeft: "50px"
                                            }}/>
                                    } 
                                    label={
                                        <Typography 
                                            variant="h6" 
                                            style={{ 
                                                color: "rgba(256, 256, 256, 0.9)",
                                            }}>
                                                {doc[0]} ({doc[1]})
                                        </Typography>
                                    }/>
                                )
                            }) 
                        }
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
                        title="Filtrar resultados">
                        <Button 
                            variant="filled" 
                            style={{
                                left:"2%", 
                                background: color,
                            }} 
                            onClick={()=> {
                                set_modal1(true)
                            }}
                            startIcon={<FilterListIcon />}>
                            Filtros
                        </Button>
                    </Tooltip>
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
                        <div
                            style={{
                                width:"100%",
                                height:"8vh"
                            }}>
                            <Typography
                                variant="h7" 
                                component="h2" 
                                color="rgba(0, 0, 0, 0.5)"
                                style={{
                                    float:"left",
                                    margin: "15px",
                                    marginLeft: "25px"
                                }}>
                                {documents.length} Resultados
                            </Typography>
                            <FormControl 
                                style={{
                                    left: "18%",
                                    top: "2vh",
                                    width:"30%"
                                }}
                                fullWidth>
                                <InputLabel>Ordenar</InputLabel>
                                <Select
                                    value={order}
                                    size="small"
                                    label="Ordenar"
                                    onChange={(event: SelectChangeEvent)=>{
                                        set_order(event.target.value)
                                        get_order(event.target.value)
                                    }}>
                                    <MenuItem value={"year_asc"}>Ano (crescente)</MenuItem>
                                    <MenuItem value={"year_desc"}>Ano (decrescente)</MenuItem>
                                    <MenuItem value={"name_asc"}>Alfabética (crescente)</MenuItem>
                                    <MenuItem value={"name_desc"}>Alfabética (decrescente)</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <Box
                            display="flex"
                            alignItems="center"
                            style={{
                                margin: "auto",
                                position: "relative",
                                width: "100%"
                            }}>
                            <Tooltip 
                                title="Procurar por nome">
                                <Autocomplete
                                    freeSolo
                                    fullWidth
                                    options={all_name}
                                    size="small"
                                    renderInput={(params) => 
                                    <TextField 
                                        style={{
                                            width: "65%",
                                        }}
                                        {...params} 
                                        label="Nome" 
                                        variant="outlined" 
                                        size="small"
                                        onKeyPress={(ev) => {
                                            if (ev.key === 'Enter') {
                                                get_document_by_name()
                                                ev.preventDefault();
                                            }
                                        }}
                                        onChange={(e)=>{
                                            set_search(e.target.value)
                                        }}
                                    />}
                                    onChange={(e, values)=>{
                                        set_search(values)
                                    }}/>
                            </Tooltip>
                            <Tooltip 
                                title="Limpar procura">
                                    <IconButton 
                                        style={{ 
                                            position: "relative",
                                            borderRadius: "5px",
                                            background: 'rgba(0, 0, 0, 0.26)',
                                            left: "-16%"
                                        }}
                                        onClick={()=> {
                                            window.location.reload(false);
                                        }}>
                                        <DeleteIcon 
                                            style={{
                                                color:"rgba(254,254,255,255)"
                                            }}/>
                                    </IconButton>
                            </Tooltip>
                        </Box>
                        <List
                            style={{
                                marginTop: "1vh",
                                height: "71vh",
                                overflow: "auto"
                            }}>
                            {documents?.length>0 && documents.map((doc, index) => {
                                return(
                                    <div 
                                        key={index} 
                                        style={{
                                            margin: "auto",
                                            height: "12vh", 
                                            border: "1px solid grey",}}>
                                        <IconButton
                                            style={{
                                                float:"left",
                                                margin: "15px",
                                                marginLeft: "25px"
                                            }}
                                            onClick={()=> {
                                                navigate(`/document/${doc[0]}`)
                                            }}>
                                            <Typography
                                                variant="h6" 
                                                component="h2" 
                                                color="rgba(0, 0, 0, 0.9)">
                                                {doc[4]}
                                            </Typography>
                                        </IconButton>
                                        <div
                                            style={{ 
                                                marginLeft: "75%",
                                                marginTop: "10px"
                                            }}>
                                            <Tooltip 
                                                title="Adicionar a uma lista">
                                                <IconButton
                                                    style={{ 
                                                        background: color_list[3],
                                                    }}>
                                                    <AddIcon
                                                        style={{
                                                            color:"rgba(254,254,255,255)"
                                                        }}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip 
                                                title="Visualizar contexto espacial">
                                                <IconButton 
                                                    style={{ 
                                                        background: color_list[0],
                                                        left:"7%"
                                                    }}
                                                    onClick={()=>{
                                                        get_space_from_document(doc[0])
                                                    }}>
                                                    <VisibilityIcon 
                                                        style={{
                                                            color:"rgba(254,254,255,255)"
                                                        }}/>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                )
                            })}
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
                    {spatial_list}
                </MapContainer> 
            </div>
        </>
    );
}