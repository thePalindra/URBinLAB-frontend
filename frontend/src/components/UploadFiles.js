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
    const [list, setList]=React.useState("");
    var {id} = useParams()
    var navigate = useNavigate()
    const allFiles = []

    const upload =(e)=> {
        console.log(allFiles.length)
        for (var i = 0; i<allFiles.length; i++) {
            console.log("here")
            var form = new FormData();
            form.append("file", allFiles[i])
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
        console.log(e.target.files)
        var aux = []
        for (var i = 0; i<e.target.files.length; i++) {
            allFiles.push(e.target.files[i])
            aux.push(e.target.files[i])
        }
        

        console.log(list)
        console.log(allFiles)
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
                {list}
            </List>
            </div>
            <br/>
            <br/>
            <Button
            variant="contained"
            component="label"
            style={{width: "40%", backgroundColor: "black"}}   
            onClick={upload}
            >
            Confirmar
            </Button>       
        </Container>
    );
}