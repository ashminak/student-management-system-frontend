import { useEffect, useMemo, useState } from "react";

import {
    IconActivity,
    IconArrowRight,
    IconBook2,
    IconFileDescription,
    IconUsers,
    IconRefresh,
} from "@tabler/icons-react";

import { Loader } from "@mantine/core";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    getCachedTeacherDashboard,
    refreshTeacherDashboard,
} from "../../../service/TeacherDashboardCache";


const Dashboard = () => {

    // =========================================================
    // REDUX / NAVIGATION
    // =========================================================

    const navigate = useNavigate();

    const user = useSelector(
        (state) => state.user
    );

    const teacherId = user?.profileId;

    const teacherName =
        user?.name || "Teacher";


    // =========================================================
    // STATE
    // =========================================================

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // =========================================================
    // FETCH DASHBOARD
    // =========================================================

    const fetchDashboard = async (
        forceRefresh = false
    ) => {

        if (
            teacherId === undefined ||
            teacherId === null
        ) {
            setLoading(false);
            return;
        }

        try {

            setLoading(true);
            setError(null);

            console.log(
                "CALLING DASHBOARD API WITH:",
                teacherId
            );

            const data =
                forceRefresh
                    ? await refreshTeacherDashboard(
                        teacherId
                    )
                    : await getCachedTeacherDashboard(
                        teacherId
                    );

            console.log(
                "DASHBOARD RESPONSE:",
                data
            );

            setDashboard(data);

        } catch (error) {

            console.error(
                "DASHBOARD ERROR:",
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

            setError(
                error?.response?.data?.errorMessage ||
                error?.response?.data?.message ||
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchDashboard();

    }, [teacherId]);


    // =========================================================
    // ATTENDANCE MAX VALUE
    // =========================================================

    const attendanceMax = useMemo(() => {

        const attendance =
            dashboard?.attendanceOverview ?? [];

        if (attendance.length === 0) {
            return 1;
        }

        return Math.max(
            ...attendance.map(
                (item) =>
                    (item.present || 0) +
                    (item.absent || 0)
            ),
            1
        );

    }, [dashboard]);


    // =========================================================
    // MARKS PERCENTAGE
    // =========================================================

    const marksPercentage = useMemo(() => {

        const submitted =
            dashboard?.marksSubmission?.submitted ?? 0;

        const pending =
            dashboard?.marksSubmission?.pending ?? 0;

        const total =
            submitted + pending;

        if (total === 0) {
            return 0;
        }

        return Math.round(
            (submitted / total) * 100
        );

    }, [dashboard]);


    // =========================================================
    // CURRENT DATE
    // =========================================================

    const currentDate =
        new Date().toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );


    // =========================================================
    // GREETING
    // =========================================================

    const currentHour =
        new Date().getHours();

    const greeting =
        currentHour < 12
            ? "Good Morning"
            : currentHour < 17
                ? "Good Afternoon"
                : "Good Evening";


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center">

                <Loader
                    size="md"
                    color="#51021E"
                />

            </div>
        );
    }


    // =========================================================
    // TEACHER ID NOT AVAILABLE
    // =========================================================

    if (
        teacherId === undefined ||
        teacherId === null
    ) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center px-5">

                <div className="rounded-2xl border border-[#eadde2] bg-white p-8 text-center shadow-sm">

                    <h2 className="text-lg font-bold text-[#1D2939]">
                        Teacher information not available
                    </h2>

                    <p className="mt-2 text-sm text-[#667085]">
                        Please login again to load your dashboard.
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // API ERROR
    // =========================================================

    if (error || !dashboard) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center px-5">

                <div className="w-full max-w-md rounded-2xl border border-[#eadde2] bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#faf0f5]">

                        <IconRefresh
                            size={26}
                            className="text-[#51021E]"
                        />

                    </div>

                    <h2 className="mt-4 text-lg font-bold text-[#1D2939]">
                        Dashboard could not be loaded
                    </h2>

                    <p className="mt-2 text-sm text-[#667085]">
                        {error ||
                            "No dashboard data was returned."}
                    </p>

                    <button
                        onClick={fetchDashboard}
                        className="mt-5 rounded-lg bg-[#51021E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D1535]"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    // =========================================================
    // DATA SAFETY
    // =========================================================

    const courses =
        dashboard.courses ?? [];

    const attendanceOverview =
        dashboard.attendanceOverview ?? [];

    const recentActivities =
        dashboard.recentActivities ?? [];

    const marksSubmission =
        dashboard.marksSubmission ?? {
            submitted: 0,
            pending: 0,
        };


    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="min-h-screen bg-[#faf6f8] p-5 md:p-7">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

                <div>

                    <p className="text-sm text-[#667085]">
                        {greeting},
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-[#1D2939]">
                        {dashboard.teacherName ||
                            teacherName}
                        ! 👋
                    </h1>

                    <p className="mt-1 text-sm text-[#667085]">
                        Here&apos;s an overview of your teaching activities.
                    </p>

                </div>

                <p className="text-sm font-medium text-[#667085]">
                    {currentDate}
                </p>

            </div>


            {/* =================================================
                STATS
            ================================================= */}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {/* My Courses */}

                <DashboardStat
                    icon={
                        <IconBook2
                            size={25}
                        />
                    }
                    title="My Courses"
                    value={
                        dashboard.totalCourses ?? 0
                    }
                    text="View Courses"
                    onClick={() =>
                        navigate(
                            "/teacher/courses"
                        )
                    }
                />


                {/* Total Students */}

                <DashboardStat
                    icon={
                        <IconUsers
                            size={25}
                        />
                    }
                    title="Total Students"
                    value={
                        dashboard.totalStudents ?? 0
                    }
                    text="View Courses"
                    onClick={() =>
                        navigate(
                            "/teacher/courses"
                        )
                    }
                    green
                />


                {/* Pending Marks */}

                <DashboardStat
                    icon={
                        <IconFileDescription
                            size={25}
                        />
                    }
                    title="Pending Marks"
                    value={
                        dashboard.pendingMarks ?? 0
                    }
                    text="Manage Marks"
                    onClick={() =>
                        navigate(
                            "/teacher/courses"
                        )
                    }
                />

            </div>


            {/* =================================================
                MY COURSES
            ================================================= */}

            <div className="mt-6 rounded-2xl border border-[#eadde2] bg-white shadow-sm">

                <DashboardHeader
                    icon={
                        <IconBook2
                            size={21}
                        />
                    }
                    title="My Courses"
                    onClick={() =>
                        navigate(
                            "/teacher/courses"
                        )
                    }
                />


                <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">

                    {courses.length > 0 ? (

                        courses.map((course) => (

                            <button
                                key={
                                    course.courseId
                                }
                                onClick={() =>
                                    navigate(
                                        `/teacher/courses/${course.courseId}/students`
                                    )
                                }
                                className="
                                    group
                                    rounded-xl
                                    border
                                    border-[#eadde2]
                                    bg-white
                                    p-5
                                    text-left
                                    transition-all
                                    duration-200
                                    hover:-translate-y-1
                                    hover:border-[#d8a5b6]
                                    hover:bg-[#fffafb]
                                    hover:shadow-md
                                "
                            >

                                {/* Course Code */}

                                <div className="flex items-start justify-between">

                                    <span
                                        className="
                                            rounded-lg
                                            bg-[#faf0f5]
                                            px-3
                                            py-2
                                            text-xs
                                            font-bold
                                            text-[#51021E]
                                        "
                                    >
                                        {course.courseCode ||
                                            "COURSE"}
                                    </span>

                                    <IconArrowRight
                                        size={18}
                                        className="
                                            text-[#98A2B3]
                                            transition
                                            duration-200
                                            group-hover:translate-x-1
                                            group-hover:text-[#51021E]
                                        "
                                    />

                                </div>


                                {/* Course Name */}

                                <h3 className="mt-4 line-clamp-2 text-base font-bold text-[#1D2939]">

                                    {course.courseName ||
                                        "Course Name"}

                                </h3>


                                {/* Course Metadata */}

                                <div className="mt-3 flex flex-wrap gap-2">

                                    {course.credits !==
                                        null &&
                                        course.credits !==
                                        undefined && (

                                        <span
                                            className="
                                                rounded-full
                                                bg-[#f7f7f8]
                                                px-2.5
                                                py-1
                                                text-[11px]
                                                font-medium
                                                text-[#667085]
                                            "
                                        >
                                            {course.credits}
                                            {" "}
                                            Credits
                                        </span>

                                    )}


                                    {course.courseType && (

                                        <span
                                            className="
                                                rounded-full
                                                bg-[#f7f7f8]
                                                px-2.5
                                                py-1
                                                text-[11px]
                                                font-medium
                                                text-[#667085]
                                            "
                                        >
                                            {course.courseType}
                                        </span>

                                    )}

                                </div>


                                {/* Student Count */}

                                <div className="mt-5 border-t border-[#f1e6ea] pt-4">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs text-[#667085]">
                                                Enrolled Students
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-[#51021E]">
                                                {course.studentCount ??
                                                    0}
                                            </p>

                                        </div>


                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf0f5]">

                                            <IconUsers
                                                size={17}
                                                className="text-[#51021E]"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </button>

                        ))

                    ) : (

                        <div className="col-span-full py-12 text-center">

                            <IconBook2
                                size={34}
                                className="mx-auto text-[#d8a5b6]"
                            />

                            <p className="mt-3 text-sm font-medium text-[#667085]">
                                No courses assigned yet.
                            </p>

                            <p className="mt-1 text-xs text-[#98A2B3]">
                                Your assigned courses will appear here.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                ANALYTICS SECTION
            ================================================= */}

            <div className="mt-6 grid gap-6 xl:grid-cols-3">


                {/* =================================================
                    ATTENDANCE OVERVIEW
                ================================================= */}

                <div className="rounded-2xl border border-[#eadde2] bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <IconActivity
                                size={20}
                                className="text-[#51021E]"
                            />

                            <h2 className="font-bold text-[#1D2939]">
                                Attendance Overview
                            </h2>

                        </div>

                        <span
                            className="
                                rounded-full
                                bg-[#faf0f5]
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-[#51021E]
                            "
                        >
                            This Week
                        </span>

                    </div>


                    {/* Chart */}

                    <div className="flex h-52 items-end justify-between gap-3">

                        {attendanceOverview.map(
                            (item) => {

                                const present =
                                    item.present ?? 0;

                                const absent =
                                    item.absent ?? 0;

                                const total =
                                    present +
                                    absent;

                                const totalHeight =
                                    total > 0
                                        ? (total /
                                            attendanceMax) *
                                        100
                                        : 0;

                                const presentHeight =
                                    total > 0
                                        ? (present /
                                            total) *
                                        100
                                        : 0;

                                const absentHeight =
                                    total > 0
                                        ? (absent /
                                            total) *
                                        100
                                        : 0;


                                return (
                                    <div
                                        key={
                                            item.day
                                        }
                                        className="flex h-full flex-1 flex-col items-center justify-end"
                                    >

                                        <div
                                            className="
                                                flex
                                                w-full
                                                max-w-[30px]
                                                flex-col
                                                justify-end
                                                overflow-hidden
                                                rounded-t-md
                                                bg-[#f8e1e8]
                                            "
                                            style={{
                                                height:
                                                    `${totalHeight}%`,
                                            }}
                                        >

                                            <div
                                                className="w-full bg-[#51021E]"
                                                style={{
                                                    height:
                                                        `${presentHeight}%`,
                                                }}
                                                title={`Present: ${present}`}
                                            />

                                            {absent > 0 && (

                                                <div
                                                    className="w-full bg-[#f3bdce]"
                                                    style={{
                                                        height:
                                                            `${absentHeight}%`,
                                                    }}
                                                    title={`Absent: ${absent}`}
                                                />

                                            )}

                                        </div>


                                        <span className="mt-2 text-xs font-medium text-[#667085]">
                                            {item.day}
                                        </span>

                                    </div>
                                );
                            }
                        )}

                    </div>


                    {/* Legend */}

                    <div className="mt-5 flex justify-center gap-6 text-xs text-[#667085]">

                        <div className="flex items-center gap-2">

                            <span className="h-2.5 w-2.5 rounded-full bg-[#51021E]" />

                            Present

                        </div>

                        <div className="flex items-center gap-2">

                            <span className="h-2.5 w-2.5 rounded-full bg-[#f3bdce]" />

                            Absent

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MARKS SUBMISSION
                ================================================= */}

                <div className="rounded-2xl border border-[#eadde2] bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <IconFileDescription
                                size={20}
                                className="text-[#51021E]"
                            />

                            <h2 className="font-bold text-[#1D2939]">
                                Marks Submission
                            </h2>

                        </div>

                        <span
                            className="
                                rounded-full
                                bg-[#faf0f5]
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-[#51021E]
                            "
                        >
                            Current
                        </span>

                    </div>


                    <div className="flex flex-col items-center justify-center gap-7 py-4 sm:flex-row">

                        {/* Donut */}

                        <div
                            className="
                                flex
                                h-36
                                w-36
                                items-center
                                justify-center
                                rounded-full
                            "
                            style={{
                                background:
                                    `conic-gradient(
                                        #51021E ${marksPercentage}%,
                                        #f3bdce ${marksPercentage}% 100%
                                    )`,
                            }}
                        >

                            <div
                                className="
                                    flex
                                    h-24
                                    w-24
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white
                                "
                            >

                                <span className="text-2xl font-bold text-[#1D2939]">
                                    {marksPercentage}%
                                </span>

                                <span className="text-xs text-[#667085]">
                                    Submitted
                                </span>

                            </div>

                        </div>


                        {/* Values */}

                        <div className="space-y-4 text-sm">

                            <div className="flex items-center justify-between gap-5">

                                <div className="flex items-center gap-2">

                                    <span className="h-3 w-3 rounded-full bg-[#51021E]" />

                                    <span className="text-[#667085]">
                                        Submitted
                                    </span>

                                </div>

                                <strong className="text-[#1D2939]">
                                    {
                                        marksSubmission.submitted ??
                                        0
                                    }
                                </strong>

                            </div>


                            <div className="flex items-center justify-between gap-5">

                                <div className="flex items-center gap-2">

                                    <span className="h-3 w-3 rounded-full bg-[#f3bdce]" />

                                    <span className="text-[#667085]">
                                        Pending
                                    </span>

                                </div>

                                <strong className="text-[#1D2939]">
                                    {
                                        marksSubmission.pending ??
                                        0
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RECENT ACTIVITIES
                ================================================= */}

                <div className="rounded-2xl border border-[#eadde2] bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <IconActivity
                                size={20}
                                className="text-[#51021E]"
                            />

                            <h2 className="font-bold text-[#1D2939]">
                                Recent Activities
                            </h2>

                        </div>

                        <span
                            className="
                                rounded-full
                                bg-[#faf0f5]
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-[#51021E]
                            "
                        >
                            Latest
                        </span>

                    </div>


                    {recentActivities.length > 0 ? (

                        <div className="space-y-5">

                            {recentActivities.map(
                                (activity, index) => (

                                    <div
                                        key={
                                            `${activity.timestamp || ""}-${index}`
                                        }
                                        className="flex gap-3"
                                    >

                                        {/* Timeline */}

                                        <div className="relative flex flex-col items-center">

                                            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#51021E]" />

                                            {index !==
                                                recentActivities.length -
                                                1 && (

                                                <div
                                                    className="
                                                        mt-1
                                                        h-full
                                                        w-px
                                                        bg-[#eadde2]
                                                    "
                                                />

                                            )}

                                        </div>


                                        {/* Activity */}

                                        <div className="pb-1">

                                            <p className="text-sm font-medium leading-5 text-[#344054]">
                                                {activity.message}
                                            </p>

                                            <p className="mt-1 text-xs text-[#98A2B3]">
                                                {activity.time}
                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="flex min-h-[220px] items-center justify-center text-center">

                            <div>

                                <IconActivity
                                    size={34}
                                    className="mx-auto text-[#d8a5b6]"
                                />

                                <p className="mt-3 text-sm font-semibold text-[#667085]">
                                    No recent activity
                                </p>

                                <p className="mt-1 max-w-[220px] text-xs leading-5 text-[#98A2B3]">
                                    Attendance and enrollment activity will appear here.
                                </p>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};


// =========================================================
// STAT CARD
// =========================================================

const DashboardStat = ({
    icon,
    title,
    value,
    text,
    onClick,
    green,
}) => {

    return (
        <div
            className={`
                rounded-2xl
                border
                bg-white
                p-5
                shadow-sm
                transition
                hover:shadow-md
                ${
                    green
                        ? "border-[#dcefe4]"
                        : "border-[#eadde2]"
                }
            `}
        >

            <div className="flex items-center gap-4">

                <div
                    className={`
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${
                            green
                                ? "bg-[#e8f7ed] text-[#287d48]"
                                : "bg-[#fae7ee] text-[#51021E]"
                        }
                    `}
                >
                    {icon}
                </div>


                <div>

                    <p className="text-sm text-[#667085]">
                        {title}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[#1D2939]">
                        {value}
                    </p>

                </div>

            </div>


            <button
                onClick={onClick}
                className="
                    mt-4
                    flex
                    items-center
                    gap-1
                    text-sm
                    font-semibold
                    text-[#51021E]
                    transition
                    hover:text-[#6D1535]
                "
            >

                {text}

                <IconArrowRight
                    size={15}
                />

            </button>

        </div>
    );
};


// =========================================================
// SECTION HEADER
// =========================================================

const DashboardHeader = ({
    icon,
    title,
    onClick,
}) => {

    return (
        <div className="flex items-center justify-between border-b border-[#f1e6ea] px-6 py-5">

            <div className="flex items-center gap-2">

                <span className="text-[#51021E]">
                    {icon}
                </span>

                <h2 className="font-bold text-[#1D2939]">
                    {title}
                </h2>

            </div>


            <button
                onClick={onClick}
                className="
                    flex
                    items-center
                    gap-1
                    text-sm
                    font-semibold
                    text-[#51021E]
                    transition
                    hover:text-[#6D1535]
                "
            >

                View All

                <IconArrowRight
                    size={15}
                />

            </button>

        </div>
    );
};


export default Dashboard;