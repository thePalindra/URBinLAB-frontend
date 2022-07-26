import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Link } from '@mui/material';


export default function Signup() {
    let navigate = useNavigate()
    const [name, setName]=React.useState('');
    const [email, setEmail]=React.useState('');
    const [password, setPassword]=React.useState('');
    const [confirm, setConfirm]=React.useState('');

    const signup=(e)=> {
        if (confirm === password) {

            window.localStorage.removeItem("token")
            e.preventDefault();
            var form = new FormData();
            form.append("name", name);
            form.append("password", password);
            form.append("email", email);
            
            fetch("http://localhost:8080/user/signup", {
                method: "POST",
                headers: window.localStorage,
                body: form
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result);
                navigate(`/login`);
            });
        }
        console.log("wrong confirmation")
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
                <TextField id="email" label="Email" variant="outlined" 
                style={{width: "60%"}}
                value = {email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <br/>
                <br/>
                <TextField id="password" type = "password" label="Password" variant="outlined" 
                style={{width: "60%"}}
                value = {password}
                onChange={(e)=>setPassword(e.target.value)}/>
                <br/>
                <br/>
                <TextField id="confirmation" type = "password" label="Confirmação" variant="outlined" 
                style={{width: "60%"}}
                value = {confirm}
                onChange={(e)=>setConfirm(e.target.value)}/>
                <br/>
                <br/>
                <br/>
                <br/>
                <Button variant="contained" 
                style={{width: "40%", backgroundColor: "black"}}
                onClick={signup}>Sign Up</Button>
                <br/>
                <br/>
                <br/>
            </form>

            <div>
                <Link href="#" underline="hover" onClick={navigate(`/login`)}>
                {'Fazer Login!'}
                </Link>

                <Link href="#" underline="hover" style={{marginLeft:"15em"}}>
                {'Recuperar conta!'}
                </Link>
            </div>
      </Container>

  );
}
