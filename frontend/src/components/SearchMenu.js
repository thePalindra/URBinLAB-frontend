import * as React from 'react';
import TextField from '@mui/material/TextField';
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import "leaflet-draw/dist/leaflet.draw.css"

let lat = 0
let lng = 0
let size = 0
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    background: "rgba(256, 256, 256, 0.92)",
    border: '1px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius: "20px"
};
const minDistance = 4;
const todaysYear = new Date().getFullYear()

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


export default function IsThis() {
    const position = [38.5, -16];
    const [id, setId] = React.useState()
    const [open, setOpen] = React.useState(false);
    const [value1, setValue1] = React.useState([1960, 2000]);
    const [getYear, setYear] = React.useState(true);
    const [getType, setType] = React.useState(true);
    const [user, setUser] = React.useState('');
    const [archiver, setArchiver] = React.useState([0,""]);
    const [collection, setCollection] = React.useState([0,""]);
    const [collections, setCollections] = React.useState([0,""]);
    const [checked, setChecked] = React.useState([
        [false, false, false, false], 
        [false, false, false, false],
        [false],
        [false],
        [false],
        [false],
        [false, false, false],
        [false]
    ])
    const [editableFG, setEditableFG] = React.useState(null);
    let space = ""
    let wkt = "new Wkt.Wkt();"

    function users() {
        fetch("http://localhost:8080/user/get_archivers", {
            method: "POST",
            headers: window.localStorage
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            setArchiver(result)
        });
    }

    function coll() {
        fetch("http://localhost:8080/collection/get_all", {
            method: "POST",
            headers: window.localStorage
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            setCollections(result)
        });
    }

    const handleChange1 = (
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newValue)) {
          return;
        }
    
        if (activeThumb === 0) {
          setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
        } else {
          setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
        }
        console.log(value1)
    };

    const handleOpen = () => {
        users()
        coll()
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const onFeatureGroupReady = reactFGref => {
        // store the ref for future access to content
        setEditableFG(reactFGref);
    };

    function getDocumentBySpaceGeometry() {
        let form = new FormData();
        form.append("page", 0);

        if (space === "c") {
            form.append("lng", lng)
            form.append("lat", lat)
            form.append("size", size)

            fetch("http://localhost:8080/generic/get_document_by_space_circle", {
                method: "POST",
                headers: window.localStorage,
                body: form
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)
            });
        } else {
            form.append("space", space);
                
            fetch("http://localhost:8080/generic/get_document_by_space_geometry", {
                method: "POST",
                headers: window.localStorage,
                body: form
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)
            });
        }
    }

    const handleImagemAerea = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [event.target.checked, event.target.checked, event.target.checked, event.target.checked], 
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]],
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleFotografiaAerea = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [event.target.checked, checked[0][1], checked[0][2], checked[0][3]], 
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]],
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleSatelite = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], event.target.checked, checked[0][2], checked[0][3]], 
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]],
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleOrto = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], event.target.checked, checked[0][3]], 
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]],
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleLidar = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], event.target.checked], 
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]],
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleCartografia = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]],
            [event.target.checked, event.target.checked, event.target.checked, event.target.checked], 
            [event.target.checked],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleCartaBase = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]],
            [event.target.checked, event.target.checked, event.target.checked, event.target.checked], 
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleCartaTematica = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]], 
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]],
            [event.target.checked],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleGeo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]], 
            [event.target.checked, checked[1][1], checked[1][2], checked[1][3]],
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleCoro = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]], 
            [checked[1][0], event.target.checked, checked[1][2], checked[1][3]],
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleTopoC = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]], 
            [checked[1][0], checked[1][1], event.target.checked, checked[1][3]],
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleTopoP = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]], 
            [checked[1][0], checked[1][1], checked[1][2], event.target.checked],
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleFoto = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]], 
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]],
            [checked[2][0]],
            [event.target.checked],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    };

    const handleEsta = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]],
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]], 
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [event.target.checked, event.target.checked, event.target.checked],
            [checked[7][0]]
        ]);
    }

    const handleEstaTema = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]],
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]], 
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [event.target.checked, checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    }

    const handleCensos = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]],
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]], 
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], event.target.checked, checked[6][2]],
            [checked[7][0]]
        ]);
    }

    const handleInq = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]],
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]], 
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], event.target.checked],
            [checked[7][0]]
        ]);
    }

    const handleDes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]],
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]], 
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [event.target.checked],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    }

    const handleRel = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]],
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]], 
            [checked[2][0]],
            [checked[3][0]],
            [event.target.checked],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [checked[7][0]]
        ]);
    }

    const handleSensor = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([
            [checked[0][0], checked[0][1], checked[0][2], checked[0][3]],
            [checked[1][0], checked[1][1], checked[1][2], checked[1][3]], 
            [checked[2][0]],
            [checked[3][0]],
            [checked[4][0]],
            [checked[5][0]],
            [checked[6][0], checked[6][1], checked[6][2]],
            [event.target.checked]
        ]);
    }

    const _created=e=> {
        console.log(e)
        let res = 0
        switch(e.layerType) {
            case "circle":
                res = circle(e)
                break;
            case "rectangle":
                res = polygon(e)
                break;
            case "marker":
                res = point(e)
                break;
            case "polygon":
                res = polygon(e)
                break;
            default:
                break;
        }
        space = res
        getDocumentBySpaceGeometry()
    }

    return (
        <>
            
            <Grid justify="space-between"
                style={{
                margin: "auto",
                width: "90%",
                border: "1px solid black",
                background: "rgba(256, 256, 256, 0.92)",
                borderRadius: "20px",
                padding: "15px"}}
                >
                    <Button variant="contained" 
                        style={{backgroundColor: "black",
                        marginRight: "200px"}}
                        onClick={handleOpen}> Formulário
                    </Button>

                    <Modal
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                        <Box sx={style}>
                            <br/>
                            <Typography id="Title" variant="h4" component="h2">
                                Formulário
                            </Typography>
                            <br/>
                            <br/>   
                            <Grid justify="space-between">
                                <TextField id="name" 
                                    label="Nome" 
                                    variant="outlined" 
                                    size="small"/>  
                                <TextField id="provider" 
                                    label="Fornecedor/Autor" 
                                    variant="outlined" 
                                    size="small"
                                    style={{marginLeft: "20px"}}/>  
                                <br/>
                                <br/>
                                <InputLabel id="demo-simple-select-label">Arquivista</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={user[1]}
                                    label="User"
                                    onChange={(e)=>{setUser(e.target.value)}}
                                    style={{width: "30%"}}
                                    size="small"
                                >
                                    {archiver?.length>0 && archiver.map((doc)=> {
                                        return (<MenuItem key={doc[0]} value={doc}>{doc[1]}</MenuItem>)
                                    })}
                                </Select>
                                <br/>
                                <br/>
                                <InputLabel id="demo-simple-select-label">Coleção</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={collection[1]}
                                    label="User"
                                    onChange={(e)=>{setCollection(e.target.value)}}
                                    style={{width: "30%"}}
                                    size="small"
                                >
                                    {collections?.length>0 && collections.map((doc)=> {
                                        return (<MenuItem key={doc[0]} value={doc}>{doc[1]}</MenuItem>)
                                    })}
                                </Select>
                                <br/>
                                <br/>
                                <Typography id="Title" variant="h6" component="h2">
                                Ano por intervalo
                                    <Switch onChange={()=>{
                                        setYear(!getYear)
                                        console.log(archiver)}}/>
                                    
                                </Typography>
                                <Slider
                                    getAriaLabel={() => 'Minimum distance'}
                                    value={value1}
                                    onChange={handleChange1}
                                    valueLabelDisplay="auto"
                                    disableSwap
                                    min={1950}
                                    max={todaysYear}
                                    disabled={getYear}
                                />
                                <TextField id="ano" 
                                    label="Ano por extenso" 
                                    variant="outlined" 
                                    size="small"
                                    disabled={!getYear}
                                    style={{width: "20%"}}/>  
                                
                                <br/>
                                <br/>
                                <FormControl>
                                    <Typography id="Title" variant="h6" component="h2">
                                    Tipo de documento
                                        <Switch onChange={()=>{
                                            setType(!getType)}}/>
                                    </Typography>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                                            <FormControlLabel 
                                                value="aeriali" 
                                                control={<Checkbox 
                                                    checked={checked[0][0] && checked[0][1] && checked[0][2] && checked[0][3]}
                                                    indeterminate={(
                                                        checked[0][0] || checked[0][1] || checked[0][2] || checked[0][3]) 
                                                        && 
                                                        !(checked[0][0] && checked[0][1] && checked[0][2] && checked[0][3])}
                                                    onChange={handleImagemAerea}/>} 
                                                label="Imagens Aéreas"
                                                disabled={getType}/>
                                        </Box>
                                    </RadioGroup>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel 
                                            value="aerialf" 
                                            control={<Checkbox
                                                checked={checked[0][0]}
                                                onChange={handleFotografiaAerea} />} 
                                            label="Fotografia Aérea"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="satelite" 
                                            control={<Checkbox
                                                checked={checked[0][1]}
                                                onChange={handleSatelite} />} 
                                            label="Imagem Satélite"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="orto" 
                                            control={<Checkbox
                                                checked={checked[0][2]}
                                                onChange={handleOrto} />} 
                                            label="Ortofotomapa"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="lidar" 
                                            control={<Checkbox
                                                checked={checked[0][3]}
                                                onChange={handleLidar} />} 
                                            label="LiDAR"
                                            disabled={getType}/>
                                    </RadioGroup>
                                    <br/>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                                            <FormControlLabel 
                                                value="cartography" 
                                                control={<Checkbox 
                                                    checked={checked[1][0] && checked[1][1] && checked[1][2] && checked[1][3] && checked[2][0]}
                                                    indeterminate={
                                                        (checked[1][0] || checked[1][1] || checked[1][2] || checked[2][0]) 
                                                        && 
                                                        !(checked[1][0] && checked[1][1] && checked[1][2] && checked[2][0])}
                                                    onChange={handleCartografia}/>} 
                                                label="Cartografia"
                                                disabled={getType}/>
                                        </Box>
                                    </RadioGroup>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel 
                                            value="lidar" 
                                            control={<Checkbox
                                                checked={checked[1][0] && checked[1][1] && checked[1][2] && checked[1][3]}
                                                indeterminate={
                                                    (checked[1][0] || checked[1][1] || checked[1][2] || checked[1][3]) 
                                                    && 
                                                    !(checked[1][0] && checked[1][1] && checked[1][2] && checked[1][3])}
                                                onChange={handleCartaBase} />} 
                                            label="Carta de Base"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="lidar" 
                                            control={<Checkbox
                                                checked={checked[2][0]}
                                                onChange={handleCartaTematica} />} 
                                            label="Carta Temática"
                                            disabled={getType}/>
                                    </RadioGroup>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel 
                                            value="choromap" 
                                            control={<Checkbox
                                                checked={checked[1][0]}
                                                onChange={handleGeo}  />} 
                                            label="Carta Geográfico"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="choromap" 
                                            control={<Checkbox 
                                                checked={checked[1][1]}
                                                onChange={handleCoro} />} 
                                            label="Carta Corográfico"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="topomap" 
                                            control={<Checkbox 
                                                checked={checked[1][2]}
                                                onChange={handleTopoC} />} 
                                            label="Carta Topográfico"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="topoplan" 
                                            control={<Checkbox 
                                                checked={checked[1][3]}
                                                onChange={handleTopoP} />} 
                                            label="Planta Topográfica"
                                            disabled={getType}/> 
                                    </RadioGroup>
                                    <br/>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                                            <FormControlLabel 
                                                value="est" 
                                                control={<Checkbox 
                                                    checked={checked[6][0] && checked[6][1] && checked[6][2]}
                                                    indeterminate={(
                                                        checked[6][0] || checked[6][1] || checked[6][2]) 
                                                        && 
                                                        !(checked[6][0] && checked[6][1] && checked[6][2])}
                                                    onChange={handleEsta}/>} 
                                                label="Estatística"
                                                disabled={getType}/>
                                        </Box>
                                    </RadioGroup>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel 
                                            value="esttema" 
                                            control={<Checkbox
                                                checked={checked[6][0]}
                                                onChange={handleEstaTema} />} 
                                            label="Estatística Temática"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="satelite" 
                                            control={<Checkbox
                                                checked={checked[6][1]}
                                                onChange={handleCensos} />} 
                                            label="Censos"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="orto" 
                                            control={<Checkbox
                                                checked={checked[6][2]}
                                                onChange={handleInq} />} 
                                            label="Inquérito"
                                            disabled={getType}/>
                                    </RadioGroup>
                                    <br/>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel 
                                            value="choromap" 
                                            control={<Checkbox
                                                checked={checked[3][0]}
                                                onChange={handleFoto}  />} 
                                            label="Fotografia"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="choromap" 
                                            control={<Checkbox
                                                checked={checked[4][0]}
                                                onChange={handleRel}  />} 
                                            label="Relatório"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="choromap" 
                                            control={<Checkbox
                                                checked={checked[5][0]}
                                                onChange={handleDes}  />} 
                                            label="Desenho"
                                            disabled={getType}/>
                                        <FormControlLabel 
                                            value="choromap" 
                                            control={<Checkbox
                                                checked={checked[7][0]}
                                                onChange={handleSensor}  />} 
                                            label="Dados de Outros Sensores"
                                            disabled={getType}/>
                                    </RadioGroup>
                                </FormControl>
                                <br/>
                                <br/>
                                <Button variant="contained" 
                                    style={{backgroundColor: "black"}}> Efetuar Pesquisa
                                </Button>
                            </Grid>
                        </Box>
                    </Modal>
                    <TextField id="serach" 
                        label="Pesquisa" 
                        variant="outlined" 
                        size="small"
                        style={{marginLeft: "200px"}}/>  
                    <Button variant="contained" 
                        style={{backgroundColor: "black"}}> Pesquisar
                    </Button>     
            </Grid>

            <br/>
            <div style={{   margin: "auto",
                        width: "90%",
                        heigth: "30%",
                        border: "1px solid black",
                        background: "rgba(256, 256, 256, 0.92)",
                        borderRadius: "20px",
                        padding: "30px"}}>

            
                <MapContainer style={{width: "100%"}} center={position} zoom={6} scrollWheelZoom={true} minZoom={4}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />   
                    <FeatureGroup
                        ref={featureGroupRef => {
                            onFeatureGroupReady(featureGroupRef);
                        }}>
                        <EditControl position="topright"
                            onCreated={_created}
                            draw= {{
                                circlemarker: false,
                                polyline: false
                            }}>
                        </EditControl>      
                    </FeatureGroup>   
                </MapContainer>   
            </div> 
        </>
    );
}