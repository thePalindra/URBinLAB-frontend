import React from "react";
import { AppBar, IconButton } from "@mui/material";
import urbinlab from "../images/urbinlab.png"

export default function Header() {
    return (
        <div>
            <AppBar position="static" style={{background: "none"}} elevation={0}>
                <div style={{opacity:"100%"}}>
                    <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}>
                        
                        <img style={{size: "50% 50%"}} src={urbinlab} className="urbinlab" alt="Logo" />
                    </IconButton>
                </div>
            </AppBar>
        </div>

    );
}