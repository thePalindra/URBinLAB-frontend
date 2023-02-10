import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip';
import Autocomplete from '@mui/material/Autocomplete';
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
    const position = [39.7, -10];
    const color_list = [
        "rgba(228,38,76,255)", 
        "rgba(121,183,46,255)", 
        "rgba(247,166,20,255)", 
        "rgba(3,137,173,255)"
    ]

    const [editable_FG, set_editable_FG] = React.useState(null);

    const [spatial_list, set_spatial_list]=React.useState(<></>);
    const [search, set_search]=React.useState(true);

    const [selected_hierarchy, set_selected_hierarchy]=React.useState("");
    const [selected_level, set_selected_level]=React.useState("");
    const [spatial_hierarchy, set_spatial_hierarchy]=React.useState([]);
    const [spatial_hierarchy_type, set_spatial_hierarchy_type]=React.useState([]);
    const [selected_spatial_hierarchy_type, set_selected_spactial_hierarchy_type]=React.useState([]);
    const [spatial_level, set_spatial_level]=React.useState([]);
    const [spatial_query, set_spatial_query] =React.useState("");
    const [all_spatial_names, set_all_spatial_names]=React.useState([]);
    
    const [layer_type, set_layer_type]=React.useState([]);
    const [space, set_space]=React.useState([]);
    const [default_space, set_default_space]=React.useState(false);
    const [color, set_color]=React.useState(false);
    

    React.useEffect(() => {
        const start = async () => {
            let ignore = await check_token("A");
            if (ignore) {
                    get_color()
                    get_spatial_hierarchy_type()
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

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        set_editable_FG(reactFGref);
    };

    const _created=e=> {
        set_spatial_list(<></>)
        set_default_space(false)
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
                set_space(circle(e))
                break;
            case "rectangle":
                set_space(polygon(e))
                break;
            case "marker":
                set_space(point(e))
                break;
            default:
                break;
        }
        set_search(false)
        set_layer_type(e.layerType)
    }

    const get_menu =()=>{
        if (!window.localStorage.getItem("token"))
            return (
                <div
                    style={{   
                        position: "relative",
                        margin: "auto",
                        float: "left",
                        width: "100%",
                        height: "100px",
                        borderRadius: "5px",
                        margintop: "400px",
                        marginTop: "20px",
                        textAlign: "center",
                        zIndex: 400, 
                    }}>
                    <Button 
                        style = {{
                            top: "20px",
                            zIndex: 400,    
                            height: "50px",
                            width: "200px",
                            float:"left",
                            left: "50px",
                            background: color
                        }}
                        variant="contained" 
                        onClick={()=> {
                            navigate(`/login`)
                        }}>
                            Login
                    </Button>
                    <Button 
                        style = {{
                            top: "20px",
                            zIndex: 400,  
                            height: "50px",
                            width: "200px",
                            float:"left",
                            left: "100px",
                            background: color
                        }}
                        variant="contained" 
                        onClick={()=> {
                            navigate(`/signup`)
                        }}>
                            Signup
                    </Button>
                </div>
            )
            return (
                <div
                    style={{   
                        position: "relative",
                        margin: "auto",
                        float: "left",
                        width: "100%",
                        height: "180px",
                        borderRadius: "5px",
                        margintop: "400px",
                        marginTop: "20px",
                        textAlign: "center", 
                    }}>
                    <Button 
                        style = {{
                            top: "20px",    
                            height: "50px",
                            width: "200px",
                            float:"left",
                            left: "50px",
                            background: color
                        }}
                        variant="contained" 
                        onClick={()=> {
                            navigate(`/new_document`)
                        }}>
                            Adicionar documento
                    </Button>
                    <Button 
                        style = {{
                            top: "20px", 
                            height: "50px",
                            width: "200px",
                            float:"left",
                            left: "100px",
                            background: color
                        }}
                        variant="contained" 
                        onClick={()=> {
                            navigate(`/profile/lists`)
                        }}>
                            Listas (Beta)
                    </Button>
                    <Button 
                        style = {{
                            top: "40px", 
                            height: "50px",
                            width: "200px",
                            float:"left",
                            left: "170px",
                            background: color
                        }}
                        variant="contained" 
                        onClick={()=> {
                            window.localStorage.removeItem("token")
                            if(window.location.pathname=="/")
                                window.location.reload(false);
                            else 
                                navigate(`/`)
                        }}>
                            Logout
                    </Button>
                </div>
            )
    }

    function get_color() {
        let res = Math.floor(Math.random() * color_list.length)
        if (color_list[res] === color)
            get_color()
        else
            set_color(color_list[res])
        console.log(color_list[res])
    }

    function get_document_by_space_geometry() {
        let form = new FormData();
        console.log(layer_type)
        console.log(space)

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
                    window.localStorage.setItem('results', JSON.stringify(result));
                    navigate(`/results`)

                });
                break;
        }
    }

    function get_spatial_hierarchy_type() {
        fetch("http://localhost:8080/space/get_hierarchy_type", {
            method: "POST",
            
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
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_all_spatial_names(result)
        })
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
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            let parse = require('wellknown');
            set_space(result[0][0])
                
            set_spatial_list(result.map(doc => (
                <GeoJSON key={doc[0]} data={parse(doc[1])}>
                </GeoJSON>
            )))
            set_default_space(true)
            set_search(false)
        })
    }

    function get_document_by_space_id() {
        let form = new FormData();
        form.append("space", space)

        fetch("http://localhost:8080/generic/get_by_space_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            window.localStorage.setItem('results', JSON.stringify(result));
            navigate(`/results`)
        })
    }

    return (
        <Box
            style={{ 
                margin: "auto",
                position: "relative",
                border: "1px solid grey",
                background: "rgba(256, 256, 256, 0.9)",
                height: "93%",
                width:"100%",}}>
            <MapContainer 
                style={{
                    position: 'relative',
                    width: "100%",
                    boxShadow: 24,
                    height: "99%",
                }} 
                center={position} 
                zoom={7} 
                scrollWheelZoom={true} 
                minZoom={4}>
                <Button 
                    variant="contained" 
                    disabled= {search}
                    onClick= {() => {
                        if(default_space) {
                            console.log(space)
                            get_document_by_space_id()
                        } else
                            get_document_by_space_geometry()
                    }}
                    style={{
                        zIndex: 400,    
                        top: "20px", 
                    }}>
                        Procurar aqui
                </Button>
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
                        onDeleted={()=>{
                            set_search(true)
                        }}
                        draw= {{
                            circlemarker: false,
                            polyline: false,
                            polygon: false
                        }}
                        edit={{edit:false}}/>
                </FeatureGroup>       
                {spatial_list}
            </MapContainer> 
            <div 
                style={{   
                    position: "absolute",
                    margin: "auto",
                    float: "left",
                    width: "30%",
                    minWidth: "550px",
                    left: "10px",
                    top: "-10px",
                    marginTop: "20px",
                    textAlign: "center",
                    zIndex: 400}}>
                <div
                    style={{
                        width: "66%",
                        float: "left",
                    }}>
                    <div 
                        style={{   
                            position: "relative",
                            margin: "auto",
                            float: "left",
                            width: "100%",
                            background: "rgba(256, 256, 256, 0.6)",
                            borderRadius: "5px",
                            top: "-20px",
                            marginTop: "20px",
                            textAlign: "center",
                            border: "1px solid grey",
                            zIndex: 400, 
                        }}>  
                        <Typography 
                            variant="h5" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "70%",
                                marginTop: "10px"
                            }}>
                            Pesquisar por contexto espacial
                        </Typography>
                        <Autocomplete
                            disablePortal
                            options={spatial_hierarchy_type}
                            size="small"
                            renderInput={(params) => <TextField 
                                style={{
                                    marginTop: "25px",
                                    zIndex: 400,    
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
                                    zIndex: 400,    
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
                                    zIndex: 400,    
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
                                    zIndex: 400,    
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
                                marginTop: "2vh",
                                zIndex: 400,    
                                background: color
                            }}
                            variant="contained" 
                            onClick={get_spaces}>
                                Procurar local
                        </Button>
                        <br/>
                        <br/>
                    </div>
                </div>
                <div 
                    style={{   
                        position: "relative",
                        margin: "auto",
                        float: "left",
                        background: "rgba(256, 256, 256, 0.6)",
                        width: "100%",
                        borderRadius: "5px",
                        marginTop: "100px",
                        textAlign: "center",
                        border: "1px solid grey",
                    }}>  
                    <Typography 
                        variant="h5" 
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            margin:"auto",
                            maxWidth: "70%",
                            marginTop: "10px"
                        }}>
                        Menu
                    </Typography>
                    {get_menu()}
                </div>
            </div>
        </Box>

    );
}
