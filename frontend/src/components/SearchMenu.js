import * as React from 'react';
import TextField from '@mui/material/TextField';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import FolderIcon from '@mui/icons-material/Folder';
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
const defaultTypes = [
    [false, false, false, false], 
    [false, false, false, false],
    [false],
    [false],
    [false],
    [false],
    [false, false, false],
    [false]
]

function defaultTypesSet() {
    let set = new Set()
    set.add("GENERIC")
    set.add("ORTOS")
    set.add("AERIAL PHOTOGRAPHY")
    set.add("LiDAR")
    set.add("SATELLITE IMAGE")
    set.add("THEMATIC MAP")
    set.add("CHOROGRAPHIC MAP")
    set.add("GEOGRAPHIC MAP")
    set.add("TOPOGRAPHIC PLAN")
    set.add("TOPOGRAPHIC MAP")
    set.add("PHOTOGRAPHY")
    set.add("THEMATIC STATISTICS")
    set.add("SURVEY")
    set.add("CENSUS")
    set.add("DRAWINGS")
    set.add("REPORT")
    set.add("SENSORS")

    console.log(set)
    return set
}

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
    const [name, setName] = React.useState("")
    const [provider, setProvider] = React.useState("")
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [value1, setValue1] = React.useState([1960, 2000]);
    const [types, setTypes] = React.useState(defaultTypesSet())
    const [getYear, setYear] = React.useState(true);
    const [getType, setType] = React.useState(true);
    const [archiver, setArchiver] = React.useState([[0,"Nenhum"]]);
    const [user, setUser] = React.useState("");
    const [collection, setCollection] = React.useState([0,""]);
    const [collections, setCollections] = React.useState([0,""]);
    const [checked, setChecked] = React.useState(defaultTypes)
    const [yearWritten, setYearWritten] = React.useState(null);
    const [editableFG, setEditableFG] = React.useState(null);
    const [documents, setDocuments] = React.useState([]);
    let space = ""

    function users() {
        fetch("http://localhost:8080/user/get_archivers", {
            method: "POST",
            headers: window.localStorage
        })
        .then(res=>res.json())
        .then(result=>{
            result.unshift([0,"Nenhum"])
            setArchiver(result)
            setUser(archiver[0])
            console.log(archiver)
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

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        setEditableFG(reactFGref);
    };

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

    const handleOpen2 = () => {
        setOpen2(true);
    };

    const handleClose2 = () => {
        setOpen2(false);
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
                setDocuments(result)
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
                setDocuments(result)
            });
        }
    }

    const handleImagemAerea = (event: React.ChangeEvent<HTMLInputElement>) => {
        let set = new Set(types)
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
        if (event.target.checked) {
            set.add("ORTOS")
            set.add("AERIAL PHOTOGRAPHY")
            set.add("LiDAR")
            set.add("SATELLITE IMAGE")
        } else {
            set.delete("ORTOS")
            set.delete("AERIAL PHOTOGRAPHY")
            set.delete("LiDAR")
            set.delete("SATELLITE IMAGE")
        }
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("AERIAL PHOTOGRAPHY")
        else 
            set.delete("AERIAL PHOTOGRAPHY")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("SATELLITE IMAGE")
        else 
            set.delete("SATELLITE IMAGE")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("ORTOS")
        else 
            set.delete("ORTOS")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("LiDAR")
        else 
            set.delete("LiDAR")  
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) {
            set.add("THEMATIC MAP")
            set.add("CHOROGRAPHIC MAP")
            set.add("GEOGRAPHIC MAP")
            set.add("TOPOGRAPHIC PLAN")
            set.add("TOPOGRAPHIC MAP")
        } else {
            set.delete("THEMATIC MAP")
            set.delete("CHOROGRAPHIC MAP")
            set.delete("GEOGRAPHIC MAP")
            set.delete("TOPOGRAPHIC PLAN")
            set.delete("TOPOGRAPHIC MAP")
        }
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) {
            set.add("CHOROGRAPHIC MAP")
            set.add("GEOGRAPHIC MAP")
            set.add("TOPOGRAPHIC PLAN")
            set.add("TOPOGRAPHIC MAP")
        } else {
            set.delete("CHOROGRAPHIC MAP")
            set.delete("GEOGRAPHIC MAP")
            set.delete("TOPOGRAPHIC PLAN")
            set.delete("TOPOGRAPHIC MAP")
        }
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("THEMATIC MAP")
        else 
            set.delete("THEMATIC MAP")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("GEOGRAPHIC MAP")
        else 
            set.delete("GEOGRAPHIC MAP")    
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("CHOROGRAPHIC MAP")
        else 
            set.delete("CHOROGRAPHIC MAP")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("TOPOGRAPHIC MAP")
        else 
            set.delete("TOPOGRAPHIC MAP")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("TOPOGRAPHIC PLAN")
        else
            set.delete("TOPOGRAPHIC PLAN")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("PHOTOGRAPHY")
        else 
            set.delete("PHOTOGRAPHY")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) {
            set.add("THEMATIC STATISTICS")
            set.add("SURVEY")
            set.add("CENSUS")
        } else {
            set.delete("THEMATIC STATISTICS")
            set.delete("SURVEY")
            set.delete("CENSUS")
        }
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("THEMATIC STATISTICS")
        else 
            set.delete("THEMATIC STATISTICS")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("CENSUS")
        else 
            set.delete("CENSUS")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("SURVEY")
        else 
            set.delete("SURVEY")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("DRAWINGS")
        else 
            set.delete("DRAWINGS")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("REPORT")
        else 
            set.delete("REPORT")
        setTypes(set)
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
        let set = new Set(types)
        if (event.target.checked) 
            set.add("SENSORS")
        else 
            set.delete("SENSORS")
        setTypes(set)

    }

    const query=(e)=> {
        let form = new FormData();
        form.append("name", name);
        form.append("provider", provider);

        if (!getYear) {
            form.append("max", value1[1]);
            form.append("min", value1[0]);
        } else if (yearWritten!=="" && yearWritten!==null) {
            form.append("max", yearWritten);
            form.append("min", yearWritten);
        } else {
            form.append("max", todaysYear);
            form.append("min", 0);
        }
        form.append("archiver", user[0]);
        form.append("types", [...Array.from(types), ""])
        form.append("page", 0)

        fetch("http://localhost:8080/generic/big_query", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            setDocuments(result)
            handleClose()
            handleOpen2()
        });
    } 

    const _created=e=> {
        const drawnItems = editableFG._layers;
        if (Object.keys(drawnItems).length > 1) {
            Object.keys(drawnItems).forEach((layerid, index) => {
                if (index > 0) return;
                const layer = drawnItems[layerid];
                editableFG.removeLayer(layer);
            });
        }
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
        handleOpen2()
    }

    return (
        <>
            <Modal
                        keepMounted
                        open={open2}
                        onClose={handleClose2}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    background: "rgba(256, 256, 256, 0.92)",
                    border: '1px solid #000',
                    boxShadow: 24,
                    pt: 2,
                    px: 4,
                    pb: 3,
                    borderRadius: "20px"
                }}>
                    <List
                        sx={{ width: '100%', 
                        borderRadius: "20px",
                        height: 500,
                        overflow: 'auto',
                        background: "rgba(256, 256, 256, 0.92)"}}>

                        {documents?.length>0 && documents.map((doc)=>
                            <ListItemButton key={doc[0]}>
                                <ListItemAvatar>
                                    <FolderIcon />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={doc[2]}
                                    secondary={
                                        <React.Fragment>
                                            <Box textAlign="left">
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary">
                                                    tipo: {doc[3]}
                                                </Typography>
                                            </Box>
                                            <Box textAlign="right"
                                                    style={{ paddingRight: 5 }}>
                                                ano:  {doc[4]}
                                            </Box>
                                        </React.Fragment>
                                    }/>
                            </ListItemButton>
                        )}

                    </List>
                </Box>
            </Modal>
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
                                    size="small"
                                    onChange={(e)=>{setName(e.target.value)}}/>  
                                <TextField id="provider" 
                                    label="Fornecedor/Autor" 
                                    variant="outlined" 
                                    size="small"
                                    style={{marginLeft: "20px"}}
                                    onChange={(e)=>{setProvider(e.target.value)}}/>  
                                <br/>
                                <br/>
                                <InputLabel id="demo-simple-select-label">Arquivista</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={user}
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
                                    style={{width: "20%"}}
                                    onChange={(e)=> {
                                        setYearWritten(e.target.value)
                                    }}/>  
                                
                                <br/>
                                <br/>
                                <FormControl>
                                    <Typography id="Title" variant="h6" component="h2">
                                    Tipo de documento
                                        <Switch onChange={()=>{
                                            setType(!getType)
                                            if (getType) {
                                                setTypes(new Set())
                                            } else {
                                                setChecked(defaultTypes)
                                                setTypes(defaultTypesSet())
                                            } }}/>
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
                                    style={{backgroundColor: "black"}}
                                    onClick={query}
                                    disabled={false}> Efetuar Pesquisa
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
                    <FeatureGroup ref={featureGroupRef => {
                        onFeatureGroupReady(featureGroupRef);
                    }}>
                        <EditControl position="topright"
                            onCreated={_created}
                            draw= {{
                                circlemarker: false,
                                polyline: false,
                                marker: false
                            }}
                            edit={{ 
                                edit: false, 
                                remove: false 
                            }}>
                        </EditControl>      
                    </FeatureGroup>   
                </MapContainer>   
            </div> 
        </>
    );
}