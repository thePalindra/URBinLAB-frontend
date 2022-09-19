import React from 'react'
import Header from "../components/Header"
import Document from "../components/NewDocument"

export default function AddDrawings() {
    return (
        <>
            <div className="bg">
                <Header/>
                <br/>
                <br/>
                <div>
                    <Document/>
                </div>
            </div>
        </>
    )
}