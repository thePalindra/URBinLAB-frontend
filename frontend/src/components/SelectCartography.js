import * as React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";

export default function SelectType() {
    let getBase = useNavigate()
    let getThematic = useNavigate()


    const base =(e)=> {
        getBase(`/base`)
    }

    const thematicMap =(e)=> {
        getThematic(`/thematic_map`)
    }
    
    return (
        <Container>
            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black", marginRight: "80px"}}
                    onClick={thematicMap}>Mapas Temáticos</Button>

            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black"}}
                    onClick={base}>Mapas de Base</Button>
        </Container>
    );
}