import React from 'react'
import { Container } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';

export default function DefaultFunction() {
    const [list, setList]=React.useState([]);
    var {id} = useParams()
    var navigate = useNavigate()
    var allFiles = 0

    const upload =(e)=> {
        
        var form = new FormData();
        form.append("file", allFiles)
        form.append("document", id)
        form.append("file", allFiles.name)
        form.append("format", allFiles.type)

        fetch("http://localhost:8080/file/add", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            navigate(`/${id}/document`)
        })
    }

    function addFile(e) {
        allFiles=e.target.files[0]
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
            {list}
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