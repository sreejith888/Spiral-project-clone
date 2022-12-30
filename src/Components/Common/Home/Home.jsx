import React, { useEffect, useState } from 'react'
import Popup from '../../../Framework/Popup/Popup';
import "./Home.css";
const Home = () => {
const[modalOpen,setModalOpen]=useState(false);
  useEffect(()=>{
    document.addEventListener("keydown",keyHandler,false)
  },[])
  const keyHandler=(e)=>{
    if (e.ctrlKey && e.code === "KeyI"){
  e.preventDefault()
  setModalOpen(true)
}
  }
  return (
    <div>
      <div className='header'>
3S LOGICS
      </div>
      {
        modalOpen && (
          <Popup setModalOpen={setModalOpen}/>
        )
      }
      {/* <Popup setModalOpen={setModalOpen}/> */}
    </div>
  )
}

export default Home