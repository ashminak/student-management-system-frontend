import { ActionIcon, Avatar } from '@mantine/core'
import React from 'react'
import { IconLayoutGrid, icons, IconSchool } from '@tabler/icons-react';
import { IconBook } from '@tabler/icons-react';
import { IconChalkboardTeacher,IconUserPause } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { IconColumns3 } from '@tabler/icons-react';
import { IconCircleDottedLetterM } from '@tabler/icons-react';
import { IconDeviceIpadPlus } from '@tabler/icons-react';
import { IconStack3 } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { Text } from '@mantine/core';
import {
    IconDashboard,
    IconUser,
    IconCalendarCheck,
    IconClipboardText,
    IconCalendarEvent
} from '@tabler/icons-react';

const links=[
{
    name: "Dashboard",
    url: "/student/dashboard",
    icon: <IconDashboard stroke={2} />
},
{
    name: "Profile",
    url: "/student/profile",
    icon: <IconUser stroke={2} />
},
{
    name: "Marks",
    url: "/student/marks",
    icon: <IconBook stroke={2} />
},
{
    name: "Enrollment",
    url: "/student/enrollments",
    icon: <IconCircleDottedLetterM stroke={2} />
},
{
    name: "Attendance",
    url: "/student/attendance",
    icon: <IconCalendarCheck stroke={2} />
},


]

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  return (
      <div className='flex'>
            <div className='w-64'>
      
            </div>
          <div  className="fixed overflow-y-hidden gap-1 h-screen w-64 bg-[#51021e] flex flex-col items-center">
            <div className='flex text-white gap-5 py-2 mb-4   fixed z-[500] items-center'>
                <IconSchool stroke={2} size={60}  color="black" className='border border-gray-100 bg-[#e6d3d8]  p-2 rounded-2xl'/>
                <span className='font-sans text-lg font-bold leading-6 text-white mb-2'>
                  <div className='flex flex-col '>
                    <div>Student</div>
                    <div>Management</div>
                    <div>System</div>
                   </div>
            </span>
            </div>
            <div className='flex flex-col items-center mt-14'>
              
                  <Avatar src="/avatar.png" variant='filled' size={70} alt="it's me" className='mt-10 py-4' />
                 
                 <span className='font-sans text-base font-semibold text-white'>{user.name}</span>
                 <Text c="dimmed" size="xs" className='font-sans text-xs font-medium uppercase tracking-wide text-white/70'>{user.role}</Text>
            </div>
      
            <div className="flex-1 overflow-y-auto mt-">
              {
                links.map((link)=>{
                  return<NavLink to={link.url} key={link.url}   className={({isActive})=>`flex items-center gap-3 w-full 
                  font-sans text-[15px] font-medium text-white px-12 py-4 
                      ${isActive?"bg-[#F7A1A8] text-[#51021E] font-semibold rounded-r-md ":"hover:bg-[#6D1535] transition-colors duration-200 hover:text-white"}`} >
                      {link.icon}
                      <span>{link.name}</span>
      
                  </NavLink>
                })
              }
            </div >
            <div className="w-[180px] h-[145px] rounded-xl bg-[##A94B68] overflow-hidden mb-5 flex flex-col items-center">
              <img src='/books.png' className='w-[120px] h-[95px] object-contain mx-auto'/>
              <p className="font-sans text-sm font-semibold leading-5 text-white text-center">
              Keep Learning
              <br />
            Keep Growing
            </p>
              </div>
            
           
          </div>
          </div>
    )
}

export default Sidebar