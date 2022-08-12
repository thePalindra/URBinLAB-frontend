import React from "react";
import { AppBar, IconButton } from "@mui/material";
import urbinlab from "../images/urbinlab.png"
import { useNavigate } from "react-router-dom";

export default function Header() {
    var navigate = useNavigate()

    const clickHandler =(e)=>{
        navigate(`/`)
    }
    return (
        <div>
            <AppBar position="static" style={{background: "none"}} elevation={0}>
                <div style={{opacity:"100%"}}>
                    <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    onClick={clickHandler}>
                        
                        <img style={{size: "50% 50%"}} src={urbinlab} className="urbinlab" alt="Logo" />
                    </IconButton>
                </div>
            </AppBar>
        </div>

    );
}