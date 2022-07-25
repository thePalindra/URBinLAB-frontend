import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {  useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function FormPropsTextFields() {
    let navigate = useNavigate();
    let { id } = useParams();
    const [doc, setDoc] = React.useState("")
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [provider, setProvider] = React.useState("")
    const [locationName, setLocationName] = React.useState("")
    const [type, setType] = React.useState("")
    var form = new FormData();
    
    form.append("id", id)

    function nameChanger (e) {
        if (e.target.value === "")
            setName(doc.name)
        else 
            setName(e.target.value)
        console.log(name)
    }

    function descriptionChanger (e) {
        if (e.target.value === "")
            setDescription(doc.description)
        else 
            setDescription(e.target.value)
        console.log(description)
    }
    
    function providerChanger (e) {
        if (e.target.value === "")
            setProvider(doc.provider)
        else 
            setProvider(e.target.value)
        console.log(provider)
    }

    function locationNameChanger (e) {
        if (e.target.value === "")
            setLocationName(doc.locationName)
        else 
            setLocationName(e.target.value)
        console.log(locationName)
    }

    function typeChanger (e) {
        if (e.target.value === "")
            setType(doc.spaceName)
        else 
            setType(e.target.value)
        console.log(type)
    }

    React.useEffect(() => { 
        fetch("http://localhost:8080/document/get/one/by/id",{
                method: "POST",
                body:form
            })
            .then(res=>res.json())
            .then((result)=>{
                console.log(result)
                setDoc(result)
                setName(result.name)
                setDescription(result.description)
                setProvider(result.provider)
                setLocationName(result.spaceName)
                setType(result.type)
            })
    }, []);

    const editDocument =()=>{
        form.append("name", name)
        form.append("description", description)
        form.append("type", type)
        form.append("provider", provider)
        form.append("start", new Date())
        form.append("end", new Date())
        form.append("spaceName", locationName)
        form.append("spaceTye", null)
        form.append("flag", true)
        
        fetch("http://localhost:8080/document/update",{
            method: "POST",
            body:form
        }).then(res=>res.json())
        .then((result)=>{
            console.log(result)
            navigate(`/`)
        })
    }

    return (
        <>
        <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        >
        <br/>
        <br/>
        <br/>

        <div style={{display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'}}>
        <List sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
        }} component="nav" aria-label="mailbox folders">
            <ListItem divider>
                <ListItemText primary="Nome" secondary={doc.name}/>
            </ListItem>
            <ListItem divider>
                <ListItemText primary="Descrição" secondary={doc.description}/>
            </ListItem>
            <ListItem divider>
                <ListItemText primary="Fornecedor" secondary={doc.provider}/>
            </ListItem>
            <ListItem divider>
                <ListItemText primary="Localização" secondary={doc.spaceName}/>
            </ListItem>
            <ListItem divider>
                <ListItemText primary="Tipo de documento" secondary={doc.type}/>
            </ListItem>
        </List>
        </div>
        <br/>
        <br/>
        <div>
            <TextField
            id="name"
            label="Nome"
            defaultValue={doc.name}
            onChange={nameChanger}
            />
            <br/>
            <TextField
            id="description"
            label="Descrição"
            defaultValue={doc.description}
            onChange={descriptionChanger}
            />
            <br/>
            <TextField
            id="provider"
            label="Fornecedor"
            defaultValue={doc.name}
            onChange={providerChanger}
            />
            <br/>
            <TextField
            id="spaceName"
            label="Localização"
            defaultValue={doc.spaceName}
            onChange={locationNameChanger}
            />
            <br/>
            <TextField
            id="type"
            label="Tipo de Documento"
            defaultValue={doc.type}
            onChange={typeChanger}
            />
            <br/>
            {/*<TextField id="outlined-search" label="Search field" type="search" />*/}
            <br/>
            <Button variant="contained" onClick={editDocument}>Editar</Button>
        </div>
        </Box>
        </>
    );
}