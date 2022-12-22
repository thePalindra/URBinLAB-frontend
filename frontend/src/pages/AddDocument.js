import React from 'react'
import Header from "../components/Header"
import AddDocument from "../components/AddDocument"
import "../style/background.css"

export default function Default() {

    return (
        <>
            <div className="bg">
                <Header/>
                <AddDocument/>
            </div>
        </>
    )
}