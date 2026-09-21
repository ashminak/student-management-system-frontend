import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AdminDashboard from '../Layout/AdminDashboard'
import { Route,Routes,Navigate} from 'react-router-dom'
import Random from '../Random'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import TeacherDashboard from '../Layout/TeacherDashboard'
import TeacherProfilePage from '../pages/Teacher/TeacherProfilePage'
import StudentDashboard from '../Layout/StudentDashboard'
import StudentProfilePage from '../pages/Student/StudentProfilePage'
import StudentAttendancePage from '../pages/Student/StudentAttendancePage'
import StudentDashboardPage from '../pages/Student/StudentDashboardPage'
import StudentMarksPage from '../pages/Student/StudentMarksPage'
import TeacherAttendancePage from '../pages/Teacher/TeacherAttendancePage'
import TeacherCoursePage from '../pages/Teacher/TeacherCoursePage'
import TeacherStudentPage from '../pages/Teacher/TeacherStudentPage'
import TeacherDashboardPage from '../pages/Teacher/TeacherDashboardPage'
import TeacherMarksPage from '../pages/Teacher/TeacherMarksPage'
import StudentEnrollmentPage from '../pages/Student/StudentEnrollmentPage'
import AdminCoursePage from '../pages/Admin/AdminCoursePage'
import AdminEnrollmentPage from '../pages/Admin/AdminEnrollmentPage'
import StudentCourseMarks from "../components/Student/Marks/StudentCourseMarks";
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage'




const AppRouter = () => {
  return (
    <div>
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>}/>
            <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>}/> 
             <Route path="/" element={<Navigate to="/register" replace />}>
             
                     
            </Route>


           <Route path="/admin" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}>
                <Route path="dashboard" element={<AdminDashboardPage/>} />
                   <Route path="courses" element={<AdminCoursePage/>} />
                    <Route path="enrollments" element={<AdminEnrollmentPage/>} />
                     
            </Route>

            <Route path="/teacher" element={<ProtectedRoute><TeacherDashboard/></ProtectedRoute>}>
                <Route path="dashboard" element={<TeacherDashboardPage/>} />
                 <Route path="profile" element={<TeacherProfilePage/>} />
                   <Route path="courses" element={<TeacherCoursePage/>} />
                   <Route path="courses/:courseId/students" element={<TeacherStudentPage />} />
                    <Route path="courses/:courseId/Marks" element={<TeacherMarksPage />} />
                    <Route path="courses/:courseId/attendance" element={<TeacherAttendancePage />} />
  
            
            </Route>
                  
           <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}>
                 <Route path="dashboard" element={<StudentDashboardPage/>} />
                   <Route path="profile" element={<StudentProfilePage />} />
                          <Route path="marks" element={<StudentMarksPage/>} />
                           <Route path="marks/:courseId" element={<StudentCourseMarks />}/>
                            <Route path="attendance" element={<StudentAttendancePage/>} />
                                <Route path="enrollments" element={<StudentEnrollmentPage />} />
                                  
            </Route>           
        </Routes>
        </BrowserRouter>
     
        
    </div>
  )
}

export default AppRouter