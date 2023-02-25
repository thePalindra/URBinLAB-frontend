import React from "react";
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckIcon from '@mui/icons-material/Check';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import { Container } from '@mui/material';
import Switch from '@mui/material/Switch';
import RadioGroup from '@mui/material/RadioGroup';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import JSZip from "jszip";
import L from "leaflet"
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup, useMap } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

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
    let { id } = useParams();
    const [position, set_position]=React.useState([39.7, -14])
    const [zoom, set_zoom]=React.useState(7)
    const [space, set_space]=React.useState(<></>)
    const [tags, set_tags]=React.useState([]);
    const [document, set_document]=React.useState([])
    const [collection, set_collection]=React.useState([])
    const [archiver, set_archiver]=React.useState([])
    const [type_translation, set_type_translation]=React.useState([])
    const [specifics, set_specifics]=React.useState(<></>)
    const [files, set_files]=React.useState([])
    const [new_files, set_new_files]=React.useState([]);
    const [modal1, set_modal1]=React.useState(false);
    const [modal2, set_modal2]=React.useState(false);
    const [modal3, set_modal3]=React.useState(false);
    const [modal4, set_modal4]=React.useState(false);
    const [modal5, set_modal5]=React.useState(false);
    const [modal6, set_modal6]=React.useState(false);
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


    React.useEffect(() => {
        const start = async () => {
            let ignore = await check_token("A");
            if (ignore) {
                get_space()
                get_document()
                get_files()
                get_spatial_hierarchy_type()
                let ignore2 = await check_token("R");
                    if (ignore2) 
                        add_to_historic()
                    
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

    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }

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

    const return_spaces =()=> {
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

    function add_to_historic() {
        let form = new FormData();
        form.append("id", id)
        form.append("token", window.localStorage.getItem("token"))

        fetch("http://urbingeo.fa.ulisboa.pt:8080/lists/add_to_historic", {
            method: "POST",
            body: form
        })

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
        })
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
            temp_pos[1] = temp_pos[1] - temp_zoom[1]
            console.log(temp_pos)
            set_position(temp_pos)
            set_zoom(temp_zoom[0])
            
            let parse = require('wellknown');
            console.log(result)
            
            setWKT(result[0][2])
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
            set_collection(result[0][1])
            
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
            console.log(result)
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/thematic_statistics/get_by_id", {
            method: "POST",
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/aerial_photography/get_by_id", {
            method: "POST",
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/LiDAR/get_by_id", {
            method: "POST",
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/ortos/get_by_id", {
            method: "POST",
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/satellite_image/get_by_id", {
            method: "POST",
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/thematic_map/get_by_id", {
            method: "POST",
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/drawings/get_by_id", {
            method: "POST",
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/photography/get_by_id", {
            method: "POST",
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/reports/get_by_id", {
            method: "POST",
            
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

        fetch("http://urbingeo.fa.ulisboa.pt:8080/sensors/get_by_id", {
            method: "POST",
            
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

    function get_spatial_hierarchy_type() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/get_hierarchy_type", {
            method: "POST",
            
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            set_spatial_hierarchy_type(result)
            console.log(result)
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

    function delete_document() {
        let form = new FormData();
        form.append("id", id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/delete", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            navigate(`/`)    
        })
    }

    function add_file(e) {
        let arr = [...new_files]
        for (let i = 0; i<e.target.files.length; i++) {
            let current = e.target.files[i]
            if (!arr.find(file=> file.name===current.name))
                arr.push(e.target.files[i])
        }
        set_new_files(arr)
        console.log(arr)
    }

    function remove_file(file_id) {
        let form = new FormData();
        form.append("id", file_id)

        fetch("http://urbingeo.fa.ulisboa.pt:8080/file/delete", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            
        })
    }

    async function download_files() {
        set_modal6(true)
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
        set_modal6(false)
    }

    async function upload_new_files() {
        for (let j = 0; j<new_files.length; j++) {
            let contains = false

            for (let i = 0; i<files.length; i++) 
                if (new_files[j].name===files[i][1])
                    contains = true
            
            console.log(contains)
            if (!contains) {
                let form = new FormData();
                form.append("file", new_files[j])
                form.append("document", id)

                let file_res = await fetch("http://urbingeo.fa.ulisboa.pt:8080/file/add", {
                    method: "POST",
                    
                    body: form
                })

                file_res = await file_res.json()
            }
        }
        set_modal2(false)
        get_files()
    }

    function update_space() {
        let sform = new FormData();
        sform.append("document", id)
        switch(typeof wkt) {
            case typeof 1:
                sform.append("id", wkt);
                fetch("http://urbingeo.fa.ulisboa.pt:8080/space/attach", {
                    method: "POST",
                    
                    body: sform
                })
                .then(res=>res.json())
                .then(result=>{
                    set_modal3(false)
                    get_space()
                })
                break;
            case typeof "c":
                console.log("default")
                sform.append("lng", lng)
                sform.append("lat", lat)
                sform.append("size", size)
                sform.append("name", document[4])
                fetch("http://urbingeo.fa.ulisboa.pt:8080/space/add_circle", {
                    method: "POST",
                    
                    body: sform
                })
                .then(res=>res.json())
                .then(result=>{
                    set_modal3(false)
                    get_space()
                })
                break;
            default:
                console.log(wkt)
                let wkttemp = JSON.stringify(wkt);
                sform.append("name", document[4])
                sform.append("space", wkttemp)
                fetch("http://urbingeo.fa.ulisboa.pt:8080/space/add_Geo", {
                    method: "POST",
                    
                    body: sform
                })
                .then(res=>res.json())
                .then(result=>{
                    set_modal3(false)
                    get_space()
                })
                break;
        }
    }

    function allFormAppend() {
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
                form.append("mapType", new_map_type)
                break;
            default:
                break;
        }
        return form;
    }

    async function update_document() {
        let form = allFormAppend()
        form.append("token", window.localStorage.getItem("token"))
        
        let docId = await fetch("http://urbingeo.fa.ulisboa.pt:8080/"+ URLs +"/add_document", {
            method: "POST",
            
            body: form
        })
        docId = await docId.json();

        let sform = new FormData();
        sform.append("document", docId);
        sform.append("id", wkt);
        fetch("http://urbingeo.fa.ulisboa.pt:8080/space/attach", {
            method: "POST",
            
            body: sform
        })

        for (let i = 0; i<files.length; i++){
            let fform = new FormData();
            fform.append("document", docId);
            fform.append("id", files[i][0]);
            await fetch("http://urbingeo.fa.ulisboa.pt:8080/file/update", {
                method: "POST",
                
                body: fform
            })
        }

        form = new FormData();
        form.append("id", id)

        await fetch("http://urbingeo.fa.ulisboa.pt:8080/generic/delete", {
            method: "POST",
            
            body: form
        })

        navigate(`/document/${docId}`)        
        window.location.reload(false);       
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
                        width: "40%",
                        background: "rgba(256, 256, 256, 0.9)",
                        border: '1px solid #000',
                        boxShadow: 24,
                        borderRadius: "10px",
                        textAlign: "left",
                        height: "80vh",
                        overflow: "auto"
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
                                maxWidth: "65%"
                            }}>
                            Editar documento
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        style={{
                            position: "relative",
                            width: "100%",
                            marginTop: "6vh",
                        }}>
                        <Tooltip
                            title="Apagar documento">
                            <IconButton
                                style={{
                                    background: "rgba(228,38,76,255)",
                                    float:"left",
                                    marginLeft: "5%"
                                }}
                                onClick={()=>{
                                    delete_document()
                                }}>
                                <DeleteIcon
                                    style={{
                                        color: "rgba(256, 256, 256, 0.9)"}}/>
                            </IconButton>
                        </Tooltip>
                        <FormControl 
                            sx={{ 
                                width: "60%",
                                left: '10%',
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    height: "52vh",
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
                                    variant="h4" 
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
                                    height: "6vh",
                                    width: "6vh"
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
                            title="Confirmar nova meta informção">
                            <IconButton
                                style={{
                                    background: "rgba(121,183,46,255)",
                                    left: "10%",
                                    height: "6vh",
                                    width: "6vh"
                                }} 
                                onClick={()=> {
                                    update_document()
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
                        textAlign: "left",
                        height: "80vh",
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
                                maxWidth: "65%"
                            }}>
                            Adicionar ficheiros
                        </Typography>
                    </Box>
                    <Box style={{   
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
                                left: "35%"
                            }}>
                            Upload
                            <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e)=> {
                                    add_file(e);
                                }}/>
                        </Button>
                        <div 
                            style={{   
                                margin: "auto",
                                width: "100%",
                                borderRadius: "20px",
                                marginTop: "3vh"
                            }}>
                            <div
                                style={{
                                    marginTop: "10px",
                                    overflow: "auto",
                                    height: "500px"
                                }}>
                                {new_files?.length && new_files.map((doc, index) => {
                                    let temp_time = new Date(doc.lastModified).toString().split(" ")
                                    temp_time = temp_time[2] + " " + temp_time[1]   + "," + temp_time[3]
                                    
                                    let temp_size = (doc.size / (1024*1024)).toFixed(2);
                                    console.log(temp_size)
                                    return(
                                        <div
                                            key={index}
                                            style={{ 
                                                position: "relative",
                                                height: "260px", 
                                                width: "50%",
                                                top: "20px",
                                                float:"left",
                                            }}>
                                            <div
                                                style={{ 
                                                    margin:"auto",
                                                    position: "relative",
                                                    height: "90%", 
                                                    width: "70%",
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
                                                        marginTop: "20px",
                                                    }}/>
                                                <Typography
                                                    variant="h6" 
                                                    component="h2" 
                                                    color="rgba(0, 0, 0, 0.9)"
                                                    style={{ 
                                                        position: "relative",
                                                        margin:"auto",
                                                        maxWidth: "85%",
                                                        marginTop: "20px",
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
                                                            let aux = [...files]
                                                            aux.splice(index, 1)
                                                            set_files(aux)
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
                                margin: "auto",
                                width: "100%",
                                marginTop: "2vh"}}>
                            <Tooltip
                                title="Cancelar">
                                <IconButton
                                    style={{
                                        background: "rgba(228,38,76,255)",
                                        marginLeft: "38%",
                                        height: "6vh",
                                        width: "6vh"
                                    }} 
                                    onClick={()=> {
                                        set_modal2(false)
                                    }}>
                                    <ClearIcon
                                        style={{
                                            color: "rgba(256, 256, 256, 0.9)"}}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title="Confirmar upload">
                                <IconButton
                                    style={{
                                        background: "rgba(121,183,46,255)",
                                        left: "10%",
                                        height: "6vh",
                                        width: "6vh"
                                    }} 
                                    onClick={()=> {
                                        upload_new_files()
                                    }}>
                                    <UploadIcon
                                        style={{
                                            color: "rgba(256, 256, 256, 0.9)"}}/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Box>
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
                                onClick={return_spaces}>
                                    Pesquisar
                            </Button>
                            <br/>
                            <Box
                                style={{
                                    marginTop:"30vh"
                                }}>
                                <Tooltip
                                    title="Selecionar contexto espacial escolhendo um ficheiro">
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
                                        polyline: false
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
                                        height: "6vh",
                                        width: "6vh"
                                    }} 
                                    onClick={()=> {
                                        set_modal3(false)
                                        set_new_space(<></>)
                                        const drawnItems = editable_FG._layers;
                                        if (Object.keys(drawnItems).length == 1) {
                                            Object.keys(drawnItems).forEach((layerid, index) => {
                                                if (index > 0) return;
                                                const layer = drawnItems[layerid];
                                                editable_FG.removeLayer(layer);
                                            });
                                        }
                                    }}>
                                    <ClearIcon
                                        style={{
                                            color: "rgba(256, 256, 256, 0.9)"}}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title="Confirmar novo contexto espacial">
                                <IconButton
                                    style={{
                                        background: "rgba(121,183,46,255)",
                                        left: "10%",
                                        height: "6vh",
                                        width: "6vh"
                                    }} 
                                    onClick={()=> {
                                        update_space()
                                        set_new_space(<></>)
                                        const drawnItems = editable_FG._layers;
                                        if (Object.keys(drawnItems).length == 1) {
                                            Object.keys(drawnItems).forEach((layerid, index) => {
                                                if (index > 0) return;
                                                const layer = drawnItems[layerid];
                                                editable_FG.removeLayer(layer);
                                            });
                                        }
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
                        width: "30%",
                        background: "rgba(256, 256, 256, 0.9)",
                        border: '1px solid #000',
                        boxShadow: 24,
                        borderRadius: "10px",
                        textAlign: "center",
                        height: "30%",
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
                            Definições de Edição
                        </Typography>
                    </Box>
                    <div
                        style={{ 
                            position: "relative",
                            marginTop: "10px",
                            width: "100%",
                        }}>
                        <div
                            style={{ 
                                width: "50%",
                                float: "left",
                                position: "relative",
                            }}>
                            <Button 
                                variant="contained" 
                                onClick= {() => {
                                    set_modal2(true)
                                    set_modal4(false)
                                }}
                                style={{
                                    zIndex: 400, 
                                    width: "200px",   
                                    margin: "auto",
                                    top: "30px", 
                                }}>
                                    Adicionar ficheiros
                            </Button>
                        </div>
                        <div
                            style={{ 
                                float: "left",
                                width: "50%",
                                position: "relative",
                            }}>
                            <Button 
                                variant="contained" 
                                onClick= {() => {
                                    set_modal3(true)
                                    set_modal4(false)
                                }}
                                style={{
                                    zIndex: 400, 
                                    width: "200px", 
                                    margin: "auto",
                                    top: "17px", 
                                }}>
                                    Editar contexto espacial
                            </Button>
                        </div>
                        <div
                            style={{ 
                                position: "relative",
                                width: "100%",
                                top: "50px",
                                margin:"auto",
                            }}>
                            <Button 
                                variant="contained" 
                                onClick= {() => {
                                    set_modal5(true)
                                    set_modal4(false)
                                }}
                                style={{
                                    background: "rgba(228,38,76,255)",
                                    zIndex: 400, 
                                    margin:"auto",
                                    width: "200px",  
                                }}>
                                    Apagar Documento
                            </Button>
                        </div>
                    </div>
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
                            Pretende apagar este Documento?
                        </Typography>
                    </Box>
                    <div
                        style={{ 
                            position: "relative",
                            top: "20%",
                        }}>
                         <Tooltip
                            title="Apagar documento">
                            <IconButton
                                style={{
                                    background: "rgba(228,38,76,255)",
                                    height: "60px",
                                    width: "60px"
                                }} 
                                onClick={()=> {
                                    delete_document()
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
                open={modal6}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <CircularProgress/>
                </div>
            </Modal>
            <MapContainer 
                style={{ 
                    position: "absolute",
                    height: "92%",
                    width:"100%",
                    float: "left"}}
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
            <div
                style={{ 
                    marginTop: "10px",
                    marginLeft: "10px",
                    borderRadius: "5px",
                    position: "absolute",
                    float: "left",
                    width:"35%",
                    height: "92%",
                    minWidth: "550px",
                    border: "1px solid grey",
                    background: "rgba(256, 256, 256, 0.85)",
                    height: "380px",
                    zIndex: 400
                    }}>
                <div
                    style={{ 
                        borderRadius: "5px",
                        position: "relative",
                        width:"50%",
                        float: "left"
                        }}>
                    <div
                        style={{ 
                            margin: "auto",
                            position: "relative",
                            height: "100%",
                            width:"100%",
                            float: "left"}}>
                        <Box
                            display="flex"
                            alignItems="center"
                            style={{
                                marginTop: "10px"
                            }}>
                            <Typography 
                                variant="h5" 
                                style={{ 
                                    color: "rgba(0, 0, 0, 0.9)",
                                    margin:"auto",
                                    maxWidth: "65%"
                                }}>
                                    {document[4]}
                            </Typography>
                            <Tooltip
                                title="Definições de edição do Documento">
                                <IconButton
                                    style={{
                                        background: "rgba(3,137,173,255)",
                                        left: "-10%"
                                    }}
                                    onClick={()=> {
                                        
                                        set_modal4(true)
                                        /*getAllProviders()
                                        getAllURLS()
                                        getAllDrawingsContext()
                                        getAllStatisticsThemes()
                                        getAllPhotoImageResolution()
                                        getAllAerialPhotoImageResolution()
                                        getAllAerialPhotoScale()
                                        getAllSatellite()
                                        getAllSatelliteResolution()
                                        getAllLiDARResolution()
                                        getAllMapGeometryType()
                                        getAllMapImageResolution()
                                        getAllMapScale()
                                        getAllMapTheme()
                                        getAllMapType()
                                        getAllOrtosScale()
                                        getAllOrtosResolution()
                                        getAllReportsContext()
                                        getAllReportsTheme()
                                        getAllSensorsVariable()
                                        */
                                    }}>
                                    <EditIcon
                                        style={{
                                            color: "rgba(256, 256, 256, 0.9)"}}/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <div 
                            style={{
                                height: "100%",

                            }}>{/*
                            <div 
                                style={{
                                    marginTop: "10px"
                                }}>
                                <Typography 
                                    variant="body2" 
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
                            
                            </div> */}
                                
                            <div 
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    float: "left",
                                    marginTop: "15px"
                                }}>
                                <Typography 
                                    variant="body2" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.7)",
                                        marginLeft: "10px",
                                        float: "left"
                                    }}>
                                        Arquivista:
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.9)",
                                        float: "left",
                                        marginTop: "-2px",
                                        marginLeft: "5px"
                                    }}>
                                        {archiver}
                                </Typography>
                            </div>
                            <div 
                                style={{
                                    float: "left",
                                    position: "relative",
                                    width: "100%",
                                }}>
                                <Typography 
                                    variant="body2" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.7)",
                                        marginLeft: "10px",
                                        float: "left"
                                    }}>
                                        Tipo de documento:
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.9)",
                                        float: "left",
                                        marginTop: "-2px",
                                        marginLeft: "5px"
                                    }}>
                                        {type_translation}
                                </Typography>
                            </div>
                            <div 
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    float: "left",
                                    marginTop: "5px"
                                }}>
                                <Typography 
                                    variant="body2" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.7)",
                                        marginLeft: "10px",
                                        float: "left"
                                    }}>
                                        Fornecedor/autor:
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.9)",
                                        float: "left",
                                        marginTop: "-2px",
                                        marginLeft: "5px"
                                    }}>
                                        {document[7]}
                                </Typography>
                            </div>
                            <div 
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    float: "left",
                                    marginTop: "5px"
                                }}>
                                <Typography 
                                    variant="body2" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.7)",
                                        marginLeft: "10px",
                                        float: "left"
                                    }}>
                                        Ano:
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.9)",
                                        float: "left",
                                        marginTop: "-2px",
                                        marginLeft: "5px"
                                    }}>
                                        {document[8]}
                                </Typography>
                            </div>
                            <div 
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    float: "left",
                                    marginTop: "5px"
                                }}>
                                <Typography 
                                    variant="body2" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.7)",
                                        marginLeft: "10px",
                                        float: "left"
                                    }}>
                                        Adicinado a:
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.9)",
                                        float: "left",
                                        marginTop: "-2px",
                                        marginLeft: "5px"
                                    }}>
                                        {document[9]}
                                </Typography>
                            </div>
                            <div 
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    float: "left",
                                    marginTop: "5px",
                                    height: "150px",
                                }}>
                                <Typography 
                                    variant="body1" 
                                    style={{ 
                                        color: "rgba(0, 0, 0, 0.7)",
                                        marginLeft: "10px",
                                        float: "left"
                                    }}>
                                        Descrição:
                                </Typography>
                                <PerfectScrollbar
                                    style={{
                                        margin: "auto",
                                        width: "95%",
                                        height: "100%",
                                        borderRadius: "5px",
                                        overflow: "auto"
                                    }}>
                                    <Typography 
                                        variant="body2" 
                                        style={{ 
                                            color: "rgba(0, 0, 0, 0.9)",
                                            float: "left",
                                            marginLeft: "2%",
                                            width: "95%",
                                            top: "4vh",
                                            textAlign: "justify",
                                            textJustify: "inter-word"
                                        }}>
                                            {document[5]} 
                                    </Typography>
                                </PerfectScrollbar>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{ 
                        borderRadius: "5px",
                        position: "relative",
                        float: "left",
                        height: "100%",
                        width:"50%"
                    }}>
                    {specifics}
                </div>
            </div>
            <div
                style={{ 
                    margin: "auto",
                    position: "absolute",
                    height: "220px",
                    bottom: "10px",
                    width:"60%",
                    borderRadius: "5px",
                    float: "left",
                    background: "rgba(256, 256, 256, 0.85)",
                    border: "1px solid grey",
                    zIndex: 400,
                    marginLeft:"10px"}}>
                <div
                    style={{
                        width: "100%",
                        heigth: "30px",
                        marginTop: "20px"
                    }}>
                    <Typography 
                        variant="h5" 
                        style={{ 
                            position: "relative",
                            float: "left",
                            left: "20px",
                            margin: "auto",
                            color: "rgba(0, 0, 0, 0.9)",
                        }}>
                            {files.length} Ficheiros
                    </Typography>
                    <Tooltip
                        title="Download de Ficheiros">
                        <IconButton
                            style={{
                                background: "rgba(3,137,173,255)",
                                left: "35%"
                            }} 
                            onClick={()=> {
                                download_files()
                            }}>
                            <DownloadIcon
                                style={{
                                    color: "rgba(256, 256, 256, 1)"}}/>
                        </IconButton>
                    </Tooltip>
                </div>
                <div
                    style={{
                        position: "absolute",
                        overflow: "auto",
                        width: "100%",
                        marginTop: "-10px",
                        height: "165px"
                    }}>  
                    {files?.length && files.map((doc, index) => {
                        let temp_size = (doc[3] / (1024*1024)).toFixed(2);
                        return(
                            <div
                                key={index}
                                style={{ 
                                    position: "relative",
                                    height: "140px", 
                                    width: "20%",
                                    marginTop: "30px",
                                    float:"left",
                                }}>
                                <div
                                    style={{ 
                                        margin:"auto",
                                        position: "relative",
                                        height: "95%",
                                        width: "80%",
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
                                            marginTop: "5px",
                                        }}>
                                        {doc[1]}
                                    </Typography>
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
                                        {doc[2]}
                                    </Typography>
                                    <UploadFileIcon
                                        color= "action"
                                        fontSize="large"
                                        variant="contained" 
                                        style={{
                                            position: "relative",
                                            margin:"auto", 
                                            marginTop: "5px",
                                            height: "20px",
                                            width: "20px",
                                        }}/>
                                    <Typography
                                        variant="body1" 
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
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
}