import React, {
    useState,
    useEffect,
    useMemo,
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import {
    useSelector
} from 'react-redux';

import {
    Button
} from '@mantine/core';

import {
    IconBook,
    IconBrandCodesandbox,
    IconClockCheck,
    IconUsers,
    IconUser,
    IconCircleFilled,
    IconSearch,
    IconReportAnalytics,
    IconClipboardCheck
} from "@tabler/icons-react";


// =============================================================
// CACHE
// =============================================================

import {
    getCachedTeacherCourses,
    refreshTeacherCourses,
} from '../../../service/TeacherCourseCache';


const Courses = () => {

    const navigate =
        useNavigate();


    // =========================================================
    // USER
    // =========================================================

    const teacherDetails =
        useSelector(
            (state) => state.user
        );


    const teacherId =
        teacherDetails?.profileId;


    // =========================================================
    // STATE
    // =========================================================

    const [
        courses,
        setCourses
    ] = useState([]);


    const [
        selectedCourse,
        setSelectedCourse
    ] = useState(null);


    const [
        search,
        setSearch
    ] = useState("");


    const [
        statusFilter,
        setStatusFilter
    ] = useState("ALL");


    const [
        typeFilter,
        setTypeFilter
    ] = useState("ALL");


    // =========================================================
    // FETCH COURSES
    // =========================================================

    const fetchCourses = async (
        forceRefresh = false
    ) => {

        if (
            teacherId === undefined ||
            teacherId === null
        ) {

            setCourses([]);

            return;
        }


        try {

            const data =
                forceRefresh
                    ? await refreshTeacherCourses(
                        teacherId
                    )
                    : await getCachedTeacherCourses(
                        teacherId
                    );


            setCourses(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "GET COURSES ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "RESPONSE:",
                error.response?.data
            );


            setCourses([]);
        }
    };


    // =========================================================
    // INITIAL FETCH
    // =========================================================

    useEffect(() => {

        fetchCourses();

    }, [
        teacherId
    ]);


    // =========================================================
    // FILTERED COURSES
    // =========================================================

    const filteredCourses =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return courses.filter(
                (course) => {

                    const courseName =
                        (
                            course.courseName ||
                            ""
                        ).toLowerCase();


                    const courseCode =
                        (
                            course.courseCode ||
                            ""
                        ).toLowerCase();


                    const matchesSearch =
                        courseName.includes(
                            searchValue
                        ) ||
                        courseCode.includes(
                            searchValue
                        );


                    const matchesStatus =
                        statusFilter === "ALL" ||
                        course.status ===
                            statusFilter;


                    const matchesType =
                        typeFilter === "ALL" ||
                        course.courseType ===
                            typeFilter;


                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesType
                    );
                }
            );

        }, [
            courses,
            search,
            statusFilter,
            typeFilter,
        ]);


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                min-h-screen
                bg-slate-50
            "
        >

            <div
                className="
                    flex
                    justify-between
                "
            >

                <div
                    className="
                        flex
                        flex-col
                    "
                >

                    <h1
                        className="
                            text-[28px]
                            font-bold
                            leading-tight
                            text-[#172033]
                            tracking-[-0.5px]
                            pl-4
                            pt-2
                        "
                    >
                        My Courses
                    </h1>


                    <p
                        className="
                            mt-1
                            text-[15px]
                            font-medium
                            text-[#64748B]
                            pl-4
                            pt-1
                        "
                    >
                        Courses Overview
                    </p>

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-5
                        mt-6
                    "
                >

                    {/* Search */}

                    <div
                        className="
                            relative
                            w-[280px]
                        "
                    >

                        <IconSearch
                            size={16}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />


                        <input

                            type="text"

                            placeholder="
                                Search courses...
                            "

                            value={
                                search
                            }

                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }

                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                px-4
                                py-2.5
                                pl-10
                                text-sm
                                outline-none
                                focus:border-[#51021E]
                                focus:ring-2
                                focus:ring-[#51021E]/10
                            "
                        />

                    </div>


                    {/* Filters */}

                    <div
                        className="
                            flex
                            gap-3
                        "
                    >

                        <select

                            value={
                                statusFilter
                            }

                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }

                            className="
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                text-gray-700
                                outline-none
                                focus:border-[#51021E]
                            "
                        >

                            <option value="ALL">
                                All Status
                            </option>


                            <option value="ACTIVE">
                                Active
                            </option>


                            <option value="INACTIVE">
                                Inactive
                            </option>

                        </select>


                        <select

                            value={
                                typeFilter
                            }

                            onChange={(e) =>
                                setTypeFilter(
                                    e.target.value
                                )
                            }

                            className="
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                text-gray-700
                                outline-none
                                focus:border-[#51021E]
                            "
                        >

                            <option value="ALL">
                                All Types
                            </option>


                            <option value="ONLINE">
                                Online
                            </option>


                            <option value="OFFLINE">
                                Offline
                            </option>

                        </select>

                    </div>

                </div>

            </div>


            <div
                className="
                    flex
                    flex-wrap
                    gap-5
                    p-4
                    justify-center
                "
            >

                {filteredCourses.map(
                    (course) => (

                        <div

                            key={
                                course.id
                            }

                            className="
                                group
                                flex
                                min-h-[40px]
                                w-full
                                max-w-[680px]
                                flex-col
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition-all
                                duration-200
                                hover:-translate-y-1
                                hover:shadow-lg
                            "
                        >

                            {/* Course Header */}

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-4
                                "
                            >

                                {/* Course Icon */}

                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#fce7ec]
                                        text-[#51021E]
                                    "
                                >

                                    <IconBook
                                        size={30}
                                        stroke={3}
                                    />

                                </div>


                                {/* Course Name */}

                                <div
                                    className="
                                        min-w-0
                                    "
                                >

                                    <h3
                                        className="
                                            text-[20px]
                                            font-bold
                                            leading-7
                                            text-slate-800
                                        "
                                    >

                                        {
                                            course.courseName
                                        }

                                    </h3>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-medium
                                            text-slate-500
                                        "
                                    >

                                        {
                                            course.courseCode
                                        }

                                    </p>

                                </div>

                            </div>


                            {/* Course Metadata */}

                            <div
                                className="
                                    mt-3
                                    flex
                                    items-center
                                    gap-3
                                    ml-10
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >

                                    <i
                                        className="
                                            pi
                                            pi-bookmark
                                            text-xs
                                            text-slate-400
                                            ml-4
                                        "
                                    >

                                        <IconBrandCodesandbox
                                            size={15}
                                            stroke={2}
                                        />

                                    </i>


                                    {
                                        course.credits
                                    }
                                    {" "}
                                    Credits

                                </div>

                            </div>


                            {/* Type + Status */}

                            <div
                                className="
                                    mt-4
                                    flex
                                    items-center
                                    gap-2ml-10
                                "
                            >

                                <span
                                    className="
                                        rounded-full
                                        bg-slate-100
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-slate-600
                                        ml-12
                                    "
                                >

                                    {
                                        course.courseType
                                    }

                                </span>


                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-semibold

                                        ${
                                            course.status ===
                                            "ACTIVE"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-red-50 text-red-700"
                                        }
                                    `}
                                >

                                    {course.status ===
                                        "ACTIVE" && (

                                        <IconCircleFilled
                                            size={7}
                                        />

                                    )}


                                    {
                                        course.status
                                    }

                                </span>

                            </div>


                            {/* Divider */}

                            <div
                                className="
                                    my-5
                                    border-t
                                    border-slate-100
                                "
                            />


                            {/* Description */}

                            <div>

                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-slate-600
                                    "
                                >

                                    {
                                        course.description
                                    }

                                </p>

                            </div>


                            {/* Course Details */}

                            <div
                                className="
                                    mt-6
                                    space-y-3
                                    rounded-xl
                                    bg-slate-50
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        justify-between
                                        text-sm
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span>
                                            <IconClockCheck
                                                stroke={2}
                                            />
                                        </span>


                                        <span
                                            className="
                                                font-medium
                                                text-slate-500
                                            "
                                        >
                                            Duration
                                        </span>

                                    </div>


                                    <span
                                        className="
                                            font-semibold
                                            text-slate-800
                                        "
                                    >
                                        {
                                            course.duration
                                        }
                                    </span>

                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        text-sm
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span>
                                            <IconUsers
                                                stroke={2}
                                            />
                                        </span>


                                        <span
                                            className="
                                                font-medium
                                                text-slate-500
                                            "
                                        >
                                            Students
                                        </span>

                                    </div>


                                    <span
                                        className="
                                            font-semibold
                                            text-slate-800
                                        "
                                    >
                                        {
                                            course.students
                                                ?.length || 0
                                        }
                                    </span>

                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        text-sm
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span>
                                            <IconUser
                                                stroke={2}
                                            />
                                        </span>


                                        <span
                                            className="
                                                font-medium
                                                text-slate-500
                                            "
                                        >
                                            Teacher
                                        </span>

                                    </div>


                                    <span
                                        className="
                                            font-semibold
                                            text-slate-800
                                        "
                                    >
                                        {
                                            teacherDetails?.name ||
                                            "Teacher"
                                        }
                                    </span>

                                </div>

                            </div>


                            {/* Button */}

                            <div
                                className="
                                    flex
                                    gap-3
                                "
                            >

                                <Button

                                    fullWidth

                                    leftSection={
                                        <IconUsers
                                            size={18}
                                        />
                                    }

                                    onClick={() =>
                                        navigate(
                                            `/teacher/courses/${course.id}/students`
                                        )
                                    }

                                    className="
                                        !bg-[#51021E]
                                        hover:!bg-[#6D1535]
                                    "
                                >
                                    Students
                                </Button>


                                <Button

                                    fullWidth

                                    leftSection={
                                        <IconReportAnalytics
                                            size={18}
                                        />
                                    }

                                    onClick={() =>
                                        navigate(
                                            `/teacher/courses/${course.id}/marks`
                                        )
                                    }

                                    className="
                                        !bg-[#51021E]
                                        hover:!bg-[#6D1535]
                                    "
                                >
                                    Marks
                                </Button>


                                <Button

                                    fullWidth

                                    leftSection={
                                        <IconClipboardCheck
                                            size={18}
                                        />
                                    }

                                    onClick={() =>
                                        navigate(
                                            `/teacher/courses/${course.id}/attendance`
                                        )
                                    }

                                    className="
                                        !bg-[#51021E]
                                        hover:!bg-[#6D1535]
                                    "
                                >
                                    Attendance
                                </Button>

                            </div>

                        </div>

                    )
                )}

            </div>

        </div>
    );
};


export default Courses;