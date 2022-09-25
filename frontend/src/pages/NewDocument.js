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
                    paddingTop:"30px"
                }}
                >
                    <Document/>
                </div>
            </div>
        </>
    )
}