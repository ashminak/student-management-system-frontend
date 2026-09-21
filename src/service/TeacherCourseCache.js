import {
    getCoursesByTeacherId,
    getCourseById,
} from "./CourseService";

import {
    getStudentsByCourseId,
} from "./EnrollmentService";


// =============================================================
// TEACHER COURSES CACHE
// =============================================================

const coursesCache = new Map();

const coursesPromises = new Map();

const CACHE_TIME = 60 * 1000;


// =============================================================
// SAFE ARRAY
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
// FETCH TEACHER COURSES
// =============================================================

const fetchTeacherCourses = async (
    teacherId
) => {

    try {

        // -----------------------------------------------------
        // GET COURSES ASSIGNED TO TEACHER
        // -----------------------------------------------------

        const teacherCoursesResponse =
            await getCoursesByTeacherId(
                teacherId
            );


        const teacherCourses =
            toArray(
                teacherCoursesResponse
            );


        // -----------------------------------------------------
        // GET COURSE DETAILS + STUDENTS
        // IN PARALLEL FOR EACH COURSE
        // -----------------------------------------------------

        const courses =
            await Promise.all(

                teacherCourses.map(
                    async (teacherCourse) => {

                        const courseId =
                            teacherCourse.courseId;


                        try {

                            const [
                                courseDetailsResponse,
                                studentDetailsResponse,
                            ] = await Promise.all([

                                getCourseById(
                                    courseId
                                ),

                                getStudentsByCourseId(
                                    courseId
                                ),

                            ]);


                            const courseDetails =
                                courseDetailsResponse?.data ??
                                courseDetailsResponse ??
                                {};


                            const studentDetails =
                                toArray(
                                    studentDetailsResponse
                                );


                            return {

                                ...courseDetails,

                                students:
                                    studentDetails,

                            };

                        } catch (error) {

                            console.error(
                                `Failed to load course ${courseId}`,
                                error
                            );


                            return null;
                        }
                    }
                )
            );


        // Remove failed/null courses.
        const validCourses =
            courses.filter(
                Boolean
            );


        // -----------------------------------------------------
        // SAVE CACHE
        // -----------------------------------------------------

        coursesCache.set(
            teacherId,
            {
                data: validCourses,
                timestamp: Date.now(),
            }
        );


        return validCourses;

    } finally {

        // Allow a future request after
        // the current request is finished.

        coursesPromises.delete(
            teacherId
        );
    }
};


// =============================================================
// GET CACHED COURSES
// =============================================================

export const getCachedTeacherCourses = async (
    teacherId
) => {

    if (
        teacherId === undefined ||
        teacherId === null
    ) {

        throw new Error(
            "Teacher profile ID is required."
        );
    }


    const cached =
        coursesCache.get(
            teacherId
        );


    const now =
        Date.now();


    // ---------------------------------------------------------
    // CACHE HIT
    // ---------------------------------------------------------

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
        coursesPromises.get(
            teacherId
        );


    if (existingPromise) {

        return existingPromise;
    }


    // ---------------------------------------------------------
    // START REQUEST
    // ---------------------------------------------------------

    const promise =
        fetchTeacherCourses(
            teacherId
        );


    coursesPromises.set(
        teacherId,
        promise
    );


    return promise;
};


// =============================================================
// FORCE REFRESH
// =============================================================

export const refreshTeacherCourses = async (
    teacherId
) => {

    if (
        teacherId === undefined ||
        teacherId === null
    ) {

        throw new Error(
            "Teacher profile ID is required."
        );
    }


    // Remove current cache.
    coursesCache.delete(
        teacherId
    );


    // Reuse an existing request.
    const existingPromise =
        coursesPromises.get(
            teacherId
        );


    if (existingPromise) {

        return existingPromise;
    }


    const promise =
        fetchTeacherCourses(
            teacherId
        );


    coursesPromises.set(
        teacherId,
        promise
    );


    return promise;
};


// =============================================================
// UPDATE CACHE MANUALLY
// =============================================================

export const updateTeacherCoursesCache = (
    teacherId,
    courses
) => {

    coursesCache.set(
        teacherId,
        {
            data: Array.isArray(courses)
                ? courses
                : [],
            timestamp: Date.now(),
        }
    );
};


// =============================================================
// CLEAR ONE TEACHER CACHE
// =============================================================

export const clearTeacherCoursesCache = (
    teacherId
) => {

    coursesCache.delete(
        teacherId
    );
};


// =============================================================
// CLEAR ALL
// =============================================================

export const clearAllTeacherCoursesCache = () => {

    coursesCache.clear();
};