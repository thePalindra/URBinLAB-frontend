import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Link } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GradeIcon from '@mui/icons-material/Grade';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

export default function Default() {
    let navigate = useNavigate()
    let navigateCancel = useNavigate()
    let space = ""
    const position = [38, -17.7];
    const [results, set_results]=React.useState([])
    const [open, setOpen]=React.useState(false);
    const [editableFG, setEditableFG] = React.useState(null);
    const [spatialList, setSpatialList]=React.useState(<></>);
    const [all_name, set_all_name]=React.useState([]);
    const [spatial_list, set_spatial_list]=React.useState(<></>);
    const [search, set_search]=React.useState("")
    const [providers, set_providers]=React.useState("")
    const [years, set_years]=React.useState("")
    const [types, set_types]=React.useState("")
    const [archivists, set_archivists]=React.useState([])
    const [selected_years, set_selected_years]=React.useState([])
    const [selected_providers, set_selected_providers]=React.useState([])
    const [selected_archivers, set_selected_archivers]=React.useState([])
    const [selected_types, set_selected_types]=React.useState([])


    React.useEffect(() => {
        let ignore = false;
        if (!ignore) {
            get_all()
            group_providers()
            group_years()
            group_types()
            group_archivists()
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
    }

    const onFeatureGroupReady = reactFGref => {
        // store the featureGroup ref for future access to content
        setEditableFG(reactFGref);
    };

    const ImageButton = styled(ButtonBase)(({ theme }) => ({
        float: 'left',
        width: '50% !important',
        height: "8vh",
        [theme.breakpoints.down('sm')]: {
            width: '50% !important', // Overrides inline-style
            height: "2vh",
        },
        '&:hover, &.Mui-focusVisible': {
            zIndex: 1,
          '& .MuiImageBackdrop-root': {
                opacity: 0.15,
          },
          '& .MuiImageMarked-root': {
                opacity: 0,
          },
        },
    }));

    const Image = styled('span')(({ theme }) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    }));

    const ImageBackdrop = styled('span')(({ theme }) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    }));

    const ImageMarked = styled('span')(({ theme }) => ({
        height: 3,
        width: 18,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    }));

    const ImageSrc = styled('span')({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    });

    function update_names(js) {
        let temp = []
        for (let i = 0; i<js.length; i++) {
            temp.push(js[i][4])
        }
        set_all_name([...new Set(temp)])
    }

    async function get_all() {
        let form = new FormData()
        form.append("list", JSON.parse(window.localStorage.getItem('results')))
        const response = await fetch("http://localhost:8080/generic/from_list", {
            method: "POST",
            
            body: form
        })
        const js = await response.json();

        console.log(js)
        set_results(js)
        update_names(js)
        set_selected_years([])
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
                    <GeoJSON key={1} data={parse(result[0])}>
                    </GeoJSON>
                </>
            )
        })
    }

    function get_document_by_name() {
        let form = new FormData()
        form.append("list", JSON.parse(window.localStorage.getItem('results')))
        form.append("name", search)
        fetch("http://localhost:8080/generic/get_by_name", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result);
            set_results(result)
            update_names(result)
        });
    }

    function group_providers() {
        let form = new FormData()
        form.append("list", JSON.parse(window.localStorage.getItem('results')))
        fetch("http://localhost:8080/generic/group_provider_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_providers(result)
        });
    }

    function group_years() {
        let form = new FormData()
        form.append("list", JSON.parse(window.localStorage.getItem('results')))
        fetch("http://localhost:8080/generic/group_year_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_years(result)
        });
    }

    function group_types() {
        let form = new FormData()
        form.append("list", JSON.parse(window.localStorage.getItem('results')))
        fetch("http://localhost:8080/generic/group_type_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_types(result)
        });
    }

    function group_archivists() {
        let form = new FormData()
        form.append("list", JSON.parse(window.localStorage.getItem('results')))
        fetch("http://localhost:8080/generic/group_archivist_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_archivists(result)
        });
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
        form.append("list", JSON.parse(window.localStorage.getItem('results')))
        fetch("http://localhost:8080/generic/filter_list", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result);
            set_results(result)
            update_names(result)
        });
    }
    
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <div style={{ 
                    border: "1px solid black",
                    background: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "10px",
                    height: "6vh",
                    width: "96%",
                    margin: "auto"}}>
                    <IconButton 
                        style={{ position: "fixed", left: "2%"
                    }}
                        onClick={()=>{
                            window.location.reload(false);
                    }}>
                        <ArrowBackIcon sx={{ fontSize: 40, color: "#FFFFFF" }}/>
                    </IconButton>
                    <IconButton 
                        style={{
                            position: "fixed", 
                            right: "3%", 
                            paddingTop: "26px"}}
                        onClick={()=>setOpen(true)}>
                        <QuestionMarkIcon sx={{fontSize: 40, position: "fixed", color: "#FFFFFF"}}/>
                    </IconButton>
                    <div style={{ paddingTop: "10px" }}>
                        <Button variant="contained"  onClick={()=>{
                            navigateCancel(`/`)
                            }}>
                            Nova pesquisa
                        </Button>
                    </div>
                </div>
                <div>
                    <div style={{ 
                        border: "1px solid black",
                        background: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "10px",
                        height: "80vh",
                        left:"1%",
                        width: "12%",
                        margin: "auto",
                        marginTop: "10px",
                        position: "fixed"}}>
                        <br/>
                        <Typography variant="h5" component="h2" color="#FFFFFF">
                            Filtros
                        </Typography>
                        <br/>
                        <div 
                            style={{
                                float:"left",
                                marginLeft: "10px",
                                height: "70vh",
                                overflow: 'auto'
                            }}>
                            <FormControl 
                                component="fieldset" 
                                variant="standard">
                                <FormLabel 
                                    component="legend">
                                    Ano:</FormLabel>
                                <FormGroup 
                                    style={{float:"left"}}>                                
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
                                component="fieldset" 
                                variant="standard">
                                <FormLabel 
                                    component="legend">
                                    Fornecedor:</FormLabel>
                                <FormGroup 
                                    style={{float:"left"}}>                                
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
                                component="fieldset" 
                                variant="standard">
                                <FormLabel 
                                    component="legend">
                                    Arquivista:</FormLabel>
                                <FormGroup 
                                    style={{float:"left"}}>                                
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
                                component="fieldset" 
                                variant="standard">
                                <FormLabel 
                                    component="legend">
                                    Tipos de documento:</FormLabel>
                                <FormGroup 
                                    style={{float:"left"}}>                                
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
                    </div>
                    <div style={{ 
                        border: "1px solid black",
                        background: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "10px",
                        height: "80vh",
                        left: "14%",
                        width: "25%",
                        margin: "auto",
                        marginTop: "10px",
                        position: "fixed"}}>
                        <br/>
                        <Typography variant="h5" component="h2" color="#FFFFFF">
                            Lista de Resultados
                        </Typography>
                        <br/>
                        <Autocomplete
                            freeSolo
                            options={all_name}
                            key={results}
                            size="small"
                            renderInput={(params) => 
                            <TextField 
                                style={{width: "70%"}}
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
                        <br/>
                        <List style={{ 
                            height: "65vh",
                            overflow: 'auto' }}>
                            {results?.length>0 && results.map((doc, index)=> {
                                return(
                                <div 
                                    key={index} 
                                    style={{
                                        margin: "auto",
                                        height: "9vh", 
                                        border: "1px solid white",}}>
                                    <ImageButton
                                        focusRipple
                                        key={doc[0]}
                                        style={{
                                            width: "10%",
                                        }}
                                        >
                                        <ImageSrc style={{ backgroundImage: "url(/test.jpg)"}} />
                                        <ImageBackdrop className="MuiImageBackdrop-root" />
                                        <Image>
                                            <Typography
                                                component="span"
                                                variant="subtitle1"
                                                color="inherit"
                                                sx={{
                                                    position: 'relative',
                                                    p: 4,
                                                    pb: (theme) => `calc(${theme.spacing(1)} + 6px)`}}>
                                                {doc[4]}
                                                <ImageMarked className="MuiImageMarked-root" />
                                            </Typography>
                                        </Image>
                                    </ImageButton>
                                    <IconButton 
                                        style={{ left: "12%" }}>
                                        <GradeIcon/>
                                    </IconButton>
                                    <IconButton 
                                        style={{ left: "12%" }}
                                        onClick={()=>{
                                            get_space_from_document(doc[0])
                                        }}>
                                        <VisibilityIcon/>
                                    </IconButton>
                                </div>)
                            })}
                            
                        </List>
                    </div>
                    <MapContainer 
                        style={{   
                            margin: "auto",
                            width: "59%",
                            padding: "1px",
                            position: "fixed",
                            left: "40%",
                            height: "81vh",
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
                            {/*<EditControl 
                                position="topleft"
                                onCreated={_created}
                                draw= {{
                                    circlemarker: false,
                                    polyline: false,
                                    polygon: false
                                }}
                            edit={{edit:false}}/>*/}
                        </FeatureGroup>       
                        {spatial_list}
                    </MapContainer> 
                </div>   
            </ThemeProvider>
        </>
    )
}