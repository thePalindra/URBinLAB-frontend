import React from 'react'
import Signup from "../components/Signup"
import Header from "../components/Header"
import { styled, alpha } from '@mui/material/styles';
import "../style/background.css"

export default function SignUp() {
  return (
    <>
        <div className="bg">
            <Header/>
            <br/>
            <br/>
            <br/>
            <br/>
            <div style={{   margin: "auto",
                            width: "50%",
                            border: "1px solid black",
                            background: "rgba(256, 256, 256, 0.92)",
                            borderRadius: "20px",
                            padding: "70px"}}>
                <Signup/>
            </div>
        </div>
    </>
  )
}