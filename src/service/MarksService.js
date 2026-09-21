import axiosInstance from '../Interceptor/AxiosInterceptor';

// =========================================================
// STUDENT - ALL COURSES MARKS
// =========================================================

export const getStudentMarks = async (profileId) => {
    const response = await axiosInstance.get(
        `/marks/student/${profileId}`
    );

    return response.data;
};


// =========================================================
// STUDENT - ONE COURSE MARKS
// =========================================================

export const getStudentMarksByCourse = async (
    profileId,
    courseId
) => {
    const response = await axiosInstance.get(
        `/marks/student/${profileId}/course/${courseId}`
    );

    return response.data;
};


// =========================================================
// TEACHER - GET COURSE MARKS
// =========================================================

export const getMarksByCourseId = async (courseId) => {
    const response = await axiosInstance.get(
        `/marks/course/${courseId}`
    );

    return response.data;
};


// =========================================================
// TEACHER - ADD MARKS
// =========================================================

export const addMarks = async (data) => {
    const response = await axiosInstance.post(
        `/marks`,
        data
    );

    return response.data;
};


// =========================================================
// TEACHER - UPDATE MARKS
// =========================================================

export const updateMarks = async (id, data) => {
    const response = await axiosInstance.put(
        `/marks/${id}`,
        data
    );

    return response.data;
};


// =========================================================
// TEACHER - DELETE MARKS
// =========================================================

export const deleteMarks = async (id) => {
    await axiosInstance.delete(
        `/marks/${id}`
    );
};

