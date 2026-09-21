import axiosInstance from '../Interceptor/AxiosInterceptor';

const requestEnrollment  = async (EnrollmentDTO) => {
   
   return axiosInstance.post('/enrollment/requestEnrollment',EnrollmentDTO)
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}

const getAllEnrollments = async () => {
    return axiosInstance.get('/enrollment/getAllEnrollments')
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}

const assignStudentToCourse  = async (enrollmentId,EnrollmentDTO) => {
   
   return axiosInstance.put(`/enrollment/assignStudentToCourse/${enrollmentId}`,EnrollmentDTO)
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}

const getStudentsByCourseId = async (courseId) => {
    return axiosInstance.get(`/enrollment/getStudentsByCourseId/${courseId}`)
    .then((response)=>response.data)
    .catch((error)=>{throw error;})
}


export {requestEnrollment, getAllEnrollments, assignStudentToCourse, getStudentsByCourseId};