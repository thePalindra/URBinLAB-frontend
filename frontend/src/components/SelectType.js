import * as React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";

export default function SelectType() {
    let getGeneric = useNavigate()
    let getcartography = useNavigate()
    let getAerialImage = useNavigate()
    let getStatistics = useNavigate()
    let getSensors = useNavigate()
    let getDrawings = useNavigate()
    let getReports = useNavigate()
    let getPhotography = useNavigate()

    const generic =(e)=> {
        getGeneric(`/generic`)
    }

    const cartography =(e)=> {
        getcartography(`/cartography`)
    }
    
    const aerialImage =(e)=> {
        getAerialImage(`/aerial_image`)
    }

    const statistics =(e)=> {
        getStatistics(`/statistics`)
    }

    const sensors =(e)=> {
        getSensors(`/sensors`)
    }

    const drawings =(e)=> {
        getDrawings(`/drawings`)
    }

    const reports =(e)=> {
        getReports(`/reports`)
    }

    const photography =(e)=> {
        getPhotography(`/photography`)
    }

    return (
        <Container>
            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black", marginRight: "80px"}}
                    onClick={generic}>Documento Genérico</Button>

            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black"}}
                    onClick={cartography}>Cartografia</Button>

            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black", marginLeft: "80px"}}
                    onClick={aerialImage}>Imagem Aérea</Button>

            <br/>
            <br/>

            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black", marginRight: "80px"}}
                    onClick={statistics}>Estatísticas</Button>

            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black"}}
                    onClick={sensors}>Outros Sensores</Button>

            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black", marginLeft: "80px"}}
                    onClick={drawings}>Desenhos</Button>

            <br/>
            <br/>

            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black"}}
                    onClick={reports}>Relatórios</Button>

            <Button variant="contained" 
                    style={{width: "15%", backgroundColor: "black", marginLeft: "80px"}}
                    onClick={photography}>Outras Fotografias</Button>
            
        </Container>
    );
}