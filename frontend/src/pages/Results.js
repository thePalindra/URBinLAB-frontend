import React from 'react'
import Result from "../components/Results"
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
                        Resultados
                    </Typography>
                </div>
                <br/>
                <Result/>
            </div>
        </>
    )
}