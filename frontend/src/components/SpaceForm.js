import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


export default function Signup() {
    let navigate = useNavigate()
    const [level, setLevel]=React.useState(1);
    const [name, setName]=React.useState('');
    const [button, setButton]=React.useState('Pesquisar');

    const timer =(e)=> {
        if (button === "Pesquisar") {
            setTimeout(function () {
                setButton("Confirmar")
            }, 2000);
        } else {
            navigate(`1/add/files`)
        }
    }

    return (
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
                    style={{backgroundColor: "grey"}}></Button>
                </RadioGroup>
            </FormControl>
            <form>
                <br/>
                <br/>
                <TextField id="name" label="Nome" variant="outlined" 
                style={{width: "60%"}}
                value = {name}
                onChange={(e)=>setName(e.target.value)}/>
                <br/>
                <br/>
                <br/>
                <br/>
                <Button variant="contained" 
                style={{width: "40%", backgroundColor: "black"}}
                onClick={timer}
                >{button}</Button>
                <br/>
                <br/>
                <br/>
            </form>
        </Container>

    );
}
