import React from 'react'
import Header from "../components/Header"
import Results from "../components/Results"
import Footer from "../components/Footer"
import "../style/background.css"

export default function Default() {
  return (
    <>
        <div className="bg">
            <Header/>
            <Results/>
        </div>
    </>
  )
}