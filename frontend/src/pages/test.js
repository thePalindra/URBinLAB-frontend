import React from 'react'
import Header from "../components/Header"
import Testing from "../components/test"
import "../style/background.css"

export default function test() {
  return (
    <>
        <div className="bg">
            <Header/>
            <br/>
            <br/>
            <div style={{   margin: "auto",
                            width: "90%",
                            border: "1px solid black",
                            background: "rgba(256, 256, 256, 0.92)",
                            borderRadius: "20px",
                            padding: "8px"}}>
                <Testing/>
            </div>
        </div>
    </>
  )
}