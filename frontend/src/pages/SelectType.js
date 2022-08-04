import React from 'react'
import SelectType from "../components/SelectType"
import Header from "../components/Header"

export default function Selecttype() {
    return (
        <>
            <div className="bg">
                <Header/>
                <br/>
                <br/>
                <div style={{   margin: "auto",
                            width: "80%",
                            padding: "80px"}}>
                    <SelectType/>
                </div>
            </div>
        </>
    )
}