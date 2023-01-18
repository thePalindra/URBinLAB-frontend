import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Link } from '@mui/material';


export default function BasicTextFields() {
    let navigate = useNavigate();
    let navigate2 = useNavigate();
    const [name, setName]=React.useState('');
    const [password, setPassword]=React.useState('');

    React.useEffect(() => {
        const start = async () => {
            let ignore = false
            if (!ignore) {
                await check_token("A");
                window.localStorage.removeItem("token")
            }
            return () => { ignore = true; }
        }
        start()
    },[]);

    const login=(e)=> {
        window.localStorage.removeItem("token")
        e.preventDefault();
        let form = new FormData();
        form.append("name", name);
        form.append("password", password);
        
        fetch("http://main-backend:5050/user/login", {
            method: "POST",
            
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            const temp = JSON.stringify(result)
            console.log(temp)
            window.localStorage.setItem('token', temp);
            navigate(`/`)
        });
        
    };

    const register=(e)=> {
        navigate2(`/signup`)
    }

    async function check_token(type) {
        let form = new FormData();
        form.append("type", type)

        let res = await fetch("http://main-backend:5050/token/check", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })

        return res.ok
    }

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
            <Link href="" underline="hover" onClick={register}>
            {'Registar-me!'}
            </Link>

            <Link href="" underline="hover" style={{marginLeft:"15em"}}>
            {'Recuperar conta!'}
            </Link>
            </div>
        </Container>

    );
}
