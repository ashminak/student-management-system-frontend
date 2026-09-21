import { getAllEnrollments } from "./EnrollmentService";


// =============================================================
// ENROLLMENT CACHE
// =============================================================

let enrollmentCache = null;

let enrollmentCacheTime = 0;

let enrollmentPromise = null;


// Keep data fresh for 60 seconds.
const CACHE_TIME = 60 * 1000;


// =============================================================
// NORMALIZE API RESPONSE
// =============================================================

const normalizeEnrollments = (response) => {

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
};


// =============================================================
// FETCH ENROLLMENTS
// =============================================================

const fetchEnrollments = async () => {

    try {

        const response =
            await getAllEnrollments();


        const data =
            normalizeEnrollments(
                response
            );


        enrollmentCache =
            data;


        enrollmentCacheTime =
            Date.now();


        return data;

    } finally {

        // Allow another request after
        // the current request finishes.
        enrollmentPromise = null;
    }
};


// =============================================================
// GET CACHED ENROLLMENTS
// =============================================================

export const getCachedEnrollments = async () => {

    const now =
        Date.now();


    // ---------------------------------------------------------
    // CACHE HIT
    // ---------------------------------------------------------

    if (
        enrollmentCache !== null &&
        now - enrollmentCacheTime < CACHE_TIME
    ) {

        return enrollmentCache;
    }


    // ---------------------------------------------------------
    // REQUEST ALREADY RUNNING
    // ---------------------------------------------------------

    if (enrollmentPromise) {

        return enrollmentPromise;
    }


    // ---------------------------------------------------------
    // START NEW REQUEST
    // ---------------------------------------------------------

    enrollmentPromise =
        fetchEnrollments();


    return enrollmentPromise;
};


// =============================================================
// FORCE REFRESH
// =============================================================

export const refreshEnrollments = async () => {

    enrollmentCache = null;

    enrollmentCacheTime = 0;


    // Reuse current request if one
    // is already running.

    if (enrollmentPromise) {

        return enrollmentPromise;
    }


    enrollmentPromise =
        fetchEnrollments();


    return enrollmentPromise;
};


// =============================================================
// UPDATE CACHE
// =============================================================

export const updateEnrollmentCache = (
    data
) => {

    const normalized =
        normalizeEnrollments(
            data
        );


    enrollmentCache =
        normalized;


    enrollmentCacheTime =
        Date.now();
};


// =============================================================
// CLEAR CACHE
// =============================================================

export const clearEnrollmentCache = () => {

    enrollmentCache = null;

    enrollmentCacheTime = 0;
};