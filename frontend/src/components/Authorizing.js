import * as React from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


export default function BasicTextFields() {
    let navigate = useNavigate();
    const [inactive, set_inactive]=React.useState([])
    const [selected, set_selected]=React.useState([])
    const [user, set_user]=React.useState(-1)
    
    React.useEffect(() => {
        const start = async () => {
            let ignore = await check_token("M");
            if (ignore) {
                get_inactive()
            } else {
                window.localStorage.removeItem("token")
                navigate(`/login`)
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

    function get_inactive() {
        fetch("http://urbingeo.fa.ulisboa.pt:8080/user/inactive", {
            method: "GET",
            
        })
        .then(res=>res.json())
        .then(result=>{
            let temp = []
            set_inactive(result)
            for (let i = 0; i<result.length; i++)
                temp.push("all")
            
            set_selected(temp)
        })
    }

    async function confirm_user(temp_index) {
        let form = new FormData();

        form.append("id", inactive[temp_index][0])
        form.append("role", selected[temp_index])

        let res = await fetch("http://urbingeo.fa.ulisboa.pt:8080/user/activate", {
            method: "POST",
            body: form
        })

        if (res.ok) {
            let temp = [...inactive]
            temp.splice(temp_index, 1)
            set_inactive(temp)

            temp = [...selected]
            temp.splice(temp_index, 1)
            set_selected(temp)
        }
    }

    async function delete_user(temp_index) {
        let form = new FormData();

        form.append("id", inactive[temp_index][0])

        let res = await fetch("http://urbingeo.fa.ulisboa.pt:8080/user/full_delete", {
            method: "POST",
            body: form
        })

        if (res.ok) {
            let temp = [...inactive]
            temp.splice(temp_index, 1)
            set_inactive(temp)
            
            temp = [...selected]
            temp.splice(temp_index, 1)
            set_selected(temp)
        }
    }

    return (
        <>
            <div
                style={{ 
                    margin: "auto",
                    position: "relative",
                    background: "rgba(256, 256, 256, 0.9)",
                    height: "92%",
                    width:"100%",
                }}>
                <div
                    style={{ 
                        margin: "auto",
                        position: "relative",
                        background: "rgba(0, 0, 0, 0.1)",
                        height: "100%",
                        width:"60%",
                        //minWidth: "700px"
                    }}>
                    {/*<Button 
                        variant="contained" 
                        onClick= {() => {}}
                        style={{  
                            marginTop: "20px", 
                        }}>
                            Pesquisar aqui
                    </Button>*/}
                    <div
                        style={{ 
                            margin: "auto",
                            position: "relative",
                            height: "100%",
                            width:"75%",
                            //minWidth: "650px"
                        }}>
                        <div
                            style={{ 
                                position: "absolute",
                                marginTop: "20px",
                                width:"100%",
                                margin:"auto",
                                height: "10%",
                            }}>
                            <Typography 
                                variant="h5" 
                                style={{ 
                                    color: "rgba(0, 0, 0, 0.9)",
                                    margin:"auto",
                                    maxWidth: "90%",
                                    marginTop: "20px"
                                }}>
                                Registos em espera
                            </Typography>
                        </div>
                        <div
                            style={{ 
                                position: "absolute",
                                width:"100%",
                                margin:"auto",
                                height: "90%",
                                marginTop: "10%",
                                overflow: "auto"
                            }}>
                            {inactive?.length && inactive.map((doc, index) => {
                                let color = "rgba(256, 256, 256, 0.50)"
                                if (index%2 == 0)
                                    color = "rgba(0, 0, 0, 0.1)"
                                return(
                                    <div
                                        key={index}
                                        style={{ 
                                            marginTop: "5px",
                                            position: "relative",
                                            height: "15%",
                                            minHeight: "100px", 
                                            width: "100%",
                                            margin: "auto",
                                            background: {color},
                                            border: "1px solid grey",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                        <div
                                            style={{
                                                float: "left",
                                                position: "relative",
                                                height: "100%",
                                                width: "100px",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>
                                            <AccountCircleIcon
                                                style={{
                                                    width:"70px",
                                                    height:"70px",
                                                    margin: "auto"
                                                }}/>
                                        </div>
                                        <div
                                            style={{
                                                float: "left",
                                                position: "relative",
                                                height: "100%",
                                                width: "70%",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>
                                            <div
                                                style={{
                                                    float: "left",
                                                    position: "relative",
                                                    height: "100%",
                                                    marginLeft: "10px",
                                                    width: "60%",
                                                    minWidth: "160px",
                                                }}>
                                                <Tooltip
                                                    title="User id e nome">
                                                    <Typography 
                                                        variant="h6" 
                                                        align="left"
                                                        style={{ 
                                                            float: "left",
                                                            maxHeight: "50%",
                                                            width: "100%",
                                                            color: "rgba(0, 0, 0, 0.7)",
                                                        }}>
                                                        {doc[0]}: {doc[1]}
                                                    </Typography>
                                                </Tooltip>
                                                <div 
                                                    style={{ 
                                                        float: "left",
                                                        maxHeight: "50%",
                                                        marginLeft: "20px",
                                                        color: "rgba(0, 0, 0, 0.7)",
                                                        margin:"auto",
                                                    }}>
                                                    {doc[2]}
                                                </div>
                                            </div>
                                            <FormControl>
                                                <InputLabel>Permissões</InputLabel>
                                                <Select
                                                    value={selected[index]}
                                                    label="Permissões"
                                                    size="small"
                                                    onChange={(e)=>{
                                                        let temp = [...selected]
                                                        temp[index] = e.target.value

                                                        set_selected(temp)
                                                    }}
                                                    >
                                                    <MenuItem value={"researcher"}>Utilizador-Gestor</MenuItem>
                                                    <MenuItem value={"all"}>Utilizador-Visulizador</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>  
                                        <Button
                                            variant="contained"
                                            size="small"
                                            style={{
                                                position: "relative",
                                                width: "120px"
                                            }}
                                            onClick={()=>{
                                                confirm_user(index)
                                            }}>
                                            Confirmar
                                        </Button>     
                                        <div
                                            style={{ 
                                                position: "fixed",  
                                                marginLeft: "44%",
                                                marginTop: "-80px"
                                            }}>
                                            <Tooltip
                                                title="Apagar utilizador">
                                                <IconButton
                                                    style={{
                                                        background: "rgba(228,38,76,255)",
                                                        height: "35px",
                                                        width: "35px"
                                                    }} 
                                                    onClick={()=> {
                                                        delete_user(index)
                                                    }}>
                                                    <DeleteIcon
                                                        style={{
                                                            color: "rgba(256, 256, 256, 0.9)"}}/>
                                                </IconButton>
                                            </Tooltip> 
                                        </div>    
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}