import { Axios } from 'axios';
import axiosInstance from '../Interceptor/AxiosInterceptor';

const addCourse = async (CourseDTO) => {
   
   return axiosInstance.post('/course/add',CourseDTO)
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}

const getAllCourses = async () => {
    return axiosInstance.get('/course/get')
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}

const deleteCourse = async (id) => {
    return axiosInstance.delete(`/course/delete/${id}`)
    .then((response) => response.data)
    .catch((error) => {throw error;})
}
const getCourseById = async (id) => {
    return axiosInstance
        .get(`/course/get/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
};
const getTeachersByCourseId = async (id) => {
    return axiosInstance
        .get(`/course/getTeachersByCourseId/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
};
const assignTeacherToCourse = async(TeacherCourseDto)=>{
    return axiosInstance.post("/course/assignTeacherToCourse",TeacherCourseDto)
    .then((response) => response.data)
    .catch((error) => {throw error;});
}

const getCoursesByTeacherId = async (teacherId) => {
    return axiosInstance.get(`/course/getCoursesByTeacherId/${teacherId}`)
    .then((response) => response.data)
    .catch((error) => {throw error;});
}
export{addCourse,getAllCourses,deleteCourse,getCourseById,assignTeacherToCourse,getTeachersByCourseId,getCoursesByTeacherId};