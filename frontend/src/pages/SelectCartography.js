import React from 'react'
import Selectcartography from "../components/SelectCartography"
import Header from "../components/Header"

export default function SelectCartography() {
    return (
        <>
            <div className="bg">
                <Header/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <div style={{   margin: "auto",
                            width: "50%",
                            padding: "30px"}}>
                    <Selectcartography/>
                </div>
            </div>
        </>
    )
}