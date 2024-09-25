import React from 'react'
import Topbar from '../components/sideBar/Topbar'
import SideBar from '../components/sideBar/Sidebar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <div className='relatvie '>
        <Topbar/>
        <div className='dashboard flex gap-1' style={{marginTop:'70px'}}>
        <SideBar/>
        <Outlet className='w-100'/>
        </div>
    </div>
    
  )
}

export default Dashboard