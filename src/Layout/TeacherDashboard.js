import React from 'react'
import Sidebar from '../components/Teacher/Sidebar/Sidebar'
import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'

const TeacherDashboard = () => {
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

export default TeacherDashboard;