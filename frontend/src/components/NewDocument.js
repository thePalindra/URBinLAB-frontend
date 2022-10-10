import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Container } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import PublicIcon from '@mui/icons-material/Public';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Modal from '@mui/material/Modal';

let lat = 0
let lng = 0
let size = 0
let wkt = "new Wkt.Wkt();"

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 200
        },
    },
};

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
    res = [res+limit[0],origin[1]+"))"].join(" ")
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

export default function DefaultFunction() {
    const position = [38, -17];
    let navigateCancel = useNavigate()
    let navigateConfirm = useNavigate()
    const [docType, setDocType]=React.useState("generic");
    const [name, setName]=React.useState('');
    const [desc, setDesc]=React.useState('');
    const [provider, setProvider]=React.useState('');
    const [time, setTime]=React.useState('');
    const [link, setLink]=React.useState('');
    const [type, setType]=React.useState('');
    const [context, setContext]=React.useState('');
    const [color, setColor]=React.useState(false);
    const [theme, setTheme]=React.useState('');
    const [satellite, setSatellite]=React.useState('');
    const [variable, setVariable]=React.useState('');
    const [mapType, setMapType]=React.useState('');
    const [resolution, setRes]=React.useState('');    
    const [scale, setScale]=React.useState('');
    const [URLs, setURL]=React.useState('geographic_map');
    const [raster, setRaster]=React.useState(true);
    const [docForm, setDocForm]=React.useState(
        <Container style={{
            height: 520,
            maxHeight: 550,
            overflow: 'auto'
            }}>
            <form style={{
                float:"left"
            }}>
                <TextField 
                    id="name" 
                    label="Nome" 
                    variant="outlined" 
                    onChange={(e)=>setName(e.target.value)}
                    size="small"
                />
                <br/>
                <br/>
                <TextField 
                    id="provider" 
                    label="Fornecedor" 
                    variant="outlined" 
                    onChange={(e)=>setProvider(e.target.value)}
                    size="small"
                />
                <br/>
                <br/>
                <TextField 
                    id="year" 
                    label="Ano" 
                    variant="outlined" 
                    onChange={(e)=>setTime(e.target.value)}
                    size="small"
                />
                <br/>
                <br/>
                <TextField 
                    id="link" 
                    label="URL" 
                    variant="outlined" 
                    onChange={(e)=>setLink(e.target.value)}
                    size="small"
                />
                <br/>
                <br/>
                <TextField 
                    id="descrption"
                    label="Descrição" 
                    variant="outlined" 
                    multiline
                    fullWidth
                    onChange={(e)=>setDesc(e.target.value)}
                    size="small"
                />
            </form>
        </Container>
    );
    const [editableFG, setEditableFG] = React.useState(null);
    const [list, setList]=React.useState([]);
    const [selectedHierarchy, setSelectedHierarchy]=React.useState("");
    const [selectedLevel, setSelectedLevel]=React.useState("");
    const [spatialHierarchy, setSH]=React.useState([]);
    const [spatialLevel, setSL]=React.useState([]);
    const [spatialQuery, setSQ] =React.useState("");
    const [spatialList, setSpatialList]=React.useState(<></>);
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);
    const [fileType, setFileType] = React.useState("vector");
    const [selectedFile, setSelectedFile]=React.useState("");
    const [spaceName, setSpaceName]=React.useState();
    const [spaceForm, setSpaceForm]=React.useState(<></>);
    const [allProviders, setAllProviders]=React.useState([]);
    const [allURLs, setAllURLs]=React.useState([]);
    const [allSpatialNames, setAllSpatialNames]=React.useState([]);

    React.useEffect(() => {
        let ignore = false;

        if (!ignore) {
            getSH()
            getAllProviders()
            getAllURLS()
        }
            
        return () => { ignore = true; }
    },[]);

    const _created=e=> {
        setSpatialList(<></>)
        const drawnItems = editableFG._layers;
        if (Object.keys(drawnItems).length > 1) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editableFG.removeLayer(layer);
            });
        }
        let parse = require('wellknown');
        switch(e.layerType) {
            case "circle":
                wkt = circle(e)
                break;
            case "rectangle":
                wkt = parse(polygon(e))
                break;
            case "marker":
                wkt = parse(point(e))
                break;
            case "polygon":
                wkt = parse(polygon(e))
                break;
            default:
                break;
        }
    }

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        setEditableFG(reactFGref);
    };

    function addFile(e) {
        let arr = [...list]
        for (let i = 0; i<e.target.files.length; i++) {
            let current = e.target.files[i]
            if (!arr.find(file=> file.name===current.name))
                arr.push(e.target.files[i])
        }

        setList(arr)
        console.log(arr)
    }

    function getSH() {
        fetch("http://localhost:8080/space/get_hierarchy", {
            method: "POST",
            headers: window.localStorage,
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setSH(result)
        })
    }

    function getSL(hier) {
        let form = new FormData();
        form.append("hierarchy", hier)

        fetch("http://localhost:8080/space/get_levels", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            setSL(result)
        })
    }

    function getAllProviders() {
        fetch("http://localhost:8080/generic/get_all_providers", {
            method: "POST",
            headers: window.localStorage,
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllProviders(result)
        })
        
    }
    
    function getAllURLS() {
        fetch("http://localhost:8080/generic/get_all_urls", {
            method: "POST",
            headers: window.localStorage,
            body: []
        })
        .then(res=>res.json())
        .then(result=>{
            setAllURLs(result)
        })
    }

    function get_names_from_level(level) {
        let form = new FormData();
        form.append("hierarchy", selectedHierarchy)
        form.append("level", level)

        fetch("http://localhost:8080/space/get_names", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            setAllSpatialNames(result)
        })
    }

    function allFormAppend() {
        let form = new FormData()
        form.append("name", name);
        form.append("description", desc);
        form.append("provider", provider);
        form.append("timeScope", time+"/01/01");
        form.append("link", link);

        switch(docType) {
            case "aerial_photography": 
                form.append("resolution", resolution)
                form.append("scale", scale)
                break;
            case "geographic_map":
                form.append("scale", scale)
                form.append("resolution", resolution)
                form.append("type", type)
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
                form.append("theme", theme)
                break;
            case "thematic_map":
                form.append("scale", scale)
                form.append("resolution", resolution)
                form.append("type", type)
                form.append("raster", raster)
                form.append("theme", theme)
                form.append("mapType", mapType)
                break;
            default:
                break;
        }
        return form;
    }

    async function addDocument() {
        let form = allFormAppend()
        
        let docId = await fetch("http://localhost:8080/"+ URLs +"/add_document", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        docId = await docId.json();

        let sform = new FormData();
        sform.append("document", docId);

        switch(typeof wkt) {
            case typeof 1:
                console.log(wkt)
                sform.append("id", wkt);
                fetch("http://localhost:8080/space/attach", {
                    method: "POST",
                    headers: window.localStorage,
                    body: sform
                })
                break;
            case typeof "c":
                console.log("default")
                sform.append("lng", lng)
                sform.append("lat", lat)
                sform.append("size", size)
                sform.append("name", spaceName)
                fetch("http://localhost:8080/space/add_circle", {
                    method: "POST",
                    headers: window.localStorage,
                    body: sform
                })
                break;
            default:
                console.log(wkt)
                wkt = JSON.stringify(wkt);
                sform.append("name", spaceName)
                sform.append("space", wkt)
                fetch("http://localhost:8080/space/add_Geo", {
                    method: "POST",
                    headers: window.localStorage,
                    body: sform
                })
                break;
        }

        for (let i = 0; i<list.length; i++) {
            let fform = new FormData();
            fform.append("file", list[i])
            fform.append("document", docId)

            fetch("http://localhost:8080/file/add", {
                method: "POST",
                headers: window.localStorage,
                body: fform
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)
            })
        }
        console.log("terminou tudo bem")
    }

    const returnSpaces =()=> {
        const drawnItems = editableFG._layers;
        if (Object.keys(drawnItems).length > 0) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editableFG.removeLayer(layer);
            });
        }

        let form = new FormData();
        form.append("name", spatialQuery.charAt(0).toUpperCase() + spatialQuery.slice(1))
        form.append("level", selectedLevel)
        form.append("hierarchy", selectedHierarchy)

        fetch("http://localhost:8080/space/search_by_name", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)

            let parse = require('wellknown');
            console.log(parse(result[0][1]))
                
            setSpatialList(result.map(doc => (
                <GeoJSON key={doc[0]} data={parse(doc[1])}>
                    <Popup>
                        
                        <ListItem>
                            <ListItemAvatar>
                                
                            </ListItemAvatar>
                            <ListItemText primary={doc[2]} />
                        </ListItem>
                        <Button variant="contained" 
                            style={{backgroundColor: "black"}}
                            onClick={()=>{setSpatialList(
                                <GeoJSON key={doc[0]} data={parse(doc[1])}>
                                    <Popup>
                                        
                                        <ListItem>
                                            <ListItemAvatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={doc[2]} />
                                        </ListItem>
                                        <Button variant="contained" 
                                            style={{backgroundColor: "black"}}
                                            onClick={()=>setSpatialList(<></>)}> Apagar </Button>
                                    </Popup>
                                </GeoJSON>)
                                wkt=doc[0]
                                console.log(wkt)
                            }}> Confirmar localização </Button>
                        <br/>
                        <br/>
                        <Button variant="contained" 
                            style={{backgroundColor: "black"}}
                            onClick={()=>setSpatialList(<></>)}> Apagar </Button>
                    </Popup>
                </GeoJSON>
            )))
        })
    }

    function getGeometria() {
        const drawnItems = editableFG._layers;
        if (Object.keys(drawnItems).length > 0) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editableFG.removeLayer(layer);
            });
        }
        let form = new FormData();
        form.append("file", selectedFile)
        
        for (const temp of list) {
            if (selectedFile!=temp)
                form.append('aux', temp);
        }

        if (fileType==="raster") {
            fetch("http://localhost:5050/transform/raster", {
                method: "POST",
                body: form
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)

                let parse = require('wellknown');
                wkt = parse(polygonAux(result.origin, result.limit))
                console.log(typeof wkt)
                setSpatialList(<></>)
                setSpatialList(
                    <GeoJSON data={wkt}>
                        <Popup>
                            
                            <ListItem>
                                <ListItemAvatar>
                                    
                                </ListItemAvatar>
                                <ListItemText primary={1} />
                            </ListItem>
                            <Button variant="contained" 
                                style={{backgroundColor: "black"}}
                                onClick={()=>setSpatialList(<></>)}> Apagar </Button>
                        </Popup>
                    </GeoJSON>
                )
            })
        } else {
            fetch("http://localhost:5050/transform/vector", {
                method: "POST",
                body: form
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result.features)

                wkt = result
                console.log(wkt)
                setSpatialList(
                    <GeoJSON data={wkt}>
                        <Popup>
                            
                            <ListItem>
                                <ListItemAvatar>
                                    
                                </ListItemAvatar>
                                <ListItemText primary={1} />
                            </ListItem>
                            <Button variant="contained" 
                                style={{backgroundColor: "black"}}
                                onClick={()=>setSpatialList(<></>)}> Apagar </Button>
                        </Popup>
                    </GeoJSON>
                )
                    
                /*setSpatialList(result.features.map((doc, index) => (
                    <GeoJSON key={index} data={doc}>
                        <Popup>
                            
                            <ListItem>
                                <ListItemAvatar>
                                    
                                </ListItemAvatar>
                                <ListItemText primary={index} />
                            </ListItem>
                            <Button variant="contained" 
                                style={{backgroundColor: "black"}}> Confirmar localização </Button>
                        </Popup>
                    </GeoJSON>
                )))*/
            })
        }
    }

    return (
        <Container>
            <Modal 
                keepMounted
                open={open}
                onClose={()=>{setOpen(false)}}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "25%",
                        background: "rgba(256, 256, 256, 0.92)",
                        border: '5px solid #000',
                        boxShadow: 24,
                        borderRadius: "20px",
                        textAlign: "center"
                    }}>
                        <br/>
                        <Typography variant="h6" component="h2">
                                {selectedFile.name}
                        </Typography>
                        <br/>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Tipo de ficheiro</InputLabel>
                            <Select
                                size="small"
                                value={fileType}
                                label="Tipo de ficheiro"
                                MenuProps={MenuProps}
                                onChange={(e)=>{
                                    setFileType(e.target.value)
                                }}>
                                <MenuItem key="0" value="raster">Ficheiro Raster</MenuItem>
                                <MenuItem key="1" value="vector">Ficheiro Vetorial</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        <br/>
                        <Button variant="contained" 
                            style={{backgroundColor: "black"}}
                            onClick={()=>{getGeometria()}}>
                                Utilizar como espaço
                        </Button>
                        <br/>
                        <br/>
                    </div>
            </Modal>
            <Modal 
                keepMounted
                open={open2}
                onClose={()=>{setOpen2(false)}}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "25%",
                        background: "rgba(256, 256, 256, 0.92)",
                        border: '5px solid #000',
                        boxShadow: 24,
                        borderRadius: "20px",
                        textAlign: "center"
                    }}>
                    <br/>
                    <Typography variant="h6" component="h2">
                            Ajuda
                    </Typography>
                    <br/>
                </div>
            </Modal>
            <Modal 
                keepMounted
                open={open3}
                onClose={()=>{setOpen3(false)}}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "25%",
                        background: "rgba(256, 256, 256, 0.92)",
                        border: '5px solid #000',
                        boxShadow: 24,
                        borderRadius: "20px",
                        textAlign: "center"
                    }}>
                    <br/>
                    <Typography variant="h6" component="h2">
                        Formulário do documento
                    </Typography>
                    <hr/>
                    <br/>
                    <FormControl sx={{ 
                        width: "90%",
                        left: '5%',
                        float:"left"
                    }}>
                        <InputLabel>Tipo de documento</InputLabel>
                        <Select
                            size="small"
                            value={docType}
                            label="Tipo de documento"
                            MenuProps={MenuProps}
                            onChange={(e)=>{
                                setDocType(e.target.value)
                                setURL(e.target.value)
                                console.log(docType)
                                console.log(docForm)
                            }}>
                            <MenuItem key="drawings" value="drawings">Desenho</MenuItem>
                            <MenuItem key="generic" value="generic">Documento</MenuItem>
                            <MenuItem key="thematic_statistics" value="thematic_statistics">Estatísticas</MenuItem>
                            <MenuItem key="photography" value="photography">Fotografia</MenuItem>
                            <MenuItem key="aerial_photography" value="aerial_photography">Fotografia aérea</MenuItem>
                            <MenuItem key="satellite_image" value="satellite_image">Imagem satélite</MenuItem>
                            <MenuItem key="LiDAR" value="LiDAR">LiDAR</MenuItem>
                            <MenuItem key="geographic_map" value="geographic_map">Mapa de Base</MenuItem>
                            <MenuItem key="thematic_map" value="thematic_map">Mapa Temático</MenuItem>
                            <MenuItem key="ortos" value="ortos">Ortofotomapa</MenuItem>
                            <MenuItem key="reports" value="reports">Relatório</MenuItem>
                            <MenuItem key="sensors" value="sensors">Sensores</MenuItem>
                        </Select>
                    </FormControl>
                    <br/>
                    <>
                        {docType==="thematic_map" &&
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                            }}>
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Escala" 
                                        onChange={(e)=>setScale(e.target.value)}/>}
                                    onChange={(e, values)=>setScale(values)}
                                />
                                <br/>
                                <br/>  
                                <br/>  
                                <FormControl>
                                    <FormLabel id="l"></FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="l"
                                        defaultValue="1"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Raster" onClick={(e)=>setRaster(true)}/>
                                        <FormControlLabel value="2" control={<Radio />} label="Vetorial" onClick={(e)=>setRaster(false)}/>
                                    </RadioGroup>
                                </FormControl> 
                                <br/>
                                <br/>  
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setRes(e.target.value)}
                                        size="small"
                                        disabled={!raster}
                                    />}
                                    onChange={(e, values)=>setRes(values)}
                                />   
                                <br/>
                                <br/>
                                <br/>   
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Tipo de Geometria" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setType(e.target.value)}
                                        size="small"
                                        disabled={raster}
                                    />}
                                    onChange={(e, values)=>setType(values)}
                                />   
                                <br/>
                                <br/>
                                <br/>  
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Tema" 
                                        style={{
                                            width: "60%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setTheme(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>setTheme(values)}
                                />   
                                <br/>
                                <br/>
                                <br/> 
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Tipo de Mapa" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setMapType(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>setMapType(values)}
                                />   
                                <br/>
                                <br/>
                                <br/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />
                            </Container>
                        }
                        {docType==="thematic_statistics" &&
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                            }}>
                                <br/>
                                <FormControl sx={{ 
                                    width: "50%",
                                    float:"left" 
                                }}>
                                    <InputLabel>Tipo de estatística</InputLabel>
                                    <Select
                                        size="small"
                                        value={URLs}
                                        label="Tipo de documento"
                                        MenuProps={MenuProps}
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
                                <br/>
                                <br/>
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Tema" 
                                        style={{
                                            width: "60%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setTheme(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>setTheme(values)}
                                /> 
                                <br/>
                                <br/>
                                <br/>      
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />
                            </Container>
                        }
                        {docType==="sensors" &&
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                            }}> 
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Variável medida" 
                                        onChange={(e)=>setVariable(e.target.value)}/>}
                                    onChange={(e, values)=>setVariable(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />   
                            </Container>
                        }
                        {docType==="satellite_image" &&
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                                }}> 
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setRes(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>setRes(values)}
                                /> 
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Nome do Satélite" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setSatellite(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>setSatellite(values)}
                                /> 
                                <br/>
                                <br/>
                                <br/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />
                            </Container>
                        }
                        {docType==="reports" &&
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                                }}>
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Contexto" 
                                        style={{
                                            width: "60%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setContext(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>setContext(values)}
                                />
                                <br/>
                                <br/>
                                <br/> 
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Tema" 
                                        style={{
                                            width: "60%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setTheme(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>setTheme(values)}
                                />
                                <br/>
                                <br/>
                                <br/> 
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />
                            </Container>
                        }
                        {docType==="photography" &&
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                                }}> 
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <FormControlLabel control={<Switch
                                    checked={color}
                                    onChange={() => setColor(!color)}
                                    label="A cores"
                                    color="primary"
                                />} label="Fotografia a cores" />
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setRes(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>setRes(values)}
                                />
                                <br/>
                                <br/>
                                <br/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />      
                            </Container>
                        }
                        {docType==="ortos" &&
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                                }}>
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Escala" 
                                        onChange={(e)=>setScale(e.target.value)}/>}
                                    onChange={(e, values)=>setScale(values)}
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setRes(e.target.value)}
                                        size="small"
                                        disabled={!raster}
                                    />}
                                    onChange={(e, values)=>setRes(values)}
                                /> 
                                <br/>
                                <br/>
                                <br/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />       
                            </Container>
                        }
                        {docType==="LiDAR" &&
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                                }}>
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setRes(e.target.value)}
                                        size="small"
                                        disabled={!raster}
                                    />}
                                    onChange={(e, values)=>setRes(values)}
                                />   
                                <br/>
                                <br/>
                                <br/>  
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />     
                            </Container>
                        }
                        {docType==="generic" && 
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                                }}>
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />
                            </Container>
                        }
                        {docType==="aerial_photography" && 
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                                }}>
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setRes(e.target.value)}
                                        size="small"
                                        disabled={!raster}
                                    />}
                                    onChange={(e, values)=>setRes(values)}
                                />   
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Escala aproximada" 
                                        onChange={(e)=>setScale(e.target.value)}/>}
                                    onChange={(e, values)=>setScale(values)}
                                />
                                <br/>
                                <br/>
                                <br/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />
                            </Container>
                        }
                        {docType==="drawings" &&
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                                }}>
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Contexto" 
                                        style={{
                                            width: "60%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setContext(e.target.value)}
                                        size="small"
                                    />}
                                    onChange={(e, values)=>setContext(values)}
                                />
                                <br/>
                                <br/>
                                <br/>
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                />
                            </Container>
                        }
                        {docType==="geographic_map" && 
                            <Container style={{
                                maxHeight: "40vh",
                                overflowY: 'auto',
                                textAlign: "center"
                                }}>
                                <br/>
                                <FormControl sx={{ 
                                    width: "50%",
                                    float:"left"}}>
                                    <InputLabel>Tipo de mapa de base</InputLabel>
                                    <Select
                                        size="small"
                                        value={URLs}
                                        label="Tipo de mapa de base"
                                        MenuProps={MenuProps}
                                        onChange={(e)=>{
                                            setURL(e.target.value)
                                            console.log(URLs)
                                        }}>
                                        <MenuItem value="geographic_map">Mapa Geográfico</MenuItem>
                                        <MenuItem value="chorographic_map">Mapa Corográfico</MenuItem>
                                        <MenuItem value="topographic_map">Mapa Topográfico</MenuItem>
                                        <MenuItem value="topographic_plan">Planta Topográfica</MenuItem>
                                    </Select>
                                </FormControl>
                                <br/>
                                <br/>
                                <br/>
                                <TextField 
                                    style={{width: "60%", float:"left"}}
                                    required
                                    label="Nome" 
                                    variant="outlined" 
                                    onChange={(e)=>setName(e.target.value)}
                                    size="small"
                                />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allProviders}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Fornecedor" 
                                        onChange={(e)=>{
                                            setProvider(e.target.value)
                                        }}/>}
                                        onChange={(e, values)=>{
                                            setProvider(values)
                                        }}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    options={range(1700, new Date().getFullYear(), 1).reverse()}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Ano" 
                                        required/>}
                                    onChange={(e, values)=>setTime(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={allURLs}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "80%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="URL" 
                                        onChange={(e)=>setLink(e.target.value)}/>}
                                    onChange={(e, values)=>setLink(values)}
                                    />
                                <br/>
                                <br/>
                                <br/>
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField 
                                        style={{
                                            width: "60%", 
                                            float:"left"}} 
                                        {...params} 
                                        label="Escala aproximada" 
                                        onChange={(e)=>setScale(e.target.value)}/>}
                                    onChange={(e, values)=>setScale(values)}
                                />
                                <br/>
                                <br/>
                                <br/>
                                <FormControl>
                                    <FormLabel id="l"></FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="l"
                                        defaultValue="1"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel 
                                            value="1" 
                                            control={<Radio />} 
                                            label="Raster" 
                                            onClick={(e)=>{
                                                setRaster(true)
                                                console.log(raster)
                                            }}
                                        />
                                        <FormControlLabel 
                                            value="2" 
                                            control={<Radio />} 
                                            label="Vetorial" 
                                            onClick={(e)=>{
                                                setRaster(false)
                                                console.log(raster)
                                            }}
                                        />
                                    </RadioGroup>
                                </FormControl> 
                                <br/>
                                <br/>  
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Resolução da Imagem" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setRes(e.target.value)}
                                        size="small"
                                        disabled={!raster}
                                    />}
                                    onChange={(e, values)=>setRes(values)}
                                />   
                                <br/>
                                <br/>
                                <br/>   
                                <Autocomplete
                                    freeSolo
                                    options={[1,2,3]}
                                    size="small"
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField  
                                        label="Tipo de Geometria" 
                                        style={{
                                            width: "80%", 
                                            float:"left"}}
                                        variant="outlined" 
                                        {...params}
                                        onChange={(e)=>setType(e.target.value)}
                                        size="small"
                                        disabled={raster}
                                    />}
                                    onChange={(e, values)=>setType(values)}
                                />
                                <br/>
                                <br/>
                                <br/>  
                                <TextField 
                                    id="descrption"
                                    label="Descrição" 
                                    variant="outlined" 
                                    multiline
                                    fullWidth
                                    rows={4}
                                    onChange={(e)=>setDesc(e.target.value)}
                                    style={{float:"left"}}
                                    size="small"
                                /> 
                            </Container>
                        }
                    </>
                    <br/>
                    <Button variant="contained" 
                        style={{backgroundColor: "black"}}
                        onClick={()=>{addDocument()}}>
                            Confirmar
                    </Button>
                    <br/>
                    <br/>
                </div>
            </Modal>
            <div style={{   
                margin: "auto",
                width: "98%",
                padding: "10px",
                position: "fixed",
                left: "5px"}}>
                    <IconButton style={{
                        left:"3%",
                        position: "fixed",
                    }}
                        onClick={()=>{
                            navigateCancel(`/`)
                    }}>
                        <ArrowBackIcon sx={{ fontSize: 40 }}/>
                    </IconButton>

                    <IconButton style={{
                        right:"3%",
                        position: "fixed",
                    }}
                        onClick={()=>setOpen2(true)}>
                        <QuestionMarkIcon sx={{fontSize: 40}}/>
                    </IconButton>

                    <Button variant="contained" component="label" style={{
                        backgroundColor: "black",
                        paddingTop: "1vh"}}
                        onClick={()=>setOpen3(true)}>
                        Confirmar
                    </Button>
            </div>
            <>
                <br/>
                <br/>
                <br/>
                <br/>
            </>
            <div style={{   
                margin: "auto",
                position: "fixed",
                width: "17%",
                left: "0%"}}>
                    <Typography variant="h6" component="h2">
                        Procurar espaços
                    </Typography>
                    <hr/>
                    <br/>
                    <FormControl sx={{ minWidth: 200 }}>
                        <Autocomplete
                            disablePortal
                            options={spatialHierarchy}
                            size="small"
                            renderInput={(params) => <TextField 
                                style={{
                                    float:"left"}} 
                                {...params} 
                                label="Hierarquia"/>}
                            onChange={(e, values)=>{
                                setSelectedHierarchy(values)
                                getSL(values)}}
                            />
                    </FormControl>
                    <br/>
                    <br/>
                    <FormControl sx={{ minWidth: 200 }}>
                        <Autocomplete
                            disablePortal
                            options={spatialLevel}
                            size="small"
                            renderInput={(params) => <TextField 
                                style={{
                                    float:"left"}} 
                                {...params} 
                                label="Escopo" 
                                />}
                            onChange={(e, values)=>{
                                setSelectedLevel(values)
                                get_names_from_level(values)
                            }}
                        />
                    </FormControl>
                    <br/>
                    <br/>
                    <FormControl sx={{ minWidth: 200 }}>
                    <Autocomplete
                        freeSolo
                        options={allSpatialNames}
                        size="small"
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField 
                            style={{
                                width: "80%"}} 
                            {...params} 
                            label={selectedLevel} 
                            onChange={(e)=>{
                                setSQ(e.target.value)
                            }}/>}
                            onChange={(e, values)=>{
                                setSQ(values)
                            }}
                        />
                    <br/>
                    </FormControl>
                    <Button variant="contained" 
                      style={{backgroundColor: "black"}}
                      onClick={returnSpaces}>Pesquisar</Button>
                    <br/>
                    <br/>
                <>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </>
                
            </div>
            <div style={{   
                    margin: "auto",
                    width: "18%",
                    left: "17%",
                    borderRadius: "20px",
                    position: "fixed",
                    paddingTop: "10px",
                    border: "5px solid black",}}>
                    <Container>
                        <br/>
                        <Button
                        variant="contained"
                        component="label"
                        >
                        Upload de ficheiros
                        <input
                            type="file"
                            hidden
                            multiple
                            onChange={(e)=> {
                                addFile(e);
                            }}
                        />
                        </Button>
                        <div style={{   
                            margin: "auto",
                            width: "90%",
                            borderRadius: "20px",
                            padding: "30px"}}>
                            <List 
                                style={{
                                    maxHeight: "30vh",
                                    overflow: 'auto'
                                }}>
                                {list?.length>0 && list.map((doc, index)=> 
                                    <ListItem key={doc.name}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={()=>{
                                            let aux = [...list]
                                            aux.splice(index, 1)
                                            setList(aux)
                                        }}>
                                            <DeleteIcon/>
                                        </IconButton>
                                        }> 
                                        <ListItemButton role={undefined} onClick={()=>{
                                            setSelectedFile(doc)
                                            setOpen(true)
                                        }} 
                                            dense>
                                            <ListItemText
                                            primary={doc.name} secundary={doc.size}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </List>
                        </div>      
                    </Container>

                </div>
            <div style={{   
                margin: "auto",
                width: "63.5%",
                padding: "1px",
                position: "fixed",
                left: "35.7%",
                height: "70vh",
                }}>
                <MapContainer 
                    style={{
                        width: "100%",
                        height: "72vh"
                    }} 
                    center={position} 
                    zoom={6} 
                    scrollWheelZoom={true} 
                    minZoom={4}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FeatureGroup ref={featureGroupRef => {
                        onFeatureGroupReady(featureGroupRef);
                    }}>
                        <EditControl position="topright"
                            onCreated={_created}
                            draw= {{
                                circlemarker: false,
                                polyline: false
                            }}
                            edit={{ 
                                edit: false
                            }}/>
                    </FeatureGroup>       
                    {spatialList}
                </MapContainer>   
            </div> 
        </Container>
    );
}