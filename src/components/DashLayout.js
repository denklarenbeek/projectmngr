import React, {useState} from 'react'
import { Outlet } from 'react-router-dom';
import DashHeader from './DashHeader.js/DashHeader';
import Sidebar from './Sidebar/Sidebar';

import './DashLayout.css';

const DashLayout = () => {

  const [sideBarOpen, setSideBarOpen]= useState(false);

  const handleSidebarDisplay = () => {
    const application = document.getElementById('application');
    application.classList.toggle('sidebarOpen');
    const newStatus = !sideBarOpen;
    setSideBarOpen(newStatus);
  }

  return (
    <div id="application">
        <Sidebar sideBarOpen={sideBarOpen} handleSidebarDisplay={handleSidebarDisplay} />
        <div className="main-container">
          <DashHeader />
          <div className="dash__container">
              <Outlet />    
          </div> 
        </div>
    </div>
  )
}

export default DashLayout