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
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet'

export default function DefaultFunction() {
    const position = [38.5, -16];
    let navigate = useNavigate()
    let {id} = useParams();
    const [level, setLevel]=React.useState(1);
    const [list, setList] = React.useState([]);
    const [spaceId, setSpaceId]=React.useState('');


    function attachspace(setId) {
        var form = new FormData();
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
      var form = new FormData();
      form.append("level", level);
      
      fetch("http://localhost:8080/space/get_all_from_level", {
          method: "POST",
          headers: window.localStorage,
          body: form
      })
      .then(res=>res.json())
      .then(result=>{
        console.log(result)

        var parse = require('wellknown');
        
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
        <MapContainer style={{width: "100%"}} center={position} zoom={6} scrollWheelZoom={true} minZoom={4}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
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

