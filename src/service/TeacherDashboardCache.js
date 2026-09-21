import { getTeacherDashboard } from "./DashboardService";

// =============================================================
// TEACHER DASHBOARD CACHE
// =============================================================

const dashboardCache = new Map();

const dashboardPromises = new Map();

const CACHE_TIME = 60 * 1000;


// =============================================================
// GET CACHED TEACHER DASHBOARD
// =============================================================

export const getCachedTeacherDashboard = async (teacherId) => {

    if (
        teacherId === undefined ||
        teacherId === null
    ) {
        throw new Error("Teacher profile ID is required.");
    }


    // ---------------------------------------------------------
    // CACHE HIT
    // ---------------------------------------------------------

    const cached =
        dashboardCache.get(teacherId);

    const now =
        Date.now();

    if (
        cached &&
        now - cached.timestamp < CACHE_TIME
    ) {
        return cached.data;
    }


    // ---------------------------------------------------------
    // REQUEST ALREADY RUNNING
    // ---------------------------------------------------------

    const existingPromise =
        dashboardPromises.get(teacherId);

    if (existingPromise) {
        return existingPromise;
    }


    // ---------------------------------------------------------
    // NEW REQUEST
    // ---------------------------------------------------------

    const promise =
        getTeacherDashboard(teacherId)
            .then((data) => {

                dashboardCache.set(
                    teacherId,
                    {
                        data,
                        timestamp: Date.now(),
                    }
                );

                return data;

            })
            .finally(() => {

                dashboardPromises.delete(
                    teacherId
                );
            });


    dashboardPromises.set(
        teacherId,
        promise
    );


    return promise;
};


// =============================================================
// FORCE REFRESH
// =============================================================

export const refreshTeacherDashboard = async (teacherId) => {

    if (
        teacherId === undefined ||
        teacherId === null
    ) {
        throw new Error("Teacher profile ID is required.");
    }


    // Clear old cached data
    dashboardCache.delete(
        teacherId
    );


    // Reuse an existing request
    if (
        dashboardPromises.has(
            teacherId
        )
    ) {

        return dashboardPromises.get(
            teacherId
        );
    }


    const promise =
        getTeacherDashboard(teacherId)
            .then((data) => {

                dashboardCache.set(
                    teacherId,
                    {
                        data,
                        timestamp: Date.now(),
                    }
                );

                return data;

            })
            .finally(() => {

                dashboardPromises.delete(
                    teacherId
                );
            });


    dashboardPromises.set(
        teacherId,
        promise
    );


    return promise;
};


// =============================================================
// UPDATE CACHE
// =============================================================

export const updateTeacherDashboardCache = (
    teacherId,
    data
) => {

    if (
        teacherId === undefined ||
        teacherId === null
    ) {
        return;
    }


    dashboardCache.set(
        teacherId,
        {
            data,
            timestamp: Date.now(),
        }
    );
};


// =============================================================
// CLEAR ONE TEACHER
// =============================================================

export const clearTeacherDashboardCache = (
    teacherId
) => {

    dashboardCache.delete(
        teacherId
    );
};


// =============================================================
// CLEAR ALL
// =============================================================

export const clearAllTeacherDashboardCache = () => {

    dashboardCache.clear();
};