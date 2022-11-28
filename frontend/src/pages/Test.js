import React from 'react'
import Header from "../components/Header"
import Test from "../components/Test"
import Footer from "../components/Footer"
import "../style/background.css"

export default function Default() {
  return (
    <>
        <div className="bg">
            <Header/>
            <Test/>
        </div>
    </>
  )
}