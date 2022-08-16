import * as React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"

function circle(e) {
    let result =  ["CIRCLE","("+e.layer._latlng.lng, e.layer._latlng.lat+",", e.layer._mRadius+")"].join(" ")
    console.log(result)
    
    return result;
}

function point(e) {
    let result = ["POINT","(" + e.layer._latlng.lng, e.layer._latlng.lat + ")"].join(" ")
    console.log(result)
    return result;
}

function polygon(e) {
    let result = "POLYGON (("
    for (let i = 0; i < e.layer._latlngs[0].length; i++)
        result = [result + e.layer._latlngs[0][i].lng, e.layer._latlngs[0][i].lat + ","].join(" ")
    
    result = [result + e.layer._latlngs[0][0].lng, e.layer._latlngs[0][0].lat + "))"].join(" ")
    console.log(result)
    return result;
}

export default function DefaultFunction() {
    const position = [38.5, -16];
    let navigate = useNavigate()
    let {id} = useParams();
    const [distrito, setDistrito]=React.useState("");
    const [municipio, setMunicipio]=React.useState("");
    const [freguesia, setFreguesia]=React.useState("");
    const [level, setLevel]=React.useState(1);
    const [list, setList] = React.useState([]);
    let wkt = "new Wkt.Wkt();"
    

    function defaultFunc() {
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

    function searchByName(thisName) {
        let form = new FormData();
        form.append("level", level);
        form.append("name", thisName.charAt(0).toUpperCase() + thisName.slice(1))
            
        fetch("http://localhost:8080/space/search_by_name", {
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

    function getTheLevelBellow(thisName, auxLevel) {
        let form = new FormData();
        form.append("name", thisName.charAt(0).toUpperCase() + thisName.slice(1))
        form.append("level", auxLevel);
            
        fetch("http://localhost:8080/space/get_the_level_bellow", {
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

    function getEvrything(thisName) {
        let form = new FormData();
        form.append("name", thisName.charAt(0).toUpperCase() + thisName.slice(1))
            
        fetch("http://localhost:8080/space/get_everything", {
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

    const _created=e=> {
        console.log(e)
        let res = 0
        switch(e.layerType) {
            case "circle":
                res = circle(e)
                break;
            case "rectangle":
                res = polygon(e)
                break;
            case "marker":
                res = point(e)
                break;
            case "polygon":
                res = polygon(e)
                break;
            default:
                break;
        }
        wkt = res
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

        switch (level) {
            case 1:
                setFreguesia("")
                setMunicipio("")
                if (distrito==="") 
                    defaultFunc()
                else
                    searchByName(distrito)
                break;
            case 2:
                setFreguesia("")
                if (municipio==="" && distrito==="") 
                    defaultFunc()
                else if (distrito!=="")
                    getTheLevelBellow(distrito, 1)
                else
                    searchByName(municipio)
                break;      
            case 3:
                if (municipio==="" && distrito==="" && freguesia==="") 
                    defaultFunc()
                else if (municipio!=="")
                    getTheLevelBellow(municipio, 2)
                else if (distrito!=="")
                    getEvrything(distrito)
                else
                    searchByName(freguesia)
                break;
            default:
                break;
        }
    }

    const addSpace =(e)=> {
        let form = new FormData();
        form.append("document", id);
        form.append("space", wkt);
        console.log(wkt)
            
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
            <br/>
            <br/>
            <br/>
            <TextField id="distrito" label="Distrito" variant="outlined" 
                    style={{width: "50%"}}
                    onChange={(e)=>setDistrito(e.target.value)}
                    size="small"/>
            <br/>
            <br/>
            <TextField id="municipio" label="Município" variant="outlined" 
                    style={{width: "50%"}}
                    onChange={(e)=>setMunicipio(e.target.value)}
                    disabled={level < 2}
                    size="small"/>  
            <br/>
            <br/>
            <TextField id="freguesia" label="Freguesia" variant="outlined" 
                    style={{width: "50%"}}
                    onChange={(e)=>setFreguesia(e.target.value)}
                    disabled={level < 3}
                    size="small"/>
        </Container>
    </div>
    </>
    );
}

