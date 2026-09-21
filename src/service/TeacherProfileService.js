
import axiosInstance from '../Interceptor/AxiosInterceptor';


const getTeacher = async (id) => {
   
    return axiosInstance.get('/profile/teacher/get'+ id)
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}

const updateTeacher = async (teacher) => {
   
    return axiosInstance.put('/profile/teacher/update',teacher)
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}

const getTeacherDropdowns = async() => {
    return axiosInstance.get('/profile/teacher/dropdowns')
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}

export {getTeacher,updateTeacher, getTeacherDropdowns};