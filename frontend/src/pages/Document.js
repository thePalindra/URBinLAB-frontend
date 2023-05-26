import React from 'react'
import Header from "../components/Header"
import Document from "../components/DocumentPage"
import "../style/background.css"

export default function Default() {
  return (
    <>
        <div className="bg">
            <Header/>
            <Document/>
        </div>
    </>
  )
}