import React from "react";
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import Typography from '@mui/material/Typography';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const color_list = ["rgba(228,38,76,255)", "rgba(121,183,46,255)", "rgba(247,166,20,255)", "rgba(3,137,173,255)"]

export default function Default() {
    let navigate = useNavigate()
    const [all_lists, set_all_lists]=React.useState([])
    const [all_names, set_all_names]=React.useState([])

    const [new_list, set_new_list]=React.useState("")
    const [search, set_search]=React.useState("")
    const [temp_id, set_temp_id]=React.useState("")
    
    const [modal1, set_modal1]=React.useState(false)
    const [modal2, set_modal2]=React.useState(false)
    const [modal3, set_modal3]=React.useState(false)

    React.useEffect(() => {
        const start = async () => {
            let ignore = await check_token("R");
            if (ignore) {
                get_all_lists()
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

        let res = await fetch("http://main-backend:5050/token/check", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })

        return res.ok
    }

    function get_all_lists() {
        let form = new FormData()
        fetch("http://main-backend:5050/lists/get_all", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_all_lists(result)
            let temp = []
            for (let i = 0; i<result.length; i++)
                temp.push(result[i][1])

            set_all_names(temp)
        });
    }

    function add_list() {
        let form = new FormData()
        form.append("name", new_list)
        fetch("http://main-backend:5050/lists/add", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            get_all_lists()
        });
    }

    function get_by_name() {
        let form = new FormData()
        form.append("name", search)
        fetch("http://main-backend:5050/lists/get_by_name", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            set_all_lists(result)
        });
    }

    function get_nav(temp_name) {
        let form = new FormData()
        form.append("name", temp_name)
        fetch("http://main-backend:5050/lists/get_by_name", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            navigate(`/results/list/${result[0][0]}`)
        });
    }

    function update_name() {
        let form = new FormData()
        form.append("name", new_list)
        form.append("id", temp_id[0])
        fetch("http://main-backend:5050/lists/update_name", {
            method: "POST",
            headers: window.localStorage,
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            get_all_lists()
        });
    }

    function delete_list() {
        let form = new FormData()
        form.append("id", temp_id[0])
        fetch("http://main-backend:5050/lists/delete", {
            method: "POST",
            body: form
        })
        .then(res=>res.json())
        .then(result=>{
            get_all_lists()
        });
    }
    
    return (
        <>
            <Modal
                keepMounted
                open={modal1}
                onClose={()=>{
                    set_modal1(false)
                }}>
                <div 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "30%",
                        background: "rgba(256, 256, 256, 0.95)",
                        border: '1px solid #000',
                        boxShadow: 24,
                        borderRadius: "10px",
                        textAlign: "center",
                        height: "300px",
                    }}>
                    <Typography 
                        variant="h4" 
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            margin:"auto",
                            maxWidth: "90%",
                            marginTop: "3vh"
                        }}>
                        Criar lista
                    </Typography>
                    <div>
                        <TextField 
                            size="small"
                            required
                            style={{
                                width: "60%", 
                                top: "40px"
                            }} 
                            label="Nome" 
                            onChange={(e)=>{
                                set_new_list(e.target.value)
                            }}/>
                    </div>
                    <Button 
                        variant="contained" 
                        component="label" 
                        disabled={!new_list}
                        style={{ 
                            postion:"relative",
                            top: "100px"
                        }}
                        onClick={()=>{
                            add_list()
                            set_modal1(false)
                        }}>
                        Criar Lista
                    </Button>
                </div>
            </Modal>
            <Modal
                keepMounted
                open={modal2}
                onClose={()=>{
                    set_modal2(false)
                }}>
                <div 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "30%",
                        background: "rgba(256, 256, 256, 0.95)",
                        border: '1px solid #000',
                        boxShadow: 24,
                        borderRadius: "10px",
                        textAlign: "center",
                        height: "300px",
                    }}>
                    <Typography 
                        variant="h4" 
                        style={{ 
                            color: "rgba(0, 0, 0, 0.9)",
                            margin:"auto",
                            maxWidth: "90%",
                            marginTop: "3vh"
                        }}>
                        Editar lista {temp_id[1]}
                    </Typography>
                    <div>
                        <TextField 
                            size="small"
                            required
                            style={{
                                width: "60%", 
                                top: "40px"
                            }} 
                            label="Nome" 
                            onChange={(e)=>{
                                set_new_list(e.target.value)
                            }}/>
                    </div>
                    <Button 
                        variant="contained" 
                        component="label" 
                        disabled={!new_list}
                        style={{ 
                            postion:"relative",
                            top: "100px"
                        }}
                        onClick={()=>{
                            update_name()
                            set_new_list("")
                            set_modal2(false)
                        }}>
                        Alterar lista
                    </Button>
                </div>
            </Modal>
            <Modal
                keepMounted
                open={modal3}
                onClose={()=>{
                    set_modal3(false)
                }}>
                <div 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "40%",
                        background: "rgba(256, 256, 256, 0.95)",
                        border: '1px solid #000',
                        boxShadow: 24,
                        borderRadius: "10px",
                        textAlign: "center",
                        height: "25vh",
                        overflow: "auto"
                    }}>
                    <Box>
                        <Typography 
                            variant="h4" 
                            style={{ 
                                color: "rgba(0, 0, 0, 0.9)",
                                margin:"auto",
                                maxWidth: "90%",
                                marginTop: "3vh"
                            }}>
                            Pretende apagar {temp_id[1]}
                        </Typography>
                    </Box>
                    <div
                        style={{ 
                            position: "relative",
                            top: "20%",
                        }}>
                         <Tooltip
                            title="Apagar lista">
                            <IconButton
                                style={{
                                    background: "rgba(228,38,76,255)",
                                    height: "60px",
                                    width: "60px"
                                }} 
                                onClick={()=> {
                                    set_modal3(false)
                                    delete_list()
                                }}>
                                <ClearIcon
                                    style={{
                                        color: "rgba(256, 256, 256, 0.9)"}}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </Modal>
            <div 
                style={{ 
                    margin: "auto",
                    position: "relative",
                    border: "1px solid grey",
                    background: "rgba(256, 256, 256, 0.9)",
                    height: "70px",
                    width:"100%",
                }}>
                <Button 
                    variant="contained" 
                    onClick={()=>{
                        get_nav("Histórico")
                    }}
                    style={{
                        width: "150px", 
                        top: "15px",
                        left: "-15%"
                    }}>
                        Histórico
                </Button>
                <Button 
                    variant="contained" 
                    onClick={()=>{
                        get_nav("Favoritos")
                    }}
                    style={{
                        width: "150px", 
                        top: "15px",
                        left: "15%"
                    }}>
                        Favoritos
                </Button>
            </div>
            <div
                style={{ 
                    margin: "auto",
                    position: "relative",
                    background: "rgba(256, 256, 256, 0.9)",
                    height: "85vh",
                    width:"100%",
                }}>
                <div
                    style={{ 
                        margin: "auto",
                        position: "relative",
                        background: "rgba(256, 256, 256, 0.5)",
                        height: "80px",
                        width:"100%",
                        top: "20px"
                    }}>
                    <Tooltip 
                        title="Procurar por nome"
                        style={{
                            top:"20px",
                            width: "20%",
                            marginLeft: "40%"
                        }}>
                        <Autocomplete
                            freeSolo
                            fullWidth
                            options={all_names}
                            size="small"
                            renderInput={(params) => 
                            <TextField 
                                style={{
                                    top:"20px",
                                }}
                                {...params} 
                                label="Nome" 
                                variant="outlined" 
                                size="small"
                                onKeyPress={(ev) => {
                                    if (ev.key === 'Enter') {
                                        get_by_name()
                                        ev.preventDefault();
                                    }
                                }}
                                onChange={(e)=>{
                                    set_search(e.target.value)
                                }}
                            />}
                            onChange={(e, values)=>{
                                set_search(values)
                            }}/>
                    </Tooltip>
                    <Tooltip 
                        title="Limpar procura">
                        <IconButton 
                            style={{ 
                                position: "relative",
                                borderRadius: "5px",
                                background: 'rgba(0, 0, 0, 0.26)',
                                top: "-20px",
                                left: "13%"
                            }}
                            onClick={()=> {
                                window.location.reload(false);
                            }}>
                            <DeleteIcon 
                                style={{
                                    color:"rgba(254,254,255,255)"
                                }}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip 
                        title="Criar lista">
                        <IconButton
                            style={{ 
                                background: color_list[3],
                                top: "-20px",
                                left: "-40%"
                            }}
                            onClick={()=>{
                                set_modal1(true)
                            }}>
                            <AddIcon
                                style={{
                                    color:"rgba(254,254,255,255)"
                                }}/>
                        </IconButton>
                    </Tooltip>
                </div>
                <div
                    style={{ 
                        margin: "auto",
                        position: "relative",
                        background: "rgba(256, 256, 256, 0.5)",
                        height: "86%",
                        width:"100%",
                        top:"30px",
                        overflow: "auto"
                    }}>
                    {all_lists?.length>0 && all_lists.map((doc, index) => {
                        return(
                            <div
                                key={index}
                                style={{ 
                                    position: "relative",
                                    height: "350px", 
                                    width: "25%",
                                    top: "20px",
                                    float:"left",
                                }}>
                                <div
                                    style={{ 
                                        margin:"auto",
                                        position: "relative",
                                        height: "300px", 
                                        width: "350px",
                                        borderRadius: "10px",
                                        border: "3px solid grey",
                                    }}>
                                    <Typography
                                        variant="h5" 
                                        component="h2" 
                                        color="rgba(0, 0, 0, 0.9)"
                                        style={{ 
                                            position: "relative",
                                            margin:"auto",
                                            maxWidth: "85%",
                                            top: "10px",
                                        }}>
                                        {doc[1]}
                                    </Typography>
                                    <Typography
                                        variant="h6" 
                                        component="h2" 
                                        color="rgba(0, 0, 0, 0.5)"
                                        style={{ 
                                            position: "relative",
                                            margin:"auto",
                                            maxWidth: "85%",
                                            top: "20px",
                                        }}>
                                        {doc[3]}
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        onClick={()=>{
                                            navigate(`/results/list/${doc[0]}`)
                                        }}
                                        style={{
                                            position: "relative",
                                            margin:"auto",
                                            width: "180px", 
                                            top: "70px",
                                        }}>
                                            Ver documentos
                                    </Button>
                                    <Typography
                                        variant="h6" 
                                        component="h2" 
                                        color="rgba(0, 0, 0, 0.9)"
                                        style={{ 
                                            position: "relative",
                                            margin:"auto",
                                            maxWidth: "85%",
                                            top: "140px",
                                        }}>
                                        {doc[2]} Documentos
                                    </Typography>
                                    <Tooltip
                                        title="Editar nome">
                                        <IconButton
                                            style={{
                                                position: "absolute",
                                                background: "rgba(3,137,173,255)",
                                                left: "320px",
                                                top: "-15px"
                                            }}
                                            onClick={()=> {
                                                set_modal2(true)
                                                set_temp_id(doc)
                                            }}>
                                            <EditIcon
                                                style={{
                                                    color: "rgba(256, 256, 256, 0.9)"}}/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        title="Apagar lista">
                                        <IconButton
                                            style={{
                                                position: "absolute",
                                                background: "rgba(228,38,76,255)",
                                                left: "-20px",
                                                top: "-15px"
                                            }} 
                                            onClick={()=> {
                                                set_modal3(true)
                                                set_temp_id(doc)
                                            }}>
                                            <ClearIcon
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
        </>
    );
}