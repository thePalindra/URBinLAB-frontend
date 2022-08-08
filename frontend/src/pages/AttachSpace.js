import React from 'react'
import AttachSpace from "../components/AttachSpace"
import Header from "../components/Header"
import SpaceForm from "../components/SpaceForm"

export default function defaultFunction() {
    return (
        <>
            <div className="bg">
                <Header/>
                <br/>
                <br/>
                <div style={{   margin: "auto",
                            width: "60%",
                            border: "1px solid black",
                            background: "rgba(256, 256, 256, 0.92)",
                            borderRadius: "20px",
                            padding: "30px",
                            position: "fixed",
                            right: "20px"}}>
                    <AttachSpace/>
                </div>
                <div style={{   margin: "auto",
                            width: "30%",
                            border: "1px solid black",
                            background: "rgba(256, 256, 256, 0.92)",
                            borderRadius: "20px",
                            padding: "30px",
                            position: "fixed",
                            left: "20px"}}>
                    <SpaceForm/>     
                </div>
            </div>
        </>
    )
}