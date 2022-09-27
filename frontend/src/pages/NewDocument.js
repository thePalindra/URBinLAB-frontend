import React from 'react'
import Header from "../components/Header"
import Document from "../components/NewDocument"
import Typography from '@mui/material/Typography';

export default function AddDrawings() {
    return (
        <>
            <div className="bg">
                <div style={{
                    paddingTop:"20px"
                }}
                >
                    <Typography variant="h5" component="h2">
                        Adicionar documento
                    </Typography>
                </div>
                <div style={{
                    paddingTop:"20px"
                }}/>
                <div style={{
                    paddingTop:"10px",
                    margin: "auto",
                    width: "100%",
                    height: "83vh",
                    border: "1px solid black",
                    background: "rgba(256, 256, 256, 0.92)",
                    borderRadius: "20px",
                    position: "fixed"
                }}
                >
                    <Document/>
                </div>
            </div>
        </>
    )
}