import React from 'react'
import Searchmenu from "../components/SearchMenu"
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
                        Pesquisar Vários
                    </Typography>
                </div>
                <br/>
                <br/>
                <Searchmenu/>
            </div>
        </>
    )
}