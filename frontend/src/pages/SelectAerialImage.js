import React from 'react'
import Selectaerialimage from "../components/SelectAerialImage"
import Header from "../components/Header"

export default function SelectAerialImage() {
    return (
        <>
            <div className="bg">
                <Header/>
                <br/>
                <br/>
                <div style={{   margin: "auto",
                            width: "80%",
                            padding: "120px"}}>
                    <Selectaerialimage/>
                </div>
            </div>
        </>
    )
}