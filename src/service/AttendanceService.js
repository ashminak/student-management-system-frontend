import axiosInstance from '../Interceptor/AxiosInterceptor';

const addAttendance = async (attendanceDTO) => {
    return axiosInstance
        .post('/attendance/add', attendanceDTO)
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
};

const updateAttendance = async (id, attendanceDTO) => {
    return axiosInstance
        .put(`/attendance/update/${id}`, attendanceDTO)
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
};

const deleteAttendance = async (id) => {
    return axiosInstance
        .delete(`/attendance/delete/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
};

const getAttendanceDetails = async (id) => {
    return axiosInstance
        .get(`/attendance/get/details/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
};

const getAllAttendanceByTeacherId = async (id) => {
    return axiosInstance
        .get(`/attendance/getAllAttendanceByTeacherId/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
};
const getAllAttendancesByStudentId = async (id) => {
    return axiosInstance
        .get(`/attendance/getAllAttendancesByStudentId/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
};


const getStudentByName = async (name) => {
    return axiosInstance
        .get(`/profile/student/name/${name}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
};

const getCourseByName = async (name) => {
    return axiosInstance
        .get(`/course/name/${name}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
};


export {
    addAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceDetails,
    getAllAttendanceByTeacherId,
      getStudentByName,
    getCourseByName,

    getAllAttendancesByStudentId

}