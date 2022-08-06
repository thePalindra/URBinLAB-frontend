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


export default function Addstatistics() {
    let navigate = useNavigate()
    const [name, setName]=React.useState('');
    const [desc, setDesc]=React.useState('');
    const [provider, setProvider]=React.useState('');
    const [time, setTime]=React.useState('');
    const [link, setLink]=React.useState('');
    const [theme, setTheme]=React.useState('');
    const [url, setURL]=React.useState('thematic_statistics');

    const getThematicLink=(e)=> { 
        setURL("thematic_statistics")
    }

    const getCensusLink=(e)=> { 
        setURL("census")
    }

    const getSurveyLink=(e)=> { 
        setURL("surveys")
    }

    const addstat=(e)=> {
        var form = new FormData();
        form.append("name", name);
        form.append("description", desc);
        form.append("provider", provider);
        form.append("timeScope", time+"/01/01");
        form.append("link", link);
        form.append("theme", theme)

        
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
                <FormLabel id="demo-radio-buttons-group-label">Tipo de Estatística</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="female" control={<Radio />} label="Estatística temática" onClick={getThematicLink}/>
                    <FormControlLabel value="male" control={<Radio />} label="Censos" onClick={getCensusLink}/>
                    <FormControlLabel value="other" control={<Radio />} label="Inquérito" onClick={getSurveyLink}/>
                </RadioGroup>
            </FormControl>
            <br/>
            <br/>
                <form>
                    <TextField id="name" label="Nome" variant="outlined" 
                    style={{width: "35%"}}
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
                    style={{width: "20%"}}
                    onChange={(e)=>setTime(e.target.value)}
                    size="small"/>
                    <br/>
                    <br/>
                    <TextField id="link" label="URL" variant="outlined" 
                    style={{width: "35%"}}
                    onChange={(e)=>setLink(e.target.value)}
                    size="small"/>
                    <br/>
                    <br/>
                    <TextField id="link" label="Tema" variant="outlined" 
                    style={{width: "35%"}}
                    onChange={(e)=>setTheme(e.target.value)}
                    size="small"/>
                    <br/>
                    <br/>      
                    <TextField id="descrption" label="Descrição" variant="outlined" 
                    style={{width: "50%"}}
                    multiline
                    onChange={(e)=>setDesc(e.target.value)}
                    size="small"/>       
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