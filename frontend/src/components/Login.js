import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Link } from '@mui/material';


export default function BasicTextFields() {
    let navigate = useNavigate()
    const [name, setName]=React.useState('');
    const [password, setPassword]=React.useState('');

    const login=(e)=> {
        window.localStorage.removeItem("token")
        e.preventDefault();
        var form = new FormData();
        form.append("name", name);
        form.append("password", password);
        
        fetch("http://localhost:8080/user/login", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            window.localStorage.setItem('token', result);
            navigate(`/add/document`)
        });
        
  };

  return (
      <Container>
            <form>
                <TextField id="username" label="Nome" variant="outlined" 
                style={{width: "60%"}}
                value = {name}
                onChange={(e)=>setName(e.target.value)}/>
                <br/>
                <br/>
                <TextField id="password" type = "password" label="Password" variant="outlined" 
                style={{width: "60%"}}
                value = {password}
                onChange={(e)=>setPassword(e.target.value)}/>
                <br/>
                <br/>
                <br/>
                <br/>
                <Button variant="contained" 
                style={{width: "40%", backgroundColor: "black"}}
                onClick={login}>Login</Button>
                <br/>
                <br/>
                <br/>
            </form>

            <div>
            <Link href="#" underline="hover">
            {'Registar-me!'}
            </Link>

            <Link href="#" underline="hover" style={{marginLeft:"15em"}}>
            {'Recuperar conta!'}
            </Link>
            </div>
      </Container>

  );
}
