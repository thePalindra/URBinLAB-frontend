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

    async function check_token(type) {
        let form = new FormData();
        form.append("type", type)
        form.append("token", window.localStorage.getItem("token"))
        let res = await fetch("http://urbingeo.fa.ulisboa.pt:8080/token/check", {
            method: "POST",
            body: form
        })

        return res.ok
    }

    const signup=(e)=> {
        if (confirm === password) {

            window.localStorage.removeItem("token")
            e.preventDefault();
            let form = new FormData();
            form.append("name", name);
            form.append("password", password);
            form.append("email", email);
            
            fetch("http://urbingeo.fa.ulisboa.pt:8080/user/signup", {
                method: "POST",
                
                body: form
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result);
                form = new FormData()
                form.append("id", result)
                fetch("http://urbingeo.fa.ulisboa.pt:8080/lists/startup", {
                    method: "POST",
                    body: form
                })
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
                    <Link href="" underline="hover" onClick={()=>{
                        navigate(`/login`)
                    }}>
                    {'Fazer Login!'}
                    </Link>

                    <Link href="" underline="hover" style={{marginLeft:"15em"}}>
                    {'Recuperar conta!'}
                    </Link>
                </div>
        </Container>

    );
}
