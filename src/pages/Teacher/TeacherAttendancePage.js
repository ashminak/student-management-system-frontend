import React from 'react'
import Attendance from '../../components/Teacher/Attendance/Attendance'
import { useParams } from 'react-router-dom';

const TeacherAttendancePage = () => {
  const { courseId } = useParams();
      console.log("Course ID:", courseId); 
  return (
    <div><Attendance courseId={courseId}/></div>
  )
}

export default TeacherAttendancePage