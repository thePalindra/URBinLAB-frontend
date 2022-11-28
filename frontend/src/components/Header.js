import React from "react";
import urbinlab from "../images/urbinlab.png"
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import CssBaseline from '@mui/material/CssBaseline';


const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

export default function Default() {
    const [search, setSearch]=React.useState('');
    const [dictionary, set_dictionary]=React.useState([])
    let navigate = useNavigate()

    const clickHandler =(e)=>{
        navigate(`/`)
    }

    async function get_search_result() {
        let form = new FormData()
        form.append("query", search.toLowerCase().trim())
        const response = await fetch("http://localhost:5050/es/search", {
            method: "POST",
            body: form
        })

        const ar = await response.json();
        console.log(ar)
        window.localStorage.setItem('results', JSON.stringify(ar));
        navigate(`/results`)
    }


    function get_dictionary() {
        fetch("http://localhost:5050/dictionary", {
                method: "GET"
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)
                set_dictionary(result)
            });
    }

    return (
        <div 
            style={{ 
                background: "rgba(256, 256, 256, 0.6)",
                height: "8vh",
                margin: "auto"}}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Tooltip 
                    title="Página principal">
                    <IconButton
                        style={{
                            float:"left",
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
                <div 
                    style={{ 
                        position: "relative",
                        top: 10,
                        background: "rgba(0, 0, 0, 0.2)",
                        height: "5vh",
                        width: "25%",
                        margin: "auto",
                        borderRadius: "5px",
                        right: "1%"}}>
                    <Tooltip 
                        title="Pesquisar">
                        <Autocomplete
                            freeSolo
                            options={dictionary}
                            size="small"
                            style={{
                                paddingTop:"1vh",
                            }}
                            renderInput={(params) => <TextField 
                                style={{width: "100%"}}
                                {...params} 
                                label="Pesquisa" 
                                variant="outlined"
                                onKeyPress={(ev) => {
                                        /*if (ev.key === 'Enter') {
                                            get_search_result()
                                            ev.preventDefault();
                                        }
                                    }*/
                                }}
                                onChange={(e)=>{
                                    /*setSearch(e.target.value)
                                    if (e.target.value.length == 2)
                                        get_dictionary()
                                    else
                                        set_dictionary([])*/
                                }}
                                size="small"
                            />}
                            onChange={(e, values)=>{
                                /*setSearch(values)
                                if (values.length == 2)
                                    get_dictionary()
                                else
                                    set_dictionary([])*/
                            }}/>  
                    </Tooltip>
                </div>  
                <Tooltip 
                    title="Pesquisa geográfica"> 
                    <IconButton 
                        style={{ 
                            position: "relative",
                            bottom: 39,
                            height: "5vh",
                            margin: "auto",
                            borderRadius: "5px",
                            background: "rgba(0, 0, 0, 0.2)",
                            right: "0%"}}>
                        <TravelExploreIcon/>
                    </IconButton>  
                </Tooltip>
                <Tooltip
                    title="Perfil">
                    <IconButton
                        style={{
                            position: "relative",
                            bottom: 39,
                            float:"right",
                            height: "5vh",
                            borderRadius: "5px",
                            background: "rgba(0, 0, 0, 0.2)",
                            right: "2%"
                        }}>
                        <AccountCircleIcon/>
                    </IconButton>   
                </Tooltip>      
            </ThemeProvider>  
        </div>

    );
}