import React from 'react'
import AllUsers from "../components/AllUsers"
import Header from "../components/Header"
import "../style/background.css"

export default function Default() {
  return (
    <>
        <div className="bg">
            <Header/>
            <AllUsers/>
        </div>
    </>
  )
}