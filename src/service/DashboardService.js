import axiosInstance from '../Interceptor/AxiosInterceptor';

export const getTeacherDashboard = async (teacherId) => {
    const response = await axiosInstance.get(
        `/dashboard/teacher/${teacherId}`
    );

    return response.data;
};

export const getStudentDashboard = async (
    profileId
) => {

    const response =
        await axiosInstance.get(
            `/dashboard/student/${profileId}`
        );

    return response.data;
};

// =========================================================
// ADMIN DASHBOARD
// =========================================================

export const getAdminDashboard = async () => {
    const response = await axiosInstance.get(
        "/dashboard/admin"
    );

    return response.data;
};


