import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';

export default function BasicTextFields() {
    const [name, setName]=React.useState('');
    const [password, setPassword]=React.useState('');
    const login=(e)=> {
        e.preventDefault();
        const researcher = {name, password}
        fetch("http://localhost:8080/user/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"}, 
            body:JSON.stringify(researcher)
        })
        .then(res=>res.json())
        .then((result)=>{
            console.log(result)
        })
  };
  return (
      <Container>
          <div>
              <form>
                  <TextField id="username" label="Nome" variant="outlined" value = {name}
                  onChange={(e)=>setName(e.target.value)}/>
                      <br></br>
                  <TextField id="password" type = "password" label="Password" variant="outlined" value = {password}
                  onChange={(e)=>setPassword(e.target.value)}/>
                      <br></br>
                  <Button variant="contained" onClick={login}>Login</Button>
              </form>
          </div>
      </Container>

  );
}
