import React from 'react'
import Header from "../components/Header"
import MainPage from "../components/NewMain"
import Footer from "../components/Footer"
import "../style/background.css"

export default function Default() {
  return (
    <>
        <div className="bg">
            <Header/>
            <MainPage/>
        </div>
    </>
  )
}