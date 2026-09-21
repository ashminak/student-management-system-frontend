import React from 'react'
import { useParams } from 'react-router-dom';
import Marks from '../../components/Teacher/courses/Marks'

const TeacherMarksPage = () => {
    const { courseId } = useParams();
    console.log("Course ID:", courseId); 
  return (
    <div><Marks courseId={courseId}/></div>
  )
}

export default TeacherMarksPage