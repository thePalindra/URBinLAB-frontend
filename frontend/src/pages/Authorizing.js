import React from 'react'
import Authorizing from "../components/Authorizing"
import Header from "../components/Header"
import "../style/background.css"

export default function Default() {
  return (
    <>
        <div className="bg">
            <Header/>
            <Authorizing/>
        </div>
    </>
  )
}