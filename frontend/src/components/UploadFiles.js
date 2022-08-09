import React from 'react'
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export default function DefaultFunction() {
    const [list, setList]=React.useState([]);
    var allFiles = []

    function addFile(e) {
        allFiles.push(e.target.files)
        console.log(allFiles)
        setList(allFiles.map(doc => (
            <ListItemButton key={doc[0].name} style={{width: "60%"}}>
                <ListItemText primary={doc[0].name} />
            </ListItemButton>
        )))  
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

            >
            Confirmar
            </Button>       
        </Container>
    );
}