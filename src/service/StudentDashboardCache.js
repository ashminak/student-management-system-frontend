import { getStudentDashboard } from "./DashboardService";


// =============================================================
// STUDENT DASHBOARD CACHE
// =============================================================

const dashboardCache = new Map();

const dashboardPromises = new Map();

const CACHE_TIME = 60 * 1000;


// =============================================================
// GET CACHED DASHBOARD
// =============================================================

export const getCachedStudentDashboard = async (
    profileId
) => {

    if (
        profileId === undefined ||
        profileId === null
    ) {
        throw new Error(
            "Student profile ID is required."
        );
    }


    // ---------------------------------------------------------
    // CHECK CACHE
    // ---------------------------------------------------------

    const cached =
        dashboardCache.get(profileId);


    const now =
        Date.now();


    if (
        cached &&
        now - cached.timestamp < CACHE_TIME
    ) {

        return cached.data;
    }


    // ---------------------------------------------------------
    // CHECK REQUEST ALREADY RUNNING
    // ---------------------------------------------------------

    const existingPromise =
        dashboardPromises.get(
            profileId
        );


    if (existingPromise) {

        return existingPromise;
    }


    // ---------------------------------------------------------
    // MAKE API REQUEST
    // ---------------------------------------------------------

    const promise =
        getStudentDashboard(
            profileId
        )
            .then((data) => {

                dashboardCache.set(
                    profileId,
                    {
                        data,
                        timestamp: Date.now(),
                    }
                );


                return data;

            })
            .finally(() => {

                dashboardPromises.delete(
                    profileId
                );
            });


    dashboardPromises.set(
        profileId,
        promise
    );


    return promise;
};


// =============================================================
// FORCE REFRESH
// =============================================================

export const refreshStudentDashboard = async (
    profileId
) => {

    if (
        profileId === undefined ||
        profileId === null
    ) {

        throw new Error(
            "Student profile ID is required."
        );
    }


    // Remove old cache first.
    dashboardCache.delete(
        profileId
    );


    // If request is already running,
    // reuse it.

    const existingPromise =
        dashboardPromises.get(
            profileId
        );


    if (existingPromise) {

        return existingPromise;
    }


    const promise =
        getStudentDashboard(
            profileId
        )
            .then((data) => {

                dashboardCache.set(
                    profileId,
                    {
                        data,
                        timestamp: Date.now(),
                    }
                );


                return data;

            })
            .finally(() => {

                dashboardPromises.delete(
                    profileId
                );
            });


    dashboardPromises.set(
        profileId,
        promise
    );


    return promise;
};


// =============================================================
// UPDATE CACHE MANUALLY
// =============================================================

export const updateStudentDashboardCache = (
    profileId,
    data
) => {

    if (
        profileId === undefined ||
        profileId === null
    ) {
        return;
    }


    dashboardCache.set(
        profileId,
        {
            data,
            timestamp: Date.now(),
        }
    );
};


// =============================================================
// CLEAR ONE STUDENT CACHE
// =============================================================

export const clearStudentDashboardCache = (
    profileId
) => {

    dashboardCache.delete(
        profileId
    );
};


// =============================================================
// CLEAR ALL STUDENT DASHBOARD CACHE
// =============================================================

export const clearAllStudentDashboardCache = () => {

    dashboardCache.clear();
};