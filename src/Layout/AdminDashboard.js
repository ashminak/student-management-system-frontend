import React from 'react'
import Sidebar from '../components/Admin/Sidebar/Sidebar'
import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'
const AdminDashboard = () => {
  return (
    <div className='flex'>
         
          <Sidebar/>
          <div className='w-full overflow-hidden'>
          <Header/>
          <Outlet/>
          </div>
    </div>
  )
}

export default AdminDashboard