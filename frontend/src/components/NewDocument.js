import * as React from 'react';
import TextField from '@mui/material/TextField';
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

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 200
        },
    },
};

export default function Addgeneric() {
    let navigate = useNavigate()
    let form = new FormData();
    const [docType, setDocType]=React.useState("");
    const [name, setName]=React.useState('');
    const [desc, setDesc]=React.useState('');
    const [provider, setProvider]=React.useState('');
    const [time, setTime]=React.useState('');
    const [link, setLink]=React.useState('');
    const [type, setType]=React.useState('');
    const [context, setContext]=React.useState('');
    const [color, setColor]=React.useState(true);
    const [theme, setTheme]=React.useState('');
    const [satellite, setSatellite]=React.useState('');
    const [variable, setVariable]=React.useState('');
    const [mapType, setMapType]=React.useState('');
    const [res, setRes]=React.useState('');    
    const [scale, setScale]=React.useState('');
    const [URL, setURL]=React.useState('');
    const [raster, setRaster]=React.useState(true);
    const [docForm, setDocForm]=React.useState(
        <>
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
        </>
    );

    function allFormAppend() {
    
    }

    function setFormulário() {
        switch(docType) {
            case "generic":
                setDocForm(
                    <>
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
                    </>
                );
                break;
            case "aerial_photography":
                setDocForm(
                    <>
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
                                id="link" 
                                label="Escala aproximada" 
                                variant="outlined" 
                                onChange={(e)=>setScale(e.target.value)}
                                size="small"
                            />
                            <br/>
                            <br/>
                            <TextField 
                                id="link"
                                label="Resolução de Imagem" 
                                variant="outlined" 
                                onChange={(e)=>setRes(e.target.value)}
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
                    </>
                );
                break;
            case "geographic_map":
                setDocForm(
                    <>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Tipo de documento</InputLabel>
                            <Select
                                size="small"
                                value={URL}
                                label="Tipo de documento"
                                MenuProps={MenuProps}
                                onChange={(e)=>{
                                    setURL(e.target.value)
                                    console.log(URL)
                                }}
                            >
                                <MenuItem value="geographic_map">Mapa Geográfico</MenuItem>
                                <MenuItem value="chorographic_map">Mapa Corográfico</MenuItem>
                                <MenuItem value="topographic_map">Mapa Topográfico</MenuItem>
                                <MenuItem value="topographic_plan">Planta Topográfica</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        <br/>
                        <form>
                            <TextField id="name" label="Nome" variant="outlined" 
                            onChange={(e)=>setName(e.target.value)}
                            size="small"/>
                            <br/>
                            <br/>
                            <TextField id="provider" label="Fornecedor" variant="outlined" 
                            style={{width: "35%"}}
                            onChange={(e)=>setProvider(e.target.value)}
                            size="small"/>
                            <br/>
                            <br/>
                            <TextField id="year" label="Ano" variant="outlined" 
                            onChange={(e)=>setTime(e.target.value)}
                            size="small"/>
                            <br/>
                            <br/>
                            <TextField id="link" label="URL" variant="outlined" 
                            onChange={(e)=>setLink(e.target.value)}
                            size="small"/>
                            <br/>
                            <br/>
                            <TextField id="link" label="Escala" variant="outlined" 
                            onChange={(e)=>setScale(e.target.value)}
                            size="small"/>
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
                            <TextField id="link" label="Resolução da Imagem" variant="outlined" 
                            onChange={(e)=>setRes(e.target.value)}
                            disabled={!raster}
                            size="small"/>
                            <br/>
                            <br/>   
                            <TextField id="link" label="Tipo de Geometria" variant="outlined" 
                            onChange={(e)=>setType(e.target.value)}
                            disabled={raster}
                            size="small"/>
                            <br/>
                            <br/>  
                            <TextField id="descrption" label="Descrição" variant="outlined" 
                            multiline
                            fullWidth
                            onChange={(e)=>setDesc(e.target.value)}
                            size="small"/>
                        </form>
                    </>
                );
                break;
            case "drawings":
                break;
            case "LiDAR":
                break;
            case "ortos":
                break;
            case "photography":
                break;
            case "reports":
                break;
            case "satellite_image":
                break;
            case "sensors":
                break;
            case "thematic_statistics":
                break;
            case "thematic_map":
                break;
            default:
                setDocForm("")
        }
    }

    const addDocument=(e)=> {
        allFormAppend()
        
        fetch("http://localhost:8080/"+ docType +"/add_document", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result);
            navigate(`/${result}/add/space`)
        });
    }

    return (
        <Container>
            <div style={{   
                margin: "auto",
                width: "18%",
                border: "1px solid black",
                background: "rgba(256, 256, 256, 0.92)",
                borderRadius: "20px",
                padding: "30px",
                position: "fixed",
                left: "20px"}}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Tipo de documento</InputLabel>
                    <Select
                        size="small"
                        value={docType}
                        label="Tipo de documento"
                        MenuProps={MenuProps}
                        onChange={(e)=>{
                            setDocType(e.target.value)
                            setFormulário()
                            console.log(docType)
                            console.log(docForm)
                        }}
                    >
                        <MenuItem value="generic">Documento genérico</MenuItem>
                        <MenuItem value="aerial_photography">Fotografia aérea</MenuItem>
                        <MenuItem value="geographic_map">Mapa de Base</MenuItem>
                        <MenuItem value="drawings">Desenho</MenuItem>
                        <MenuItem value="LiDAR">LiDAR</MenuItem>
                        <MenuItem value="ortos">Ortofotomapa</MenuItem>
                        <MenuItem value="photography">Ortofotomapa</MenuItem>
                        <MenuItem value="reports">Relatório</MenuItem>
                        <MenuItem value="satellite_image">Imagem satélite</MenuItem>
                        <MenuItem value="sensors">Sensores</MenuItem>
                        <MenuItem value="thematic_statistics">Estatísticas</MenuItem>
                        <MenuItem value="thematic_map">Mapa temático</MenuItem>
                    </Select>
                </FormControl>
                <br/>
                <br/>
                <br/>
                {docForm}
            </div>
        </Container>
    );
}