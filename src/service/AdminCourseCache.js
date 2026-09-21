import {
    getAllCourses,
    getTeachersByCourseId,
} from "./CourseService";

import {
    getTeacherDropdowns,
} from "./TeacherProfileService";


let courseCache = null;

let coursePromise = null;

let courseCacheTime = 0;


// Cache for 60 seconds.
const CACHE_TIME = 60 * 1000;


// =============================================================
// SAFE ARRAY HELPER
// =============================================================

const toArray = (value) => {

    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.data)) {
        return value.data;
    }

    return [];
};


// =============================================================
// FETCH COURSE DATA
// =============================================================

const fetchCourseData = async () => {

    try {

        // -----------------------------------------------------
        // Load courses + all teachers together
        // -----------------------------------------------------

        const [
            coursesResponse,
            teachersResponse,
        ] = await Promise.all([

            getAllCourses(),

            getTeacherDropdowns(),

        ]);


        const courses =
            toArray(coursesResponse);


        const allTeachers =
            toArray(teachersResponse);


        // -----------------------------------------------------
        // Load assigned teachers for each course
        // -----------------------------------------------------

        const coursesWithTeachers =
            await Promise.all(

                courses.map(
                    async (course) => {

                        try {

                            const response =
                                await getTeachersByCourseId(
                                    course.id
                                );


                            const assignedTeachers =
                                toArray(response);


                            return {
                                ...course,

                                teacherEmails:
                                    assignedTeachers
                                        .map(
                                            (teacher) =>
                                                teacher?.email
                                        )
                                        .filter(Boolean),

                                assignedTeachers,

                            };

                        } catch (error) {

                            console.error(
                                `Failed to get teachers for course ${course.id}`,
                                error
                            );


                            return {
                                ...course,

                                teacherEmails: [],

                                assignedTeachers: [],
                            };
                        }
                    }
                )
            );


        // -----------------------------------------------------
        // ALWAYS RETURN THE SAME SHAPE
        // -----------------------------------------------------

        const result = {

            courses:
                coursesWithTeachers,

            teachers:
                allTeachers,

        };


        courseCache =
            result;


        courseCacheTime =
            Date.now();


        return result;

    } finally {

        coursePromise = null;
    }
};


// =============================================================
// GET CACHED COURSE DATA
// =============================================================

export const getCachedCourses = async () => {

    const now =
        Date.now();


    // ---------------------------------------------------------
    // CACHE HIT
    // ---------------------------------------------------------

    if (
        courseCache &&
        now - courseCacheTime < CACHE_TIME
    ) {

        return courseCache;
    }


    // ---------------------------------------------------------
    // REQUEST ALREADY RUNNING
    // ---------------------------------------------------------

    if (coursePromise) {

        return coursePromise;
    }


    // ---------------------------------------------------------
    // NEW REQUEST
    // ---------------------------------------------------------

    coursePromise =
        fetchCourseData();


    return coursePromise;
};


// =============================================================
// CLEAR CACHE
// =============================================================

export const clearCourseCache = () => {

    courseCache = null;

    courseCacheTime = 0;
};


// =============================================================
// FORCE REFRESH
// =============================================================

export const refreshCourses = async () => {

    clearCourseCache();

    return getCachedCourses();
};