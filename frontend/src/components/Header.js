import React from "react";
import urbinlab from "../images/urbinlab.png"
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import CssBaseline from '@mui/material/CssBaseline';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';


const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

export default function Default() {
    const [search, setSearch]=React.useState('');
    const [dictionary, set_dictionary]=React.useState([])
    const [logged_in, set_logged_in]=React.useState(false)
    let navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    React.useEffect(() => {
        const start = async () => {
            let ignore = false;
            if (!ignore) {
                let token = await check_token("R")
                set_logged_in(token)
                if (!token)
                    window.localStorage.removeItem("token")
            }
            return () => { ignore = true; }
        }
        start()
    },[]);

    async function get_search_result() {
        let form = new FormData()
        form.append("query", search.toLowerCase().trim())
        const response = await fetch("http://urbingeo.fa.ulisboa.pt:5050/es/search", {
            method: "POST",
            body: form
        })

        const ar = await response.json();
        console.log(ar)
        window.localStorage.setItem('results', JSON.stringify(ar));
        if(window.location.pathname=="/results")
            window.location.reload(false);
        else 
            navigate(`/results`)
    }

    function get_dictionary() {
        fetch("http://urbingeo.fa.ulisboa.pt:5050/dictionary", {
            method: "GET"
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            set_dictionary(result)
        });
    }

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

    function get_nav(temp_name) {
        let form = new FormData()
        form.append("name", temp_name)
        form.append("token", window.localStorage.getItem("token"))

        fetch("http://urbingeo.fa.ulisboa.pt:8080/lists/get_by_name", {
            method: "POST",
            body: form
        })
        .then(res=>res.json())
        .then(result=>{

            navigate(`/results/list/${result[0][0]}`)
        });
    }

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    
    return (
        <div 
            style={{ 
                background: "rgba(256, 256, 256, 0.98)",
                height: "8%",
                minHeight: "65px",
                margin: "auto"}}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Tooltip 
                    title="Página principal">
                    <IconButton
                        style={{
                            float: "left",
                            left: "-5%"
                        }}
                        onClick={() => {
                            navigate(`/`)
                        }}>
                        <img 
                            src={urbinlab}
                            style={{ 
                                width:"50%"}}/>
                    </IconButton> 
                </Tooltip>  
                <Box
                    display="flex"
                    alignItems="center"
                    style={{
                        position: "relative",
                        top: "18%",
                    }}>
                    <div style={{position:"relative", width:"17%"}}/>
                    <Autocomplete
                        freeSolo
                        options={dictionary}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(0, 0, 0, 0.26)',
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "darkslategrey"
                            },
                            "&.Mui-focused .MuiInputLabel-outlined": {
                                color: "darkslategrey"
                            }
                        }}
                        style={{
                            width: "25%",
                            borderRadius: "5px",
                        }}
                        renderInput={(params) => <TextField 
                            sx={{
                                label: {
                                    color: 'darkslategrey ',
                                },
                            }}
                            {...params} 
                            label="Pesquisa" 
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    get_search_result()
                                    ev.preventDefault();
                                }
                            }}
                            onChange={(e)=>{
                                setSearch(e.target.value)
                                if (e.target.value.length ==1)
                                    get_dictionary()
                                else if (e.target.value == 0)
                                    set_dictionary([])
                            }}
                        />}
                        onChange={(e, values)=>{
                            setSearch(values)
                            if (values.length > 0)
                                get_dictionary()
                            else
                                set_dictionary([])
                        }}/>  
    
                    <Tooltip 
                        title="Pesquisar"> 
                        <IconButton 
                            style={{
                                position: "relative",
                                borderRadius: "5px",
                                background: "rgba(0, 0, 0, 0.26)"}}
                            onClick={()=>{
                                get_search_result()
                            }}>
                            <SearchIcon/>
                        </IconButton>  
                    </Tooltip>
                    <Tooltip
                        title="Perfil">
                        <IconButton
                            id="pbasic-button"
                            aria-controls={open ? 'pbasic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            style={{
                                position: "absolute",
                                right: "1%",
                                borderRadius: "5px",
                                background: "rgba(0, 0, 0, 0.26)",
                            }}>
                            <AccountCircleIcon/>
                        </IconButton> 
                        
                    </Tooltip>
                </Box>
                <Menu 
                    dense
                    id="pbasic-menu"
                    anchorEl={anchorEl}
                    PaperProps={{  
                        style: {  
                            width: 170,  
                            background: "rgba(60, 60, 60, 1)"
                        }
                    }}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{'aria-labelledby': 'pbasic-button'}}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}>
                    {!logged_in && 
                        <>
                            <MenuItem 
                                divider 
                                onClick={() => {
                                    navigate(`/login`)
                                }}>
                                Entrar
                            </MenuItem>
                            <MenuItem 
                                onClick={() => {
                                    navigate(`/signup`)
                                }}>
                                Registar
                            </MenuItem>     
                        </> 
                    }
                    {logged_in &&
                        <>
                            <MenuItem 
                                onClick={() => {
                                    if(window.location.pathname=="/profile/lists")
                                        window.location.reload(false);
                                    else 
                                        navigate(`/profile/lists`)
                                }}>
                                Listas
                            </MenuItem>  
                            <MenuItem 
                                onClick={() => { 
                                    get_nav("Favoritos")
                                }}>
                                Favoritos
                            </MenuItem>  
                            <MenuItem 
                                onClick={() => {
                                    get_nav("Histórico")
                                }}>
                                Histórico 
                            </MenuItem>  
                            <MenuItem 
                                onClick={() => {
                                    window.localStorage.removeItem("token")
                                    if(window.location.pathname=="/")
                                        window.location.reload(false);
                                    else 
                                        navigate(`/`)
                                }}>
                                Logout
                            </MenuItem>     
                        </>
                    }
                </Menu> 
            </ThemeProvider>  
        </div>

    );
}