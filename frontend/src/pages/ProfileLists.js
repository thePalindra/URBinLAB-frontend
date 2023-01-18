import React from 'react'
import Header from "../components/Header"
import Lists from "../components/ProfileLists"
import "../style/background.css"

export default function Default() {
  return (
    <>
        <div className="bg">
            <Header/>
            <Lists/>
        </div>
    </>
  )
}