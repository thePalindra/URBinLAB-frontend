import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function IsThis() {
    let navigate = useNavigate()
    const [name, setName]=React.useState('');
    const [desc, setDesc]=React.useState('');
    const [provider, setProvider]=React.useState('');
    const [time, setTime]=React.useState('');
    const [link, setLink]=React.useState('');
    const [res, setRes]=React.useState('');
    const [scale, setScale]=React.useState('');

    const addstat=(e)=> {
        var form = new FormData();
        form.append("name", name);
        form.append("description", desc);
        form.append("provider", provider);
        form.append("timeScope", time+"/01/01");
        form.append("link", link);
        form.append("resolution", res)
        form.append("scale", scale)

        
        fetch("http://localhost:8080/aerial_photography/add_document", {
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
            <TextField id="link" label="Escala aproximada" variant="outlined" 
            style={{width: "30%"}}
            onChange={(e)=>setScale(e.target.value)}/>
            <br/>
            <br/>
            <TextField id="link" label="Resolução de Imagem" variant="outlined" 
            style={{width: "50%"}}
            onChange={(e)=>setRes(e.target.value)}/>
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