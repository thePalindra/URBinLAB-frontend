import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Link } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup, useMap } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FormControlLabel from '@mui/material/FormControlLabel';
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import "leaflet-draw/dist/leaflet.draw.css"
import CheckIcon from '@mui/icons-material/Check';
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
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Select, { SelectChangeEvent } from '@mui/material/Select';


let lat = 0
let lng = 0
let size = 0

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function circle(e) {
    let result =  "c"
    
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
    return result;
}

export default function Default() {
    let navigate = useNavigate()
    const color_list = ["rgba(228,38,76,255)", "rgba(121,183,46,255)", "rgba(247,166,20,255)", "rgba(3,137,173,255)"]
    const [position, set_position]=React.useState([39.7, -14])
    const [zoom, set_zoom]=React.useState(7)
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
    const [modal2, set_modal2]=React.useState(false);
    const [modal3, set_modal3]=React.useState(false);
    const [color, set_color]=React.useState("")
    const [order, set_order]=React.useState("")
    const [favorite, set_favorite]=React.useState(false)
    const [new_list, set_new_list]=React.useState("")
    const [list, set_list]=React.useState([])
    const [selected, set_selected]=React.useState(0)
    const [all_lists, set_all_lists]=React.useState([])

    const [selected_hierarchy, set_selected_hierarchy]=React.useState("");
    const [selected_level, set_selected_level]=React.useState("");
    const [spatial_hierarchy, set_spatial_hierarchy]=React.useState([]);
    const [spatial_hierarchy_type, set_spatial_hierarchy_type]=React.useState([]);
    const [selected_spatial_hierarchy_type, set_selected_spactial_hierarchy_type]=React.useState([]);
    const [spatial_level, set_spatial_level]=React.useState([]);
    const [spatial_query, set_spatial_query] =React.useState("");
    const [all_spatial_names, set_all_spatial_names]=React.useState([]);

    const [menu, set_menu]=React.useState(0)
    const [layer_type, set_layer_type]=React.useState("")
    const [default_space, set_default_space]=React.useState(false);

    const [ready_to_space, set_ready_to_space]=React.useState(false);
    const [space, set_space]=React.useState(false);


    React.useEffect(() => {
        const start = async () => {
            let ignore = await check_token("A");
            if (ignore) {
                get_all_documents()
                get_all_tags()
                get_color()
                get_all_lists()
                get_spatial_hierarchy_type()
                
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
    
    const _created=e=> {
        set_spatial_list(<></>)
        set_menu(2)
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
                set_space(circle(e))
                break;
            case "rectangle":
                set_space(polygon(e))
                break;
            case "marker":
                set_space(point(e))
                break;
            case "polygon":
                set_space(polygon(e))
                break;
            default:
                break;
        }
        set_default_space(false)
        set_layer_type(e.layerType)
        set_ready_to_space(true)
    }

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        set_editable_fg(reactFGref);
    };

    const get_spaces =()=> {
        const drawnItems = editable_fg._layers;
        if (Object.keys(drawnItems).length > 0) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editable_fg.removeLayer(layer);
            });
        }

        let form = new FormData();
        form.append("name", spatial_query)
        form.append("level", selected_level)
        form.append("hierarchy", selected_hierarchy)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/search_by_name", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)

            let temp_zoom = zoom_setter(result[0][4])
            
            let temp_pos = result[0][3].replace('POINT(', '').replace(')', '').split(" ").reverse()
            temp_pos[1] = temp_pos[1] - temp_zoom[1]
            set_position(temp_pos)
            set_zoom(temp_zoom[0])
            let parse = require('wellknown');
            set_spatial_list(result.map(doc => (
                <GeoJSON key={doc[0]} data={parse(doc[1])}>
                </GeoJSON>
            )))

            form = new FormData();
            form.append("list", JSON.parse(window.localStorage.getItem('results')))
            form.append("space", result[0][0])
            fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_by_space_id_list", {
            method: "POST",
            
            body: form
            })
            .then(res=>res.json())
            .then(result=>{
                set_documents(result)
                group_providers(result)
                group_archivists(result)
                group_years(result)
                group_types(result)
            })
        })
    }

    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }

    function get_spatial_hierarchy_type() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/get_hierarchy_type", {
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
        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/get_hierarchy", {
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/get_levels", {
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/get_names", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_all_spatial_names(result)
        })
    }

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

    async function get_all_documents() {
        let form = new FormData()
        form.append("list", JSON.parse(window.localStorage.getItem('results')))
        const response = await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/from_list", {
            method: "POST",
            
            body: form
        })
        const js = await response.json();

        set_documents(js)
        get_all_names(js)
        set_selected_years([])
        group_providers(js)
        group_archivists(js)
        group_years(js)
        group_types(js)

    }

    /*
        Atualizado para as tags refletirem sobre os resultados
    */
    function get_all_tags() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/keyword/group", {
            method: "POST",
        })
        .then(res=>res.json())
        .then(result=>{
        });
    }

    function group_providers(temp_doc) {
        let form = new FormData()
        form.append("list", get_all_ids(temp_doc))
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/group_provider_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_providers(result)
        });
    }

    function group_years(temp_doc) {
        let form = new FormData()
        form.append("list", get_all_ids(temp_doc))
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/group_year_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_years(result)
        });
    }

    function group_types(temp_doc) {
        let form = new FormData()
        form.append("list", get_all_ids(temp_doc))
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/group_type_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_types(result)
        });
    }

    function group_archivists(temp_doc) {
        let form = new FormData()
        form.append("list", get_all_ids(temp_doc))
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/group_archivist_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_archivists(result)
        });
    }

    function get_document_by_name() {
        let form = new FormData()
        form.append("list", get_all_ids())
        form.append("name", search)
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_by_name_in_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log("by name")
            set_documents(result)
            get_all_names(result)
        });
    }

    function get_all_lists() {
        let form = new FormData()
        form.append("token", window.localStorage.getItem("token"))

        fetch("http://urbingeo.fa.ulisboa.pt:8080/lists/get_all", {
            method: "POST",
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_all_lists(result)
        });
    }

    function add_list() {
        let form = new FormData()
        form.append("name", new_list)
        form.append("token", window.localStorage.getItem("token"))

        fetch("http://urbingeo.fa.ulisboa.pt:8080/lists/add", {
            method: "POST",
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            let temp = [...all_lists]
            temp.push([result.id, result.name])
            set_all_lists(temp)
        });
    }

    function add_to_lists() {
        if(favorite) {
            let form = new FormData()
            form.append("doc", selected)
            form.append("token", window.localStorage.getItem("token"))

            fetch("http://urbingeo.fa.ulisboa.pt:8080/lists/add_to_fav", {
                method: "POST",
                body: form
            })
        }
        for(let i = 0; i<list.length; i++) {
            let form = new FormData()
            form.append("doc", selected)
            form.append("list", list[i])
            fetch("http://urbingeo.fa.ulisboa.pt:8080/lists/add_to_list", {
                method: "POST",
                body: form
            })
        }
    }

    function get_order(url) {
        let temp = []
        for (let i = 0; i<documents.length; i++)
            temp.push(documents[i][0])

        let form = new FormData()
        form.append("list", temp)
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/" + url, {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log("order")
            set_documents(result)
        });
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

    function get_space_from_document(id) {
        set_spatial_list(<></>)
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
            temp_pos[1] = temp_pos[1] - temp_zoom[1]
            console.log(temp_pos)
            set_position(temp_pos)
            set_zoom(temp_zoom[0])
            let parse = require('wellknown');
            set_spatial_list(
                <>
                    <GeoJSON key={1} data={parse(result[0][0])}>
                    </GeoJSON>
                </>
            )
        })
    }

    function get_document_by_space_id() {
        let form = new FormData();
        form.append("space", space)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_by_space_id", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            window.localStorage.setItem('results', JSON.stringify(result));
            navigate(`/results`)
        })
    }

    function get_document_by_space_geometry() {

        let form = new FormData();
        form.append("list", JSON.parse(window.localStorage.getItem('results')))

        switch(layer_type) {
            case "circle":
                form.append("lng", lng)
                form.append("lat", lat)
                form.append("size", size)

                fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_document_by_space_circle_list", {
                    method: "POST",
                    
                    body: form
                })
                .then(res=>res.json())
                .then(result=>{
                    set_documents(result)
                    group_providers(result)
                    group_archivists(result)
                    group_years(result)
                    group_types(result)
                });
                break;
            case "marker":
                form.append("space", space);
                
                fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_document_by_space_marker_list", {
                    method: "POST",
                    
                    body: form
                })
                .then(res=>res.json())
                .then(result=>{
                    set_documents(result)
                    group_providers(result)
                    group_archivists(result)
                    group_years(result)
                    group_types(result)
                });
                break;
            default:
                form.append("space", space);
                console.log(space)
                fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_document_by_space_geometry_list", {
                    method: "POST",
                    
                    body: form
                })
                .then(res=>res.json())
                .then(result=>{
                    set_documents(result)
                    group_providers(result)
                    group_archivists(result)
                    group_years(result)
                    group_types(result)
                });
                break;
        }
    }

    function get_all_ids(temp_doc) {
        let temp = []
        for (let i = 0; i<temp_doc.length; i++)
            temp.push(temp_doc[i][0])

        return temp
    }
    
    function filter(years_temp, providers_temp, archivers_temp, types_temp) {
        let form = new FormData()
        let temp = get_all_ids(documents)
        console.log(documents)

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
        form.append("list", temp)
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/filter_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_documents(result)
            get_all_names(result)
            group_providers(result)
            group_archivists(result)
            group_years(result)
            group_types(result)
        });
    }

    function get_type(type) {
        switch(type) {
            case "AERIAL PHOTOS":
                return "Fotografia aérea"
                break
            case "LiDAR":
                return "LiDAR"
                break
            case "ORTOS":
                return "Ortofotomapa"
                break
            case "SATELLITE IMAGE":
                return "Imagem satélite"
                break
            case "CHOROGRAPHIC MAP":
                return "Carta corográfica"
                break
            case "TOPOGRAPHIC MAP":
                return "Carta topográfica"
                break
            case "GEOGRAPHIC MAP":
                return "Carta geográfica"
                break
            case "TOPOGRAPHIC PLAN":
                return "Plano topográfico"
                break
            case "THEMATIC MAP":
                return "Carta temática"
                break
            case "DRAWINGS":
                return "Desenhos"
                break
            case "PHOTOS":
                return "Fotografia"
                break
            case "REPORTS":
                return "Relatório"
                break
            case "SENSORS":
                return "Dados de sensores"
                break
            case "CENSUS":
                return "Censos"
                break
            case "SURVEYS":
                return "Estatística de formulário"
                break
            case "THEMATIC STATISTICS":
                return "Estatística temática"
                break
            default:
                return "Documento"
                break
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
                                    if (doc[0]!=="")
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
                                    let temp_type = get_type(doc[0])
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
                                                label={temp_type + " (" + doc[1] + ")"}
                                            />
                                        </div>
                                    )
                                })}
                            </FormGroup>
                        </FormControl>
                </div>
            </Modal>
            <Modal
                keepMounted
                open={modal2}
                onClose={()=>{
                    set_modal2(false)
                    set_selected(0)
                    set_favorite(false)
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
                        height: "330px",
                    }}>
                    <Box>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "90%",
                                marginTop: "40px"
                            }}>
                            Adicionar a uma lista (Beta)
                        </Typography>
                    </Box>
                    <div
                        style={{ 
                            position: "relative",
                            marginTop: "2vh",
                        }}>
                        <Typography 
                            variant="h5" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                float:"left",
                                marginLeft:"50px"
                            }}>
                            Favoritos 
                                <Checkbox
                                    checked={favorite}
                                    onClick={()=>{
                                        set_favorite(!favorite)
                                    }}/>
                        </Typography>
                    </div>
                    <div
                        style={{ 
                            position: "relative",
                            marginTop: "100px",
                            textAlign: "center",
                            display: "flex",
                            left: "25%"
                        }}>
                        <Autocomplete
                            multiple
                            options={all_lists}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option[1]}
                            renderOption={(props, option, { sel }) => (
                            <li 
                                {...props}
                                key={option[0]}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={sel}/>
                                {option[1]}
                            </li>
                            )}
                            style={{ width: "50%" }}
                            renderInput={(params) => (
                            <TextField 
                                {...params}
                                size="small" 
                                label="Listas" 
                                placeholder="Selecione as listas"
                                onChange={(e)=> {
                                    set_new_list(e.target.value)
                                }}/>
                            )}
                            onChange={(e, values)=>{
                                let ids = []
                                for (let i = 0; i<values.length; i++)
                                    ids.push(values[i][0])

                                set_list(ids)
                            }}
                        />
                        {/*<Tooltip
                            title="Criar nova lista">
                            <IconButton
                                style={{
                                    background: "rgba(3,137,173,255)",
                                    left: "20px"
                                }} 
                                onClick={()=> {
                                    add_list()
                                }}>
                                <AddIcon
                                    style={{
                                        color: "rgba(256, 256, 256, 1)"}}/>
                            </IconButton>
                                    </Tooltip>*/}
                    </div>
                    <div
                        style={{ 
                            position: "relative",
                            top: "10%",
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
                                    add_to_lists()
                                    set_modal2(false)
                                    set_favorite(false)
                                }}>
                                <CheckIcon
                                    style={{
                                        color: "rgba(256, 256, 256, 1)"}}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </Modal>
            {/*<div 
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
            </div>*/}
            <div 
                style={{ 
                    margin: "auto",
                    position: "relative",
                    background: "rgba(256, 256, 256, 0.90)",
                    height: "92%",
                    width:"100%"}}>
                <MapContainer 
                    style={{
                        position: 'relative',
                        width: "100%",
                        boxShadow: 24,
                        height: "100%",
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
                <div 
                    style={{   
                        position: "absolute",
                        margin: "auto",
                        float: "left",
                        width: "45%",
                        height: "95%",
                        left: "10px",
                        top: "10px",
                        textAlign: "center",
                        zIndex: 400}}>
                    <div 
                        style={{   
                            position: "relative",
                            margin: "auto",
                            float: "left",
                            width: "50%",
                            height: "35%",
                            maxHeight: "230px",
                            background: "rgba(256, 256, 256, 0.85)",
                            borderRadius: "5px",
                            top: "-20px",
                            marginTop: "20px",
                            textAlign: "center",
                        }}> 
                        <div
                            style={{
                                width: "100%"
                            }}>
                            <FormControl 
                                style={{
                                    marginTop: "20px",
                                    width:"60%"
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
                        <div
                            style={{
                                width: "100%"
                            }}>
                            <Tooltip 
                                title="Filtrar resultados">
                                <Button 
                                    variant="filled" 
                                    style={{ 
                                        background: color,
                                        marginTop: "25px"
                                    }} 
                                    onClick={()=> {
                                        if (menu == 1)
                                            set_menu(0)
                                        else 
                                            set_menu(1)
                                    }}
                                    startIcon={<FilterListIcon />}>
                                    Filtros (Beta)
                                </Button>
                            </Tooltip>
                        </div>
                        <div
                            style={{
                                width: "100%"
                            }}>
                            <Tooltip 
                                title="Filtros espaciais">
                                <Button 
                                    variant="filled" 
                                    style={{ 
                                        background: color,
                                        marginTop: "25px"
                                    }} 
                                    onClick={()=> {
                                        if (menu == 2)
                                            set_menu(0)
                                        else 
                                            set_menu(2)
                                    }}
                                    startIcon={<TravelExploreIcon />}>
                                    Procura espacial
                                </Button>
                            </Tooltip>
                        </div>
                    </div>   
                    {menu==1 &&
                        <div
                            style={{   
                                position: "relative",
                                margin: "auto",
                                float: "left",
                                width: "50%",
                                height: "35%",
                                maxHeight: "230px",
                                top: "-20px",
                                marginTop: "20px",
                                textAlign: "center",
                                zIndex: 400, 
                            }}>
                            <div 
                                style={{   
                                    position: "absolute",
                                    margin: "auto",
                                    float: "left",
                                    width: "100%",
                                    height: "100%",
                                    background: "rgba(256, 256, 256, 0.85)",
                                    borderRadius: "5px",
                                    top: "-20px",
                                    marginTop: "20px",
                                }}>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        overflow: "auto"
                                    }}>
                                    <Typography 
                                        variant="h5" 
                                        style={{ 
                                            color: "rgba(0, 0, 0, 0.8)",
                                            margin:"auto",
                                            marginTop: "10px"
                                        }}>
                                        Filtros (Beta)
                                    </Typography>
                                    <div 
                                        style={{
                                            position: "relative",   
                                            marginTop: "10px",
                                            width: "100%",
                                        }}
                                        component="fieldset" 
                                        variant="standard">
                                        <Typography 
                                            style={{
                                                marginLeft:"10px",
                                                float: "left",
                                                color: "black"
                                            }}
                                            component="legend">
                                            Ano:
                                        </Typography>
                                        <FormGroup 
                                            style={{
                                                width: "100%",
                                                color: "grey"
                                            }}>                                
                                            {years?.length>0 && years.map((doc, index)=> {
                                                return (
                                                    <div
                                                        key={index}>
                                                        <FormControlLabel
                                                            style={{
                                                                float: "left",
                                                                color: "grey",
                                                                marginLeft: "10px"
                                                            }}
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
                                    </div>
                                    <div 
                                        style={{
                                            position: "relative",   
                                            marginTop: "10px",
                                            width: "100%",
                                        }}
                                        component="fieldset" 
                                        variant="standard">
                                        <Typography 
                                            style={{
                                                float: "left",
                                                marginLeft:"10px",
                                                color: "black"
                                            }}>
                                            Fornecedor:</Typography>
                                        <FormGroup 
                                            style={{
                                                width: "100%",
                                                color: "grey"
                                            }}>                                   
                                            {providers?.length>0 && providers.map((doc, index)=> {
                                                if (doc[0]!=="")
                                                    return (
                                                        <div
                                                            key={index}>
                                                            <FormControlLabel
                                                                style={{
                                                                    float: "left",
                                                                    color: "grey",
                                                                    marginLeft: "10px"
                                                                }}
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
                                    </div>
                                    <div 
                                        style={{
                                            position: "relative",   
                                            marginTop: "10px",
                                            width: "100%",
                                        }}
                                        component="fieldset" 
                                        variant="standard">
                                        <Typography 
                                            style={{
                                                marginLeft:"10px",
                                                float: "left",
                                                color: "black"
                                            }}>
                                            Arquivista:</Typography>
                                        <FormGroup 
                                            style={{
                                                width: "100%",
                                                color: "grey"
                                            }}>                                 
                                            {archivists?.length>0 && archivists.map((doc, index)=> {
                                                return (
                                                    <div
                                                        key={index}>
                                                        <FormControlLabel
                                                            style={{
                                                                float: "left",
                                                                color: "grey",
                                                                marginLeft: "10px"
                                                            }}
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
                                    </div>
                                    <div 
                                        style={{
                                            position: "relative",   
                                            marginTop: "10px",
                                            width: "100%",
                                        }}
                                        component="fieldset" 
                                        variant="standard">
                                        <Typography 
                                            style={{
                                                marginLeft:"10px",
                                                float: "left",
                                                color: "black"
                                            }}>
                                            Tipos de Documento:</Typography>
                                        <FormGroup 
                                            style={{
                                                width: "100%",
                                                color: "grey"
                                            }}>                                
                                            {types?.length>0 && types.map((doc, index)=> {
                                                let temp_type = get_type(doc[0])
                                                return (
                                                    <div
                                                        key={index}>
                                                        <FormControlLabel
                                                            style={{
                                                                float: "left",
                                                                color: "grey",
                                                                marginLeft: "10px"
                                                            }}
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
                                                            label={temp_type + " (" + doc[1] + ")"}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </FormGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {menu==2 && 
                        <div
                            style={{   
                                position: "relative",
                                margin: "auto",
                                float: "left",
                                width: "50%",
                                height: "35%",
                                maxHeight: "230px",
                                top: "-20px",
                                marginTop: "20px",
                                textAlign: "center",
                                zIndex: 400, 
                            }}>
                            <div 
                                style={{   
                                    position: "absolute",
                                    margin: "auto",
                                    float: "left",
                                    width: "100%",
                                    height: "100%",
                                    background: "rgba(256, 256, 256, 0.85)",
                                    borderRadius: "5px",
                                    top: "-20px",
                                    marginTop: "20px",
                                    zIndex: 400, 
                                }}>
                                <div
                                    style={{   
                                        position: "relative",
                                        margin: "auto",
                                        float: "left",
                                        width: "100%",
                                    }}>
                                    <Typography 
                                        variant="h5" 
                                        style={{ 
                                            color: "rgba(0, 0, 0, 0.8)",
                                            margin:"auto",
                                        }}>
                                        Contexto espacial
                                    </Typography>
                                </div>
                                <div
                                    style={{   
                                        position: "relative",
                                        margin: "auto",
                                        float: "left",
                                        width: "70%",
                                        height: "85%",
                                    }}>
                                    <Autocomplete
                                        disablePortal
                                        options={spatial_hierarchy_type}
                                        size="small"
                                        renderInput={(params) => <TextField 
                                            style={{
                                                marginTop: "10px",
                                                marginLeft: "10px",
                                                float: "left",
                                                zIndex: 400,    
                                                width: "90%"
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
                                                marginTop: "5px",
                                                marginLeft: "10px",
                                                float: "left",
                                                zIndex: 400,    
                                                width: "90%"
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
                                                marginTop: "5px",
                                                zIndex: 400,
                                                marginLeft: "10px",
                                                float: "left",    
                                                width: "90%"
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
                                                marginTop: "5px",                                
                                                zIndex: 400,
                                                marginLeft: "10px",
                                                float: "left",    
                                                width: "90%"
                                            }} 
                                            {...params} 
                                            label={selected_level.charAt(0).toUpperCase() + selected_level.slice(1)}
                                            />
                                        }
                                        onChange={(e, values)=>{
                                            if (values) {
                                                set_spatial_query(values)
                                                set_default_space(true)
                                            }

                                        }}/>
                                </div>
                                <div
                                    style={{   
                                        position: "relative",
                                        margin: "auto",
                                        float: "left",
                                        width: "30%",
                                        height: "85%",
                                    }}>
                                    <Tooltip
                                        title="Procurar Local">
                                        <IconButton
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                background: "rgba(3,137,173,255)",
                                                top: "35%",
                                                margin: "auto"
                                            }} 
                                            onClick={()=> {
                                                set_menu(1)
                                                if (default_space)
                                                    get_spaces()
                                                else
                                                    get_document_by_space_geometry()
                                            }}>
                                            <TravelExploreIcon
                                                style={{
                                                    color: "rgba(256, 256, 256, 1)"}}/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div> 
                        </div> 
                    }       
                    <div
                        style={{
                            position: "relative",
                            float: "left",
                            height: "65%",
                            width: "100%",
                            top: "-1%",
                            background: "rgba(256, 256, 256, 0.85)",
                            borderRadius: "10px",
                        }}>
                        <div
                            style={{
                                margin: "auto",
                                position: "relative",
                                height: "20%",
                                width: "100%",
                            }}>
                            <div
                                style= {{
                                    position: "relative",
                                    margin: "auto",
                                    float: "top",
                                    width: "100%",
                                }}>
                                <Typography 
                                    variant="h5" 
                                    style={{ 
                                        top: "5px",
                                        color: "rgba(0, 0, 0, 0.7)",
                                        margin:"auto",
                                        position: "relative",
                                    }}>
                                    {documents.length} Resultados
                                </Typography>
                            </div>
                            <div
                                style={{
                                    margin: "auto",
                                    position: "relative",
                                    marginTop: "10px",
                                    width: "100%",
                                }}>
                                <Tooltip 
                                    title="Procurar por nome">
                                    <Autocomplete
                                        style={{
                                            position: "relative",
                                            margin: "auto",
                                            float: "left",
                                            marginLeft: "22.5%",
                                            width: "45%",
                                        }}
                                        freeSolo
                                        fullWidth
                                        options={all_name}
                                        size="small"
                                        renderInput={(params) => 
                                        <TextField 
                                            style={{
                                                width: "100%",
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
                                    title="Limpar filtros">
                                    <IconButton 
                                        style={{ 
                                            position: "relative",
                                            float: "left",
                                            borderRadius: "5px",
                                            background: 'rgba(0, 0, 0, 0.26)',
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
                            </div>
                        </div>
                        <div
                            style={{
                                position: "relative",
                                margin: "auto",
                                marginTop: "0px",
                                width: "100%",
                                height: "80%",
                                overflow: "auto",}}>
                            {documents?.length>0 && documents.map((doc, index) => {
                                let temp_type = get_type(doc[2])
                                return(
                                    <div 
                                        key={index} 
                                        style={{
                                            position: "relative",
                                            marginTop: "15px",
                                            height: "50%", 
                                            minHeight: "190px", 
                                            width: "33%", 
                                            float: "left",}}>
                                        <div
                                            style={{ 
                                                margin:"auto",
                                                position: "relative",
                                                minHeight: "190px", 
                                                height: "100%",
                                                width: "90%",
                                                borderRadius: "10px",
                                                border: "3px solid grey",
                                            }}>
                                            <Tooltip 
                                                title="nome">
                                                <Typography
                                                    variant="body1" 
                                                    component="h2" 
                                                    color="rgba(0, 0, 0, 0.9)"
                                                    style={{ 
                                                        position: "relative",
                                                        margin:"auto",
                                                        maxWidth: "90%",
                                                    }}>
                                                    {doc[4]}
                                                </Typography>
                                            </Tooltip>
                                            <Tooltip 
                                                    title="Tipo de documento">
                                                <Typography
                                                    variant="body2" 
                                                    component="h2" 
                                                    color="rgba(0, 0, 0, 0.5)"
                                                    style={{ 
                                                        position: "relative",
                                                        margin:"auto",
                                                        maxWidth: "85%",
                                                        marginTop: "5px",
                                                    }}>
                                                    {temp_type}
                                                </Typography>
                                            </Tooltip>
                                            <Tooltip 
                                                    title="Ir para a página do documento">
                                                <Button 
                                                    variant="contained" 
                                                    onClick={()=>{
                                                        navigate(`/document/${doc[0]}`)
                                                    }}
                                                    style={{
                                                        position: "relative",
                                                        margin:"auto",
                                                        marginTop: "5px",
                                                    }}>
                                                        Visitar página
                                                </Button>
                                            </Tooltip>
                                            <Tooltip 
                                                    title="Contexto temporal">
                                                <Typography
                                                    variant="body1" 
                                                    component="h2" 
                                                    color="rgba(0, 0, 0, 0.9)"
                                                    style={{ 
                                                        position: "relative",
                                                        margin:"auto",
                                                        maxWidth: "85%",
                                                        marginTop: "10px",
                                                    }}>
                                                    {doc[5]}
                                                </Typography>
                                            </Tooltip>
                                            <Tooltip 
                                                title="Adicionar a uma lista (Beta)">
                                                <IconButton
                                                    style={{ 
                                                        background: color_list[3],
                                                        position: "relative",
                                                        margin: "auto",
                                                        left:"-20px"
                                                    }}
                                                    onClick={()=>{
                                                        set_selected(doc[0])
                                                        set_modal2(true)
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
                                                        left:"20px"
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}