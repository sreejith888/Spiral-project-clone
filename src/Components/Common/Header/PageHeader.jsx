import React from 'react'
import "./Header.css";
import clientlogo from "../../Assets/clientlogo.png"
import { Link } from 'react-router-dom';
const PageHeader = () => {
  return (
    <div className='main_Menubar'>
       <Link  className='main_Menubar' to="/home"><img  className='clientLogo' src={clientlogo} alt="clientlogo"/></Link>
        <div className='subMenubar'>
       
        </div>
       </div>
  )
}

export default PageHeader;