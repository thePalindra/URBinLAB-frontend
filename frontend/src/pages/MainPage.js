import React from 'react'
import Header from "../components/Header"
import MainPage from "../components/MainPage"
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