import React from 'react'
import Deleted from "../components/Deleted"
import Header from "../components/Header"
import "../style/background.css"

export default function Default() {
  return (
    <>
        <div className="bg">
            <Header/>
            <Deleted/>
        </div>
    </>
  )
}