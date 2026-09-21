import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    IconArrowRight,
    IconBook2,
    IconCalendarCheck,
    IconChartBar,
    IconEdit,
    IconFileDescription,
    IconRefresh,
    IconStar,
    IconUser,
} from "@tabler/icons-react";

import { Loader } from "@mantine/core";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    getCachedStudentDashboard,
    refreshStudentDashboard,
} from "../../../service/StudentDashboardCache";


const StudentDashboardHome = () => {

    const navigate =
        useNavigate();


    // =========================================================
    // USER
    // =========================================================

    const user =
        useSelector(
            (state) => state.user
        );


    const profileId =
        user?.profileId;

    const studentName =
        user?.name || "Student";


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

    const fetchDashboard =
        async (forceRefresh = false) => {

            if (
                profileId === undefined ||
                profileId === null
            ) {

                setLoading(false);

                return;
            }


            try {

                setLoading(true);
                setError(null);


                const data =
                    forceRefresh
                        ? await refreshStudentDashboard(
                            profileId
                        )
                        : await getCachedStudentDashboard(
                            profileId
                        );


                console.log(
                    "STUDENT DASHBOARD:",
                    data
                );


                setDashboard(data);

            } catch (error) {

                console.error(
                    "STUDENT DASHBOARD ERROR:",
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
                    "Unable to load dashboard."
                );

            } finally {

                setLoading(false);
            }
        };


    useEffect(() => {

        fetchDashboard();

    }, [profileId]);


    // =========================================================
    // ACADEMIC PROGRESS
    // =========================================================

    const marksPercentage =
        useMemo(() => {

            const total =
                dashboard?.totalMarks || 0;

            const obtained =
                dashboard?.obtainedMarks || 0;

            if (total === 0) {
                return 0;
            }

            return Math.round(
                (obtained / total) *
                    100
            );

        }, [dashboard]);


    // =========================================================
    // DATE
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

    const hour =
        new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 17
                ? "Good Afternoon"
                : "Good Evening";


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center">

                <Loader
                    color="#51021E"
                />

            </div>
        );
    }


    // =========================================================
    // PROFILE ID ERROR
    // =========================================================

    if (
        profileId === undefined ||
        profileId === null
    ) {

        return (
            <DashboardError
                message="Student information is not available."
                onRetry={() =>
                    window.location.reload()
                }
            />
        );
    }


    // =========================================================
    // API ERROR
    // =========================================================

    if (error || !dashboard) {

        return (
            <DashboardError
                message={
                    error ||
                    "No dashboard data available."
                }
                onRetry={fetchDashboard}
            />
        );
    }


    const courses =
        dashboard.courses || [];


    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="min-h-screen bg-[#faf6f8] p-5 md:p-7">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                <div>

                    <p className="text-sm text-[#667085]">
                        {greeting},
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-[#1D2939]">
                        {studentName} 👋
                    </h1>

                    <p className="mt-1 text-sm text-[#667085]">
                        Here&apos;s an overview of your academic journey.
                        Keep up the great work!
                    </p>

                </div>


                <div className="rounded-xl bg-[#fff1f5] px-4 py-3">

                    <p className="text-xs text-[#667085]">
                        Today
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#51021E]">
                        {currentDate}
                    </p>

                </div>

            </div>


            {/* =================================================
                STATS
            ================================================= */}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <DashboardStat
                    icon={
                        <IconBook2
                            size={25}
                        />
                    }
                    title="Enrolled Courses"
                    value={
                        dashboard.totalCourses ??
                        0
                    }
                    text="View Enrollments"
                    onClick={() =>
                        navigate(
                            "/student/enrollments"
                        )
                    }
                />


                <DashboardStat
                    icon={
                        <IconFileDescription
                            size={25}
                        />
                    }
                    title="Average Marks"
                    value={`${Math.round(
                        dashboard.averageMarks ||
                        0
                    )}%`}
                    text="View My Marks"
                    onClick={() =>
                        navigate(
                            "/student/marks"
                        )
                    }
                    green
                />


                <DashboardStat
                    icon={
                        <IconChartBar
                            size={25}
                        />
                    }
                    title="Attendance"
                    value={`${Math.round(
                        dashboard.attendancePercentage ||
                        0
                    )}%`}
                    text="View Attendance"
                    onClick={() =>
                        navigate(
                            "/student/attendance"
                        )
                    }
                    blue
                />


                <DashboardStat
                    icon={
                        <IconStar
                            size={25}
                        />
                    }
                    title="CGPA"
                    value={
                        dashboard.cgpa ??
                        0
                    }
                    text="Overall Performance"
                    onClick={() =>
                        navigate(
                            "/student/marks"
                        )
                    }
                    purple
                />

            </div>


            {/* =================================================
                COURSES + ACADEMIC PROGRESS
            ================================================= */}

            <div className="mt-6 grid gap-6 xl:grid-cols-2">


                {/* =================================================
                    MY COURSES
                ================================================= */}

                <div className="rounded-2xl border border-[#eadde2] bg-white shadow-sm">

                    <DashboardHeader
                        icon={
                            <IconBook2
                                size={21}
                            />
                        }
                        title="My Courses"
                        onClick={() =>
                            navigate(
                                "/student/enrollments"
                            )
                        }
                    />


                    <div className="p-5">

                        {courses.length > 0 ? (

                            <div className="space-y-3">

                                {courses.map(
                                    (course) => (

                                        <button
                                            key={
                                                course.courseId
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/student/marks/${course.courseId}`
                                                )
                                            }
                                            className="
                                                group
                                                flex
                                                w-full
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                border-[#eadde2]
                                                p-4
                                                text-left
                                                transition
                                                hover:border-[#d7a4b6]
                                                hover:bg-[#fffafb]
                                            "
                                        >

                                            <div className="flex items-center gap-4">

                                                <div className="
                                                    flex
                                                    h-11
                                                    w-14
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-[#faf0f5]
                                                    text-xs
                                                    font-bold
                                                    text-[#51021E]
                                                ">
                                                    {
                                                        course.courseCode ||
                                                        "COURSE"
                                                    }
                                                </div>


                                                <div>

                                                    <p className="font-semibold text-[#1D2939]">

                                                        {
                                                            course.courseName ||
                                                            "Course"
                                                        }

                                                    </p>

                                                    <p className="mt-1 text-xs text-[#667085]">

                                                        {course.obtainedMarks ??
                                                            0}

                                                        {" / "}

                                                        {course.totalMarks ??
                                                            0}

                                                        {" marks"}

                                                    </p>

                                                </div>

                                            </div>


                                            <div className="flex items-center gap-3">

                                                <div className="text-right">

                                                    <p className="text-sm font-bold text-[#51021E]">
                                                        {Math.round(
                                                            course.percentage ||
                                                            0
                                                        )}
                                                        %
                                                    </p>

                                                    <p className="text-[10px] text-[#98A2B3]">
                                                        Performance
                                                    </p>

                                                </div>

                                                <IconArrowRight
                                                    size={18}
                                                    className="
                                                        text-[#98A2B3]
                                                        transition
                                                        group-hover:translate-x-1
                                                        group-hover:text-[#51021E]
                                                    "
                                                />

                                            </div>

                                        </button>
                                    )
                                )}

                            </div>

                        ) : (

                            <div className="py-12 text-center">

                                <IconBook2
                                    size={35}
                                    className="mx-auto text-[#d8a5b6]"
                                />

                                <p className="mt-3 text-sm font-semibold text-[#667085]">
                                    No enrolled courses
                                </p>

                            </div>
                        )}

                    </div>

                </div>


                {/* =================================================
                    ACADEMIC PROGRESS
                ================================================= */}

                <div className="rounded-2xl border border-[#eadde2] bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <IconChartBar
                                size={21}
                                className="text-[#51021E]"
                            />

                            <h2 className="font-bold text-[#1D2939]">
                                Academic Progress
                            </h2>

                        </div>

                    </div>


                    <div className="mt-7 flex flex-col items-center justify-center gap-8 sm:flex-row">

                        {/* DONUT */}

                        <div
                            className="
                                flex
                                h-44
                                w-44
                                items-center
                                justify-center
                                rounded-full
                            "
                            style={{
                                background:
                                    `conic-gradient(
                                        #55c395 ${marksPercentage}%,
                                        #e9eef0 ${marksPercentage}% 100%
                                    )`,
                            }}
                        >

                            <div className="
                                flex
                                h-32
                                w-32
                                flex-col
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                            ">

                                <p className="text-3xl font-bold text-[#1D2939]">
                                    {marksPercentage}%
                                </p>

                                <p className="text-xs text-[#667085]">
                                    Overall
                                </p>

                            </div>

                        </div>


                        {/* DETAILS */}

                        <div className="w-full max-w-[220px] space-y-4">

                            <ProgressItem
                                dot="bg-[#55c395]"
                                label="Obtained Marks"
                                value={
                                    dashboard.obtainedMarks ??
                                    0
                                }
                            />

                            <ProgressItem
                                dot="bg-[#f3bdce]"
                                label="Total Marks"
                                value={
                                    dashboard.totalMarks ??
                                    0
                                }
                            />

                            <ProgressItem
                                dot="bg-[#a976e8]"
                                label="Courses Enrolled"
                                value={
                                    dashboard.totalCourses ??
                                    0
                                }
                            />

                            <ProgressItem
                                dot="bg-[#8cc7f2]"
                                label="Attendance"
                                value={`${Math.round(
                                    dashboard.attendancePercentage ||
                                    0
                                )}%`}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="mt-6 rounded-2xl border border-[#eadde2] bg-white p-6 shadow-sm">

                <div className="flex items-center gap-2">

                    <IconRefresh
                        size={21}
                        className="text-[#51021E]"
                    />

                    <h2 className="font-bold text-[#1D2939]">
                        Quick Actions
                    </h2>

                </div>


                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <QuickAction
                        icon={
                            <IconBook2
                                size={22}
                            />
                        }
                        title="View My Marks"
                        onClick={() =>
                            navigate(
                                "/student/marks"
                            )
                        }
                    />

                    <QuickAction
                        icon={
                            <IconUser
                                size={22}
                            />
                        }
                        title="View Enrollments"
                        onClick={() =>
                            navigate(
                                "/student/enrollments"
                            )
                        }
                    />

                    <QuickAction
                        icon={
                            <IconCalendarCheck
                                size={22}
                            />
                        }
                        title="View Attendance"
                        onClick={() =>
                            navigate(
                                "/student/attendance"
                            )
                        }
                    />

                    <QuickAction
                        icon={
                            <IconEdit
                                size={22}
                            />
                        }
                        title="Edit Profile"
                        onClick={() =>
                            navigate(
                                "/student/profile"
                            )
                        }
                    />

                </div>

            </div>


            {/* =================================================
                MOTIVATION
            ================================================= */}

            <div className="
                mt-6
                overflow-hidden
                rounded-2xl
                border
                border-[#f0d8e0]
                bg-gradient-to-r
                from-[#fff2f6]
                to-[#fffafb]
                p-6
            ">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                        <p className="text-xl font-bold text-[#1D2939]">
                            Keep Going! 🌱
                        </p>

                        <p className="mt-1 text-sm text-[#667085]">
                            You&apos;re building a brighter future.
                            Stay consistent!
                        </p>

                    </div>

                    <div className="text-4xl">
                        📚
                    </div>

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
    blue,
    purple,
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
                        ? "border-[#d9ebdf]"
                        : blue
                            ? "border-[#dce9f5]"
                            : purple
                                ? "border-[#e7ddf5]"
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
                        items-center
                        justify-center
                        rounded-xl

                        ${
                            green
                                ? "bg-[#e8f7ed] text-[#287d48]"
                                : blue
                                    ? "bg-[#e9f4ff] text-[#3b82c4]"
                                    : purple
                                        ? "bg-[#f2eafe] text-[#8752c7]"
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
// PROGRESS ITEM
// =========================================================

const ProgressItem = ({
    dot,
    label,
    value,
}) => {

    return (
        <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

                <span
                    className={`
                        h-3
                        w-3
                        rounded-full
                        ${dot}
                    `}
                />

                <span className="text-sm text-[#667085]">
                    {label}
                </span>

            </div>

            <strong className="text-sm text-[#1D2939]">
                {value}
            </strong>

        </div>
    );
};


// =========================================================
// QUICK ACTION
// =========================================================

const QuickAction = ({
    icon,
    title,
    onClick,
}) => {

    return (
        <button
            onClick={onClick}
            className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-[#eadde2]
                bg-[#fffafb]
                px-4
                py-4
                text-left
                transition
                hover:-translate-y-0.5
                hover:border-[#d7a4b6]
                hover:shadow-sm
            "
        >

            <div className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                bg-[#faf0f5]
                text-[#51021E]
            ">
                {icon}
            </div>

            <span className="text-sm font-semibold text-[#344054]">
                {title}
            </span>

        </button>
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


// =========================================================
// ERROR
// =========================================================

const DashboardError = ({
    message,
    onRetry,
}) => {

    return (
        <div className="flex min-h-[70vh] items-center justify-center p-6">

            <div className="w-full max-w-md rounded-2xl border border-[#eadde2] bg-white p-8 text-center shadow-sm">

                <IconRefresh
                    size={32}
                    className="mx-auto text-[#51021E]"
                />

                <h2 className="mt-4 text-lg font-bold text-[#1D2939]">
                    Dashboard unavailable
                </h2>

                <p className="mt-2 text-sm text-[#667085]">
                    {message}
                </p>

                <button
                    onClick={onRetry}
                    className="
                        mt-5
                        rounded-lg
                        bg-[#51021E]
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-[#6D1535]
                    "
                >
                    Try Again
                </button>

            </div>

        </div>
    );
};


export default StudentDashboardHome;