
import axiosInstance from '../Interceptor/AxiosInterceptor';


const getStudent = async (id) => {
   
   return axiosInstance.get('/profile/student/get/'+id)
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}

const updateStudent = async (id,student) => {
   
    return axiosInstance.put(`/profile/student/update/${id}`,student)
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}


export {getStudent,updateStudent};