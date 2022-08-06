import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import { useNavigate } from "react-router-dom";


export default function Addreports() {
    let navigate = useNavigate()
    const [name, setName]=React.useState('');
    const [desc, setDesc]=React.useState('');
    const [provider, setProvider]=React.useState('');
    const [time, setTime]=React.useState('');
    const [link, setLink]=React.useState('');
    const [context, setContext]=React.useState('');
    const [theme, setTheme]=React.useState('');

    const addDocument=(e)=> {
        var form = new FormData();
        form.append("name", name);
        form.append("description", desc);
        form.append("provider", provider);
        form.append("timeScope", time+"/01/01");
        form.append("link", link);
        form.append("context", context);
        form.append("theme", theme)

        
        fetch("http://localhost:8080/reports/add_document", {
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
                    <TextField id="link" label="Contexto" variant="outlined" 
                    style={{width: "35%"}}
                    size="small"
                    onChange={(e)=>setContext(e.target.value)}/>
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
                    onClick={addDocument}>Definir espaço</Button>
                    <br/>
                </form>
        </Container>
    );
}