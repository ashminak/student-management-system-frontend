import axiosInstance from "./AxiosInstance";


// =========================================================
// STUDENT - ALL COURSES
// =========================================================

export const getStudentMarks = async (profileId) => {

    const response =
        await axiosInstance.get(
            `/marks/student/${profileId}`
        );

    return response.data;
};


// =========================================================
// STUDENT - ONE COURSE
// =========================================================

export const getStudentMarksByCourse = async (
    profileId,
    courseId
) => {

    const response =
        await axiosInstance.get(
            `/marks/student/${profileId}/course/${courseId}`
        );

    return response.data;
};


// =========================================================
// TEACHER APIs
// =========================================================

export const getMarksByCourseId = async (
    courseId
) => {

    const response =
        await axiosInstance.get(
            `/marks/course/${courseId}`
        );

    return response.data;
};


export const addMarks = async (data) => {

    const response =
        await axiosInstance.post(
            `/marks`,
            data
        );

    return response.data;
};


export const updateMarks = async (
    id,
    data
) => {

    const response =
        await axiosInstance.put(
            `/marks/${id}`,
            data
        );

    return response.data;
};


export const deleteMarks = async (
    id
) => {

    await axiosInstance.delete(
        `/marks/${id}`
    );
};