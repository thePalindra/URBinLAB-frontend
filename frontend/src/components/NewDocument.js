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
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

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
    const [res, setRes]=React.useState('');    
    const [scale, setScale]=React.useState('');
    const [URL, setURL]=React.useState('geographic_map');
    const [raster, setRaster]=React.useState(true);
    const [docForm, setDocForm]=React.useState(
        <Container style={{
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
    const [list, setList]=React.useState([]);


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

    function allFormAppend() {
    
    }

    function setFormulário(dt) {
        switch(dt) {
            case "generic":
                setDocForm(
                    <Container style={{
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
                break;
            case "aerial_photography":
                setDocForm(
                    <Container style={{
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
                    </Container>
                );
                break;
            case "geographic_map":
                setDocForm(
                    <Container style={{
                        maxHeight: 480,
                        overflow: 'auto'
                        }}>
                        <br/>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Tipo de documento</InputLabel>
                            <Select
                                size="small"
                                value={URL}
                                label="Tipo de documento"
                                MenuProps={MenuProps}
                                onChange={(e)=>{
                                    setURL(e.target.value)
                                    console.log(e.target.value)
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
                                label="Escala" 
                                variant="outlined" 
                                onChange={(e)=>setScale(e.target.value)}
                                size="small"
                            />
                            <br/>
                            <br/>  
                            </form>
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
                            <form style={{
                                float:"left"
                                }}
                            >
                            <br/>
                            <br/>     
                            <TextField
                                id="link" 
                                label="Resolução da Imagem" 
                                variant="outlined" 
                                onChange={(e)=>setRes(e.target.value)}
                                disabled={!raster}
                                size="small"
                            />
                            <br/>
                            <br/>   
                            <TextField 
                                id="link" 
                                label="Tipo de Geometria" 
                                variant="outlined" 
                                onChange={(e)=>setType(e.target.value)}
                                disabled={raster}
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
                break;
            case "drawings":
                setDocForm(
                    <Container style={{
                        maxHeight: 400,
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
                                id="link" 
                                label="Contexto" 
                                variant="outlined" 
                                onChange={(e)=>setContext(e.target.value)}
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
                break;
            case "LiDAR":
                setDocForm(
                    <Container style={{
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
                                size="small"/>
                            <br/>
                            <br/>
                            <TextField 
                                id="provider" 
                                label="Fornecedor" 
                                variant="outlined" 
                                onChange={(e)=>setProvider(e.target.value)}
                                size="small"/>
                            <br/>
                            <br/>
                            <TextField 
                                id="year" 
                                label="Ano" 
                                variant="outlined" 
                                onChange={(e)=>setTime(e.target.value)}
                                size="small"/>
                            <br/>
                            <br/>
                            <TextField 
                                id="link" 
                                label="URL" 
                                variant="outlined" 
                                onChange={(e)=>setLink(e.target.value)}
                                size="small"/>
                            <br/>
                            <br/>      
                            <TextField 
                                id="link" 
                                label="Resolução da Imagem" 
                                variant="outlined" 
                                onChange={(e)=>setRes(e.target.value)}
                                size="small"/>
                            <br/>
                            <br/>
                            <TextField 
                                id="descrption" 
                                label="Descrição" 
                                variant="outlined" 
                                multiline
                                fullWidth
                                onChange={(e)=>setDesc(e.target.value)}
                                size="small"/>   
                            </form>
                        </Container>
                );
                break;
            case "ortos":
                setDocForm(
                    <Container style={{
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
                                id="link" 
                                label="Escala" 
                                variant="outlined" 
                                onChange={(e)=>setScale(e.target.value)}
                                size="small"
                            />
                            <br/>
                            <br/>
                            <TextField 
                                id="link" 
                                label="Resolução" 
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
                    </Container>
                );
                break;
            case "photography":
                setDocForm(
                    <Container style={{
                        maxHeight: 500,
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
                            <Switch
                                checked={color}
                                onChange={() => setColor(!color)}
                                name="A cores"
                                color="primary"
                            />
                            <br/>
                            <br/>    
                            <TextField 
                                id="link" 
                                label="Resolução" 
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
                                fullWidth
                                multiline
                                onChange={(e)=>setDesc(e.target.value)}
                                size="small"
                            />   
                        </form>
                    </Container>
                );
                break;
            case "reports":
                setDocForm(
                    <Container style={{
                        maxHeight: 500,
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
                                id="link" 
                                label="Contexto" 
                                variant="outlined" 
                                size="small"
                                onChange={(e)=>setContext(e.target.value)}
                            />
                            <br/>
                            <br/>    
                            <TextField 
                                id="link" 
                                label="Tema" 
                                variant="outlined" 
                                onChange={(e)=>setTheme(e.target.value)}
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
                break;
            case "satellite_image":
                setDocForm(
                    <Container style={{
                        maxHeight: 500,
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
                                id="link" 
                                label="Resolução da Imagem" 
                                variant="outlined" 
                                onChange={(e)=>setRes(e.target.value)}
                                size="small"
                            />
                            <br/>
                            <br/>
                            <TextField 
                                id="link" 
                                label="Nome do Satélite" 
                                variant="outlined" 
                                onChange={(e)=>setSatellite(e.target.value)}
                                size="small"
                            />
                            <br/>
                            <br/>
                            <TextField 
                                id="descrption" 
                                label="Descrição" 
                                variant="outlined" 
                                size="small"
                                multiline
                                fullWidth
                                onChange={(e)=>setDesc(e.target.value)}
                            />   
                            </form>
                            </Container>
                );
                break;
            case "sensors":
                setDocForm(
                    <Container style={{
                        maxHeight: 500,
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
                                id="var" 
                                label="Variável medida" 
                                variant="outlined" 
                                onChange={(e)=>setVariable(e.target.value)}
                                size="small"
                            />
                            <br/>
                            <br/>       
                            <TextField 
                                id="descrption"
                                label="Descrição" 
                                variant="outlined" 
                                size="small"
                                multiline
                                fullWidth
                                onChange={(e)=>setDesc(e.target.value)}
                            />      
                        </form>
                    </Container>
                );
                break;
            case "thematic_statistics":
                setDocForm(
                    <Container style={{
                        maxHeight: 500,
                        overflow: 'auto'
                    }}>
                        <br/>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Tipo de documento</InputLabel>
                            <Select
                                size="small"
                                value={URL}
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
                                label="Tema" 
                                variant="outlined" 
                                onChange={(e)=>setTheme(e.target.value)}
                                size="small"
                            />
                            <br/>
                            <br/>      
                            <TextField 
                                id="descrption" 
                                label="Descrição" 
                                variant="outlined" 
                                fullWidth
                                multiline
                                onChange={(e)=>setDesc(e.target.value)}
                                size="small"
                            />
                        </form>
                    </Container>
                );
                break;
            case "thematic_map":
                setDocForm(
                    <Container style={{
                        maxHeight: 500,
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
                                id="link" 
                                label="Escala" 
                                variant="outlined" 
                                onChange={(e)=>setScale(e.target.value)}
                                size="small"
                            />
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
                            <TextField 
                                id="link" 
                                label="Resolução da Imagem" 
                                variant="outlined" 
                                onChange={(e)=>setRes(e.target.value)}
                                size="small"
                                disabled={!raster}
                            />
                            <br/>
                            <br/>   
                            <TextField 
                                id="link" 
                                label="Tipo de Geometria"
                                variant="outlined" 
                                size="small"
                                onChange={(e)=>setType(e.target.value)}
                                disabled={raster}
                            />
                            <br/>
                            <br/>  
                            <TextField 
                                id="link" 
                                label="Tema" 
                                variant="outlined" 
                                style={{width: "35%"}}
                                size="small"
                                onChange={(e)=>setTheme(e.target.value)}
                            />
                            <br/>
                            <br/> 
                            <TextField 
                                id="link" 
                                label="Tipo de Mapa Temático" 
                                variant="outlined" 
                                onChange={(e)=>setMapType(e.target.value)}
                            />
                            <br/>
                            <br/> 
                            <TextField 
                                id="descrption" 
                                label="Descrição" 
                                variant="outlined" 
                                size="small"
                                fullWidth
                                multiline
                                onChange={(e)=>setDesc(e.target.value)}
                            />   
                        </form>
                    </Container>
                );
                break;
            default:
                break;
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
                width: "22%",
                border: "1px solid black",
                background: "rgba(256, 256, 256, 0.92)",
                borderRadius: "20px",
                padding: "10px",
                position: "fixed",
                left: "20px"}}>
                <br/>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Tipo de documento</InputLabel>
                    <Select
                        size="small"
                        value={docType}
                        label="Tipo de documento"
                        MenuProps={MenuProps}
                        onChange={(e)=>{
                            setDocType(e.target.value)
                            setFormulário(e.target.value)
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
                        <MenuItem value="photography">Fotografia</MenuItem>
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
                <br/>
            </div>
            <div style={{   
                margin: "auto",
                padding: "10px",
                position: "fixed",
                left: "25%"}}>

                <div style={{   
                margin: "auto",
                width: "30%",
                border: "1px solid black",
                background: "rgba(256, 256, 256, 0.92)",
                borderRadius: "20px",
                padding: "10px",
                position: "fixed"}}>
                    Form espacial
                </div>
                <br/>
                <br/>
                <br/>
                <div style={{   
                margin: "auto",
                width: "30%",
                border: "1px solid black",
                background: "rgba(256, 256, 256, 0.92)",
                borderRadius: "20px",
                padding: "10px",
                position: "fixed"}}>
                    <Container>
                        <Button
                        variant="contained"
                        component="label"
                        >
                        Upload
                        <input
                            type="file"
                            hidden
                            multiple
                            onChange={(e)=> {
                                addFile(e);
                            }}
                        />
                        </Button>
                        <br/>
                        <div style={{   margin: "auto",
                                        width: "90%",
                                        borderRadius: "20px",
                                        padding: "30px"}}>
                            <List 
                                fullWidth
                                style={{
                                    maxHeight: 300,
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
                                            <DeleteIcon />
                                        </IconButton>
                                        }
                                        > 
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                        primary={doc.name} secundary={doc.size}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </div>      
                    </Container>

                </div>
            </div>
            
        </Container>
    );
}