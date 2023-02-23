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
import CircularProgress from '@mui/material/CircularProgress';
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
import UploadFileIcon from '@mui/icons-material/UploadFile';
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
    const [modal6, set_modal6]=React.useState(false);
    const [modal7, set_modal7]=React.useState(false);
    const [modal8, set_modal8]=React.useState(false);
    const [modal9, set_modal9]=React.useState(false);

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
        const start = async () => {
            let ignore = await check_token("R");
            if (ignore) {
                get_color()
                get_tags()
                get_collections()
                getAllAerialPhotoImageResolution()
                getAllAerialPhotoScale()
                getAllPhotoImageResolution()
                getAllDrawingsContext()
                getAllStatisticsThemes() 
                getAllSatelliteResolution()
                getAllSatellite()
                getAllLiDARResolution()
                getAllMapImageResolution()
                getAllMapScale()
                getAllMapGeometryType()
                getAllMapType()
                getAllMapTheme()
                getAllOrtosScale()
                getAllOrtosResolution()
                getAllReportsContext()
                getAllReportsTheme()
                getAllSensorsVariable()
                getAllProviders()
                getAllURLS()
                get_spatial_hierarchy_type()
            } else {
                window.localStorage.removeItem("token")
                navigate(`/login`)
            }
            return () => { ignore = true; }
        }
        start()
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

    function get_tags() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/keyword/get_all", {
            method: "POST",
            
        })
        .then(res=>res.json())
        .then(result=>{
            set_tags(result)
        })
    }

    function get_collections() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/collection/get_all", {
            method: "POST",
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/search_by_name", {
            method: "POST",
            
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

    function getAllPhotoImageResolution () {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/photography/get_image_resolution", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllPhotoImageResolution(result)
        })
    }

    function getAllAerialPhotoImageResolution () {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/aerial_photography/get_image_resolution", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllAerialPhotoImageResolution(result)
        })
    }

    function getAllAerialPhotoScale () {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/aerial_photography/get_scale", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllAerialPhotoScale(result)
        })
    }

    function getAllDrawingsContext() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/drawings/get_context", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllDrawingsContext(result)
        })
    }

    function getAllStatisticsThemes() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/thematic_statistics/get_themes", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllStatisticsThemes(result)
        })
    }

    function getAllSatelliteResolution() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/satellite_image/get_resolution", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllSatelliteResolution(result)
        })
    }

    function getAllSatellite() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/satellite_image/get_satellite", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllSatellite(result)
        })
    }

    function getAllLiDARResolution() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/LiDAR/get_resolution", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllLiDARResolution(result)
        })
    }

    function getAllMapImageResolution() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/geographic_map/get_image_resolution", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllMapImageResolution(result)
        })
    }

    function getAllMapScale() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/geographic_map/get_scale", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllMapScale(result)
        })
    }

    function getAllMapGeometryType() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/geographic_map/get_geometry_type", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllMapGeometryType(result)
        })
    }

    function getAllMapType() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/thematic_map/get_type", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllMapType(result)
        })
    }

    function getAllMapTheme() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/thematic_map/get_theme", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllMapTheme(result)
        })
    }

    function getAllOrtosScale() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/ortos/get_scale", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllOrtosScale(result)
        })
    }

    function getAllOrtosResolution() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/ortos/get_resolution", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllOrtosResolution(result)
        })
    }

    function getAllReportsContext() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/reports/get_context", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllReportsContext(result)
        })
    }

    function getAllReportsTheme() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/reports/get_theme", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllReportsTheme(result)
        })
    }

    function getAllSensorsVariable() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/sensors/get_variable", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllSensorsVariable(result)
        })
    }

    function getAllProviders() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_all_providers", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllProviders(result)
        })
        
    }
    
    function getAllURLS() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/get_all_urls", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllURLs(result)
        })
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

    function all_form_append() {
        let form = new FormData()
        form.append("name", new_name);
        form.append("description", new_desc);
        form.append("provider", new_provider);
        form.append("timeScope", new_time+"/01/01");
        form.append("link", new_link);

        switch(new_type) {
            case "aerial_photography": 
                form.append("resolution", new_res)
                form.append("scale", new_scale)
                break;
            case "geographic_map":
                form.append("scale", new_scale)
                form.append("resolution", new_res)
                form.append("type", new_type)
                form.append("raster", new_raster)
                break;
            case "drawings":
                form.append("context", new_context);
                break;
            case "LiDAR":
                form.append("resolution", new_res)
                break;
            case "ortos":
                form.append("resolution", new_res)
                form.append("scale", new_scale)
                break;
            case "photography":
                form.append("color", new_color);
                form.append("resolution", new_res)
                break;
            case "reports":
                form.append("context", new_context);
                form.append("theme", new_theme)
                break;
            case "satellite_image":
                form.append("resolution", new_res)
                form.append("satellite", new_satellite)
                break;
            case "sensors":
                form.append("variable", new_variable);
                break;
            case "thematic_statistics":
                form.append("theme", new_theme)
                break;
            case "thematic_map":
                form.append("scale", new_scale)
                form.append("resolution", new_res)
                form.append("type", new_type)
                form.append("raster", new_raster)
                form.append("theme", new_theme)
                form.append("mapType",new_map_type)
                break;
            default:
                break;
        }
        return form;
    }

    function add_tag() {
        let form = new FormData()

        form.append("keyword", tag_input)
        fetch("http://urbingeo.fa.ulisboa.pt:8080/keyword/add", {
            method: "POST",
            
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
        form.append("token", window.localStorage.getItem("token"))

        fetch("http://urbingeo.fa.ulisboa.pt:8080/collection/add", {
            method: "POST",
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            all_collections.push([result.id, result.name])
            set_modal3(false)
        })
    }

    async function auto_space(selected_file, file_type, files) {
        set_new_space(<></>)
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
        }

        if (file_type==="raster") {
            let resultRaster = await fetch("http://urbingeo.fa.ulisboa.pt:5050/transform/raster", {
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
            let resultBox = await fetch("http://urbingeo.fa.ulisboa.pt:5050/mbox", {
                method: "POST",
                body: form
            })

            resultBox = await resultBox.json();

            let parse = require('wellknown');
            setWKT(parse(polygonAux(resultBox.origin, resultBox.limit)))
                
            let resultVector = await fetch("http://urbingeo.fa.ulisboa.pt:5050/transform/vector", {
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

    async function auto_space2(selected_file, file_type, files, auto) {
        set_new_space(<></>)
        set_modal7(true)
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
        
        for (let temp of files) {
            if (selected_file!==temp)
                form.append('aux', temp);
        }

        if (file_type==="raster") {
            let resultRaster = await fetch("http://urbingeo.fa.ulisboa.pt:5050/transform/raster", {
                method: "POST",
                body: form
            })
            if (resultRaster.ok) {
                resultRaster = await resultRaster.json();

                let parse = require('wellknown');
                setWKT(parse(polygonAux(resultRaster.origin, resultRaster.limit)))

                set_new_space(
                    <GeoJSON data={parse(polygonAux(resultRaster.origin, resultRaster.limit))}>
                    </GeoJSON>
                )
                set_modal6(false)
            } else 
                set_modal8(true)
        } else {
            let resultBox = await fetch("http://urbingeo.fa.ulisboa.pt:5050/mbox", {
                method: "POST",
                body: form
            })
            if (resultBox.ok) {
                resultBox = await resultBox.json();

                let parse = require('wellknown');
                setWKT(parse(polygonAux(resultBox.origin, resultBox.limit)))
                    
                /*let resultVector = await fetch("http://urbingeo.fa.ulisboa.pt:5050/transform/vector", {
                    method: "POST",
                    body: form
                })

                resultVector = await resultVector.json();*/

                set_new_space(
                    <GeoJSON data={parse(polygonAux(resultBox.origin, resultBox.limit))}>
                    </GeoJSON>
                )
                set_modal6(false)
            } else 
            set_modal8(true)
        }
        set_modal7(false)
    }

    function remove_duplicates(arr) {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }

    async function create_document() {
        let form = all_form_append()
        form.append("token", window.localStorage.getItem("token"))
        set_modal7(true)
        
        let docId = await fetch("http://urbingeo.fa.ulisboa.pt:8080/"+ URLs +"/add_document", {
            method: "POST",
            body: form
        })
        if (docId.ok) {
            docId = await docId.json();
            console.log(docId)

            let es_form = all_form_append()
            es_form.append("id", docId)
            es_form.append("spatialName", spatial_query)
            es_form.append("timeScope", new_time)

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

            switch(typeof wkt) {
                case typeof 1:
                    console.log(wkt)
                    sform.append("id", wkt);
                    fetch("http://urbingeo.fa.ulisboa.pt:8080/space/attach", {
                        method: "POST",
                        
                        body: sform
                    })
                    break;
                case typeof "c":
                    if (lng > 1 || lat > 1 || size > 1) {
                        sform.append("lng", lng)
                        sform.append("lat", lat)
                        sform.append("size", size)
                        sform.append("name", spatial_query)
                        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/add_circle", {
                            method: "POST",
                            
                            body: sform
                        })
                    }
                    break;
                default:
                    console.log(wkt)
                    let wkttemp = JSON.stringify(wkt);
                    sform.append("name", spatial_query)
                    sform.append("space", wkttemp)
                    fetch("http://urbingeo.fa.ulisboa.pt:8080/space/add_Geo", {
                        method: "POST",
                        
                        body: sform
                    })
                    break;
            }

            if (new_tags.length>0) {
                let form_tags = new FormData();
                form_tags.append("keywords", new_tags)
                form_tags.append("document", docId)

                fetch("http://urbingeo.fa.ulisboa.pt:8080/keyword/document", {
                    method: "POST",
                    body: form_tags
                })
            }

            if (new_collection) {
                form = new FormData();
                form.append("collection", new_collection)
                form.append("document", docId)

                fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/add_collection", {
                    method: "POST",
                    body: form
                })
            }

            for (let j = 0; j<files.length; j++) {
                let fform = new FormData();
                fform.append("file", files[j])
                fform.append("document", docId)

                let fileres = await fetch("http://urbingeo.fa.ulisboa.pt:8080/file/add", {
                    method: "POST",
                    body: fform
                })

                fileres = await fileres.json()
            }
            navigate(`/document/${docId}`)
        }
        set_modal7(false)
        set_modal5(false)
        set_modal4(true)
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
                                        }}
                                        onClick={()=>{
                                            set_modal6(true)
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
            <Modal
                keepMounted
                open={modal6}
                onClose={()=>{
                    set_modal6(false)
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
                        height: "30vh",
                    }}>
                    <Box>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "70%",
                                marginTop: "3vh"
                            }}>
                            Selecione o ficheiro com o contexto espacial
                        </Typography>
                    </Box>
                    <Box 
                        style={{
                            marginTop: "25px"
                        }}>
                        <Autocomplete
                            disablePortal
                            options={files}
                            getOptionLabel={(option) => option.name}
                            size="small"
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "1vh"
                            }}
                            renderInput={(params) => <TextField 
                                style={{
                                    width: "70%"
                                }}
                                {...params} 
                                label="Ficheiros"/>}
                            onChange={(e, values)=>{
                                let temp = values.name.split(".")[values.name.split(".").length-1]
                                let file_type = ""
                                
                                if (temp==="jpg" || temp==="jpeg" || temp==="tif" || temp==="png" || temp==="asc") 
                                    file_type = "raster"
                                else
                                    file_type = "vector"
                                
                                auto_space2(values, file_type, files)
                            }}/>
                    </Box>
                    {/*
                    <Box 
                        style={{
                            marginTop: "10vh"
                        }}>
                        <Button
                            variant="contained" 
                            component="label" 
                            onClick={()=>{
                                let selected_file = ""
                                let file_type = ""
                                loop:
                                for (let i = 0; i<files.length; i++) {
                                    let temp = files[i].name.split(".")
                                    switch(temp[temp.length-1]) {
                                        case "shp":
                                            selected_file = files[i]
                                            file_type = "vector"
                                            break loop
                                        case "tif":
                                            selected_file = files[i]
                                            file_type = "raster"
                                            break
                                        default:
                                            break
                                    }
                                }
                                if (selected_file)
                                    auto_space2(selected_file, file_type, files)
                                else 
                                    set_modal9(true)
                            }}>
                            Selecionar ficheiro automáticamente
                        </Button>
                    </Box>*/}
                </div>
            </Modal>
            <Modal
                keepMounted
                open={modal7}>
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
                open={modal8}
                onClose={()=>{
                    set_modal8(false)
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
                    <Box>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "90%",
                                marginTop: "3vh"
                            }}>
                            Ficheiro selecionado não tem nenhum contexto espacial
                        </Typography>
                    </Box>
                </div>
            </Modal>
            <Modal
                keepMounted
                open={modal9}
                onClose={()=>{
                    set_modal9(false)
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
                    <Box>
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "90%",
                                marginTop: "3vh"
                            }}>
                            Não foi detetado nenhum ficheiro com contexto espacial
                        </Typography>
                    </Box>
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
                            else {
                                set_modal4(true)
                            }
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
                        height: "100%",
                        width: "30%",
                        position: "relative",
                        float: "left",
                        marginLeft:"2%",
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                                            width: "50%", 
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
                        width:"30%",
                        marginLeft:"3%",
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
                                    set_new_space(<></>)
                                    let arr = [...files]
                                    for (let i = 0; i<e.target.files.length; i++) {
                                        let current = e.target.files[i]
                                        if (!arr.find(file=> file.name===current.name))
                                            arr.push(e.target.files[i])
                                    }
                                    set_files(arr)
                                }}/>
                        </Button>
                    </Box>
                    <div 
                        style={{
                            position:"relative",
                            width:"100%",
                            height:"25px",
                            top: "10px"
                        }}>
                        <Typography
                            variant="h5" 
                            component="h2" 
                            color="rgba(0, 0, 0, 0.7)"
                            style={{ 
                                position: "relative",
                                margin:"auto",
                                maxWidth: "85%",
                                left: "50px",
                                float: "left"
                            }}>
                            {files.length} Ficheiros
                        </Typography>
                    </div>
                    <div
                        style={{
                            marginTop: "10px",
                            overflow: "auto",
                            height: "67vh"
                        }}>
                            
                        {files?.length && files.map((doc, index) => {
                            let temp_time = new Date(doc.lastModified).toString().split(" ")
                            temp_time = temp_time[2] + " " + temp_time[1]   + "," + temp_time[3]
                            
                            let temp_size = (doc.size / (1024*1024)).toFixed(2);
                            console.log(temp_size)
                            return(
                                <div
                                    key={index}
                                    style={{ 
                                        position: "relative",
                                        height: "175px", 
                                        width: "50%",
                                        top: "20px",
                                        float:"left",
                                    }}>
                                    <div
                                        style={{ 
                                            margin:"auto",
                                            position: "relative",
                                            height: "90%", 
                                            minHeight: "165px", 
                                            width: "170px",
                                            maxWidth: "80%",
                                            borderRadius: "10px",
                                            border: "3px solid grey",
                                        }}>
                                        <Typography
                                            variant="body2" 
                                            component="h2" 
                                            color="rgba(0, 0, 0, 0.9)"
                                            style={{ 
                                                position: "relative",
                                                margin:"auto",
                                                maxWidth: "90%",
                                                marginTop: "10%",
                                            }}>
                                            {doc.name}
                                        </Typography>
                                        <Typography
                                            variant="body1" 
                                            component="h2" 
                                            color="rgba(0, 0, 0, 0.5)"
                                            style={{ 
                                                position: "relative",
                                                margin:"auto",
                                                maxWidth: "85%",
                                                marginTop: "10px",
                                            }}>
                                            {temp_time}
                                        </Typography>
                                        <UploadFileIcon
                                            color= "action"
                                            fontSize="large"
                                            variant="contained" 
                                            style={{
                                                position: "relative",
                                                margin:"auto", 
                                                marginTop: "10px",
                                            }}/>
                                        <Typography
                                            variant="h6" 
                                            component="h2" 
                                            color="rgba(0, 0, 0, 0.9)"
                                            style={{ 
                                                position: "relative",
                                                margin:"auto",
                                                maxWidth: "85%",
                                                marginTop: "0px",
                                            }}>
                                            {temp_size} MB
                                        </Typography>
                                        <Tooltip
                                            title="Apagar ficheiro">
                                            <IconButton
                                                style={{
                                                    position: "absolute",
                                                    background: "rgba(228,38,76,255)",
                                                    left:"95%",
                                                    top: "-15px",
                                                    height: "30px",
                                                    width: "30px",
                                                }} 
                                                onClick={()=> {
                                                    set_new_space(<></>)

                                                    let arr = [...files]
                                                    arr.splice(index, 1)
                                                    set_files(arr)
                                                }}>
                                                <DeleteIcon
                                                    style={{
                                                        color: "rgba(256, 256, 256, 0.9)"}}/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        width:"35%",
                        float: "left",
                        borderRadius: "5px"
                    }}>
                    {/*<Box
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
                            onChange={(e, values)=>{
                                set_new_collection(values[0])
                            }}/>
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
                    </Box>*/}
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            position: "relative",
                            width: "100%",
                            marginTop: "30%",
                        }}>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "65%",
                            }}>
                            Keywords (Beta)
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