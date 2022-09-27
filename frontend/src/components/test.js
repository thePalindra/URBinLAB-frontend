import * as React from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
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
import { ImageOverlay } from 'react-leaflet/ImageOverlay'

export default function Testing() {
    const position = [0, 0];
    const [bounding, SetBounding] = React.useState([[0, 0],[2, 2]]);
    const [file, setFile] = React.useState()
    const [aux, setAux] = React.useState()
    const [urls, setURL] = React.useState("D:\\Portugal\\Ortos_10k_(2005)\\jpg\\001A-jpg")
    
    return (
        <>
            <Button 
                variant="contained"
                style={{backgroundColor: "black",
                        marginRight: "200px"}}>Things</Button>
            <br/>
            <br/>
            <input type="file" onChange={(e)=>{
                setFile(e.target.files[0])
                setAux(e.target.files[1])
                let binaryData = [];
                binaryData.push(file);
                setURL(URL.createObjectURL(new Blob(binaryData)));
                console.log(urls)
                }} multiple/>
            <MapContainer style={{width: "100%"}} center={position} zoom={6} scrollWheelZoom={true} minZoom={4}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />   
                <FeatureGroup>
                    <ImageOverlay 
                        url={urls}
                        bounds={bounding}/>
                </FeatureGroup>   
            </MapContainer>   
            
        </>
    )
}