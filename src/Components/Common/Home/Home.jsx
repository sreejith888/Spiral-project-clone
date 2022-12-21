import React, { useEffect, useState } from 'react'
import Popup from '../../../Framework/Popup/Popup';
import Header from '../Header/Header'

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    document.addEventListener("keydown", keyDownHander, false);
  }, []);
  const keyDownHander = (e) => {
    if (e.ctrlKey && e.code === "KeyI") {
      e.preventDefault();
      setModalOpen(true);
    }
  }
  return (
    <div>
      <Header/>
      {modalOpen && (
          <Popup
          setModalOpen={setModalOpen}
          />
        )}
    </div>
  )
}

export default Home