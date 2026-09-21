import React from 'react'
import Sidebar from '../components/Student/Sidebar/Sidebar'
import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'

const StudentDashboard = () => {
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

export default StudentDashboard;