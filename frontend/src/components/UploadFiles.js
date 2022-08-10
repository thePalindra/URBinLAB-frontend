import React from 'react'
import { Container } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export default function DefaultFunction() {
    const [list, setList]=React.useState([]);
    var {id} = useParams()
    var allFiles = []

    const getSpace =(e)=> {
        var form = new FormData();

        
        fetch("http://localhost:8080/space/get_all_from_level", {
        }
    }

    function addFile(e) {
        allFiles.push(e.target.files)
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