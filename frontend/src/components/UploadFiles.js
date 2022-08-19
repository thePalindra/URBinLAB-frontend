import React from 'react'
import { Container } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';

export default function DefaultFunction() {
    const [list, setList]=React.useState([]);
    let {id} = useParams()
    let navigate = useNavigate()
    
    const upload =(e)=> {
        for (let i = 0; i<list.length; i++) {
            let form = new FormData();
            form.append("file", list[i])
            form.append("document", id)

            fetch("http://localhost:8080/file/add", {
                method: "POST",
                headers: window.localStorage,
                body: form
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)
            })
        }        
        
    }

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

    return (
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
                            width: "50%",
                            borderRadius: "20px",
                            padding: "30px"}}>
            <List>
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
            <br/>
            <br/>
            <Button
            variant="contained"
            component="label"
            style={{width: "40%", backgroundColor: "black"}}   
            onClick={upload}
            disabeld={list.length<1}
            >
            Confirmar
            </Button>       
        </Container>
    );
}