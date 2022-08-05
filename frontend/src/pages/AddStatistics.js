import React from 'react'
import Addstatistics from "../components/AddStatistics"
import Header from "../components/Header"

export default function AddStatistics() {
    return (
        <>
            <div className="bg">
                <Header/>
                <br/>
                <br/>
                <div style={{   margin: "auto",
                            width: "50%",
                            border: "1px solid black",
                            background: "rgba(256, 256, 256, 0.92)",
                            borderRadius: "20px",
                            padding: "30px"}}>
                    <Addstatistics/>
                </div>
            </div>
        </>
    )
}