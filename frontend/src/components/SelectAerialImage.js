import * as React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";

export default function SelectType() {
    let getStallite = useNavigate()
    let getLidar = useNavigate()
    let getPhotography = useNavigate()
    let getOrto = useNavigate()


    const satellite =(e)=> {
        getStallite(`/satellite`)
    }

    const lidar =(e)=> {
        getLidar(`/lidar`)
    }

    const photography =(e)=> {
        getPhotography(`/aerial_photography`)
    }

    const ortos =(e)=> {
        getOrto(`/ortos`)
    }
    
    return (
        <Container>
            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black", marginRight: "80px"}}
                    onClick={satellite}>Imagens Satélite</Button>

            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black"}}
                    onClick={lidar}>LiDAR</Button>

            <br/>
            <br/>
            <br/>
            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black", marginRight: "80px"}}
                    onClick={photography}>Fotografias Aéreas</Button>

            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black"}}
                    onClick={ortos}>Ortofotomapas</Button>
        </Container>
    );
}