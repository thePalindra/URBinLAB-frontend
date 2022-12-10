import React from 'react'
import Header from "../components/Header"
import Document from "../components/Document"
import Footer from "../components/Footer"
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