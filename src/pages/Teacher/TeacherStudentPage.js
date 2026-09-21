import React from 'react'
import Students from '../../components/Teacher/courses/Students'
import { useParams } from 'react-router-dom';

const TeacherStudentPage = () => {
    const { courseId } = useParams();
    console.log("Course ID:", courseId); // Log the courseId to verify it's being captured correctly
  return (
    <div><Students courseId={courseId}/></div>
  )
}

export default TeacherStudentPage