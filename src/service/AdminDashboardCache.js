import {
    getAdminDashboard,
} from "./DashboardService";


// =============================================================
// ADMIN DASHBOARD CACHE
// =============================================================

let dashboardCache = null;

let dashboardCacheTime = 0;

let dashboardPromise = null;


// Keep cached data fresh for 60 seconds.
const CACHE_TIME = 60 * 1000;


// =============================================================
// FETCH DASHBOARD
// =============================================================

const fetchDashboard = async () => {

    try {

        const data =
            await getAdminDashboard();


        dashboardCache = data;

        dashboardCacheTime =
            Date.now();


        return data;

    } finally {

        // Very important:
        // allow another request after the current request finishes.
        dashboardPromise = null;
    }
};


// =============================================================
// GET CACHED ADMIN DASHBOARD
// =============================================================

export const getCachedAdminDashboard = async () => {

    const now =
        Date.now();


    // ---------------------------------------------------------
    // 1. RETURN FRESH CACHE
    // ---------------------------------------------------------

    if (
        dashboardCache !== null &&
        now - dashboardCacheTime < CACHE_TIME
    ) {

        return dashboardCache;
    }


    // ---------------------------------------------------------
    // 2. REUSE EXISTING REQUEST
    // ---------------------------------------------------------

    if (dashboardPromise) {

        return dashboardPromise;
    }


    // ---------------------------------------------------------
    // 3. MAKE ONLY ONE REQUEST
    // ---------------------------------------------------------

    dashboardPromise =
        fetchDashboard();


    return dashboardPromise;
};


// =============================================================
// FORCE REFRESH
// =============================================================

export const refreshAdminDashboard = async () => {

    // If a refresh/fetch is already running,
    // reuse that same request.

    if (dashboardPromise) {

        return dashboardPromise;
    }


    dashboardPromise =
        fetchDashboard();


    return dashboardPromise;
};


// =============================================================
// CLEAR CACHE
// =============================================================

export const clearAdminDashboardCache = () => {

    dashboardCache = null;

    dashboardCacheTime = 0;
};