import * as React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup } from 'react-leaflet'
import * as Wkt from "wicket"
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"

function circle(e) {
    let result =  ["CIRCLE","("+e.layer._latlng.lat, e.layer._latlng.lng+",", e.layer._mRadius+")"].join(" ")
    console.log(result)
    
    return result;
}

function rectangle(e) {
    let result = ["BOX","(" + e.layer._bounds._southWest.lat
                , e.layer._bounds._northEast.lng+"," + e.layer._bounds._northEast.lat,
                e.layer._bounds._southWest.lng + ")"].join(" ")
    console.log(result)
    return result;
}

function point(e) {
    let result = ["POINT","(" + e.layer._latlng.lat, e.layer._latlng.lng + ")"].join(" ")
    console.log(result)
    return result;
}

function polygon(e) {
    let result = "POLYGON (("
    for (let i = 0; i < e.layer._latlngs[0].length; i++)
        result = [result + e.layer._latlngs[0][i].lat, e.layer._latlngs[0][i].lng + ","].join(" ")
    
    result = [result + e.layer._latlngs[0][0].lat, e.layer._latlngs[0][0].lng + "))"].join(" ")
    console.log(result)
    return result;
}

export default function DefaultFunction() {
    const position = [38.5, -16];
    let navigate = useNavigate()
    let {id} = useParams();
    const [level, setLevel]=React.useState(1);
    const [list, setList] = React.useState([]);
    const [wtk, setWtk] = React.useState(false);
    let wkt = "new Wkt.Wkt();"
    let size = 0

    const _created=e=> {
        console.log(e)
        let res = 0
        switch(e.layerType) {
            case "circle":
                res = circle(e)
                break;
            case "rectangle":
                res = rectangle(e)
                break;
            case "marker":
                res = point(e)
                break;
            case "polygon":
                res = polygon(e)
                break;
        }
        wkt = res
        console.log(wkt)
        size++
    }

    function attachspace(setId) {
        let form = new FormData();
        form.append("id", setId);
        form.append("document", id);

        fetch("http://localhost:8080/space/attach", {
            method: "POST",
            headers: window.localStorage,
            body: form
            })
        .then(res=>res.json())
        .then(result=>{
            navigate(`/${id}/upload/files`)
        })
    }

    const getSpace =(e)=> {
        let form = new FormData();
        form.append("level", level);
            
        fetch("http://localhost:8080/space/get_all_from_level", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)

            let parse = require('wellknown');
                
            setList(result.map(doc => (
                <GeoJSON key={doc[0]} data={parse(doc[1])}>
                    <Popup>
                        
                        <ListItem>
                            <ListItemAvatar>
                                
                            </ListItemAvatar>
                            <ListItemText primary={doc[2]} />
                        </ListItem>
                        <Button variant="contained" 
                            style={{backgroundColor: "black"}}
                            onClick={()=> attachspace(doc[0])}> Confirmar localização </Button>
                    </Popup>
                </GeoJSON>
            )))
        });
    }

    const addSpace =(e)=> {
        let form = new FormData();
        form.append("document", id);
        form.append("space", wkt);
            
        fetch("http://localhost:8080/space/add", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)

            navigate(`/${id}/upload/files`)
        });
    }

    return (
    <>
    <div style={{   margin: "auto",
                            width: "60%",
                            border: "1px solid black",
                            background: "rgba(256, 256, 256, 0.92)",
                            borderRadius: "20px",
                            padding: "30px",
                            position: "fixed",
                            right: "20px"}}>
        <Button variant="contained" 
                      style={{backgroundColor: "black"}}
                      onClick={addSpace}> Adicionar espaço </Button>
        <br/>
        <br/>
        <MapContainer style={{width: "100%"}} center={position} zoom={6} scrollWheelZoom={true} minZoom={4}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FeatureGroup>
                <EditControl position="topright"
                onCreated={_created}
                draw= {{
                    circlemarker: false,
                    polyline: false
                }}/>
            </FeatureGroup>       
            {list}
        </MapContainer>   
      </div> 

      <div style={{   margin: "auto",
      width: "30%",
      border: "1px solid black",
      background: "rgba(256, 256, 256, 0.92)",
      borderRadius: "20px",
      padding: "30px",
      position: "fixed",
      left: "20px"}}>
          <Container>
              <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">Tipo de Estatística</FormLabel>
                  <RadioGroup
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="female"
                      name="radio-buttons-group"
                  >
                      <FormControlLabel value="female" control={<Radio />} label="Distritos" onClick={(e)=>setLevel(1)}/>
                      <FormControlLabel value="male" control={<Radio />} label="Municípios" onClick={(e)=>setLevel(2)}/>
                      <FormControlLabel value="other" control={<Radio />} label="Freguesias" onClick={(e)=>setLevel(3)}/>
                      <Button variant="contained" 
                      style={{backgroundColor: "grey"}}
                      onClick={getSpace}></Button>
                </RadioGroup>
            </FormControl>
        </Container>
    </div>
    </>
    );
}

