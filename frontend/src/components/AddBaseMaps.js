import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function IsThis() {
    let navigate = useNavigate()
    const [name, setName]=React.useState('');
    const [desc, setDesc]=React.useState('');
    const [provider, setProvider]=React.useState('');
    const [time, setTime]=React.useState('');
    const [link, setLink]=React.useState('');
    const [scale, setScale]=React.useState('');
    const [raster, setRaster]=React.useState('');
    const [res, setRes]=React.useState('');
    const [type, setType]=React.useState('');
    const [url, setURL]=React.useState('geograp');

    


    const getGeoLink =(e)=> {
        setURL("/geographic_map")
    }

    const getChoroLink =(e)=> {
        setURL("/chorographic_map")
    }

    const getTopoMLink =(e)=> {
        setURL("/topographic_map")
    }

    const getTopoPLink =(e)=> {
        setURL("/topographic_plan")
    }
    

    const addstat=(e)=> {
        var form = new FormData();
        form.append("name", name);
        form.append("description", desc);
        form.append("provider", provider);
        form.append("timeScope", time+"/01/01");
        form.append("link", link);
        form.append("scale", scale)
        form.append("resolution", res)
        form.append("type", type)
        form.append("raster", raster)

        
        fetch("http://localhost:8080/"+ url +"/add_document", {
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
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Tipo de Mapa de Base</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
            >
                <FormControlLabel value="female" control={<Radio />} label="Mapa Geográfico" onClick={getGeoLink}/>
                <FormControlLabel value="male" control={<Radio />} label="Mapa Corográfico" onClick={getChoroLink}/>
                <FormControlLabel value="other" control={<Radio />} label="Mapa Topográfico" onClick={getTopoMLink}/>
                <FormControlLabel value="other2" control={<Radio />} label="Planta Topográfica" onClick={getTopoPLink}/>
            </RadioGroup>
        </FormControl>
        <br/>
        <br/>
        <form>
            <TextField id="name" label="Nome" variant="outlined" 
            style={{width: "50%"}}
            onChange={(e)=>setName(e.target.value)}/>
            <br/>
            <br/>
            <TextField id="provider" label="Fornecedor" variant="outlined" 
            style={{width: "50%"}}
            onChange={(e)=>setProvider(e.target.value)}/>
            <br/>
            <br/>
            <TextField id="year" label="Ano" variant="outlined" 
            style={{width: "20%"}}
            onChange={(e)=>setTime(e.target.value)}/>
            <br/>
            <br/>
            <TextField id="link" label="URL" variant="outlined" 
            style={{width: "50%"}}
            onChange={(e)=>setLink(e.target.value)}/>
            <br/>
            <br/>
            <TextField id="link" label="Escala" variant="outlined" 
            style={{width: "20%"}}
            onChange={(e)=>setScale(e.target.value)}/>
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
            style={{width: "50%"}}
            onChange={(e)=>setRes(e.target.value)}
            loading={raster}/>
            <br/>
            <br/>   
            <TextField id="link" label="Tipo de Geometria" variant="outlined" 
            style={{width: "50%"}}
            onChange={(e)=>setType(e.target.value)}
            loading={!raster}/>
            <br/>
            <br/>  
            <TextField id="descrption" label="Descrição" variant="outlined" 
            style={{width: "50%"}}
            multiline
            onChange={(e)=>setDesc(e.target.value)}/>       
            <br/>
            <br/>
            <br/>
            <Button variant="contained" 
            style={{width: "30%", backgroundColor: "black"}}
            onClick={addstat}>Definir espaço</Button>
            <br/>
        </form>
    </Container>
    );

}