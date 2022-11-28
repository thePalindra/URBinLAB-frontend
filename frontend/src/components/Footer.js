import React from "react";
import urbinlab from "../images/urbinlab.png"
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CssBaseline from '@mui/material/CssBaseline';


const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

export default function Default() {
    return(
        <>
            <div 
                style={{ 
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "120%",
                    background: "rgba(230, 230, 230, 0.7)",
                    border: "1px solid grey",
                    boxShadow: 24,
                    height: "12vh",
                    borderRadius: "20px",
                    textAlign: "center"}}>
                        Isto é o Footer
            </div>
        </>
    )
}