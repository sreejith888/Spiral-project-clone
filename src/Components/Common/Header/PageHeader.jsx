import React from 'react'
import "./Header.css";
import clientlogo from "../../Assets/clientlogo.png"
const PageHeader = () => {
  return (
    <div className='main_Menubar'>
        <img  className='clientLogo' src={clientlogo} alt="clientlogo"/>
        <div className='subMenubar'>
        </div>
       </div>
  )
}

export default PageHeader;