import React from 'react'
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
                    <Typography variant="h4" component="h2">
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
                    height: "90vh",
                    border: "1px solid black",
                    background: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "10px",
                    position: "fixed"
                }}
                >
                    <Document/>
                </div>
            </div>
        </>
    )
}