import React from 'react'
import Login from "../components/Login"
import Header from "../components/Header"
import "../style/background.css"

function LogIn() {
  return (
    <>
        <div className="bg">
            <div style={{   margin: "auto",
                            marginTop: "10%",
                            width: "50%",
                            border: "1px solid black",
                            background: "rgba(256, 256, 256, 0.92)",
                            borderRadius: "20px",
                            padding: "70px"}}>
                <Login/>
            </div>
        </div>
    </>
  )
}

export default LogIn