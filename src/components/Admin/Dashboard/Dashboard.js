import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getCachedAdminDashboard,
    refreshAdminDashboard,
} from "../../../service/AdminDashboardCache";

import {
    IconArrowRight,
    IconBook2,
    IconChartBar,
    IconClock,
    IconFileDescription,
    IconPlus,
    IconRefresh,
    IconUsers,
    IconUserShield,
    IconX,
    IconCheck,
} from "@tabler/icons-react";

import {
    Loader,
} from "@mantine/core";

import {
    useNavigate,
} from "react-router-dom";


// =============================================================
// DASHBOARD
// =============================================================

const Dashboard = () => {

    const navigate = useNavigate();


    // =========================================================
    // STATE
    // =========================================================

    const [
        dashboard,
        setDashboard,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState(null);


    // =========================================================
    // INITIAL FETCH
    // =========================================================

    useEffect(() => {

        let mounted = true;


        const fetchDashboard = async () => {

            try {

                setError(null);

                setLoading(true);


                const data =
                    await getCachedAdminDashboard();


                if (!mounted) {
                    return;
                }


                setDashboard(data);

            } catch (err) {

                console.error(
                    "Admin dashboard error:",
                    err
                );


                if (!mounted) {
                    return;
                }


                setError(
                    err?.response?.data?.errorMessage ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load admin dashboard."
                );

            } finally {

                if (mounted) {

                    setLoading(false);
                }
            }
        };


        fetchDashboard();


        return () => {

            mounted = false;
        };

    }, []);


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {

        try {

            setError(null);

            setLoading(true);


            const data =
                await refreshAdminDashboard();


            setDashboard(data);

        } catch (err) {

            console.error(
                "Admin dashboard refresh error:",
                err
            );


            setError(
                err?.response?.data?.errorMessage ||
                err?.response?.data?.message ||
                err?.message ||
                "Unable to refresh admin dashboard."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // ENROLLMENT PERCENTAGES
    // =========================================================

    const enrollmentStats = useMemo(() => {

        const total =
            dashboard?.enrollmentOverview?.total ?? 0;

        const approved =
            dashboard?.enrollmentOverview?.approved ?? 0;

        const pending =
            dashboard?.enrollmentOverview?.pending ?? 0;


        if (total === 0) {

            return {
                approvedPercent: 0,
                pendingPercent: 0,
            };
        }


        return {
            approvedPercent:
                (approved / total) * 100,

            pendingPercent:
                (pending / total) * 100,
        };

    }, [dashboard]);


    // =========================================================
    // COURSE PERCENTAGES
    // =========================================================

    const courseStats = useMemo(() => {

        const total =
            dashboard?.courseOverview?.total ?? 0;

        const active =
            dashboard?.courseOverview?.active ?? 0;

        const inactive =
            dashboard?.courseOverview?.inactive ?? 0;


        if (total === 0) {

            return {
                activePercent: 0,
                inactivePercent: 0,
            };
        }


        return {
            activePercent:
                (active / total) * 100,

            inactivePercent:
                (inactive / total) * 100,
        };

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
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div
                className="
                    flex
                    min-h-[70vh]
                    items-center
                    justify-center
                "
            >

                <Loader
                    color="#51021E"
                    size="md"
                />

            </div>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error || !dashboard) {

        return (
            <div
                className="
                    flex
                    min-h-[70vh]
                    items-center
                    justify-center
                    p-6
                "
            >

                <div
                    className="
                        w-full
                        max-w-md
                        rounded-2xl
                        border
                        border-[#eadde2]
                        bg-white
                        p-8
                        text-center
                        shadow-sm
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            bg-[#faf0f5]
                        "
                    >

                        <IconRefresh
                            size={26}
                            className="text-[#51021E]"
                        />

                    </div>


                    <h2
                        className="
                            mt-4
                            text-lg
                            font-bold
                            text-[#1D2939]
                        "
                    >
                        Dashboard unavailable
                    </h2>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-[#667085]
                        "
                    >
                        {error ||
                            "No dashboard data available."}
                    </p>


                    <button
                        onClick={handleRefresh}
                        className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-[#51021E]
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#6D1535]
                        "
                    >

                        <IconRefresh
                            size={16}
                        />

                        Try Again

                    </button>

                </div>

            </div>
        );
    }


    // =========================================================
    // SAFE DATA
    // =========================================================

    const recentRequests =
        dashboard.recentEnrollmentRequests ?? [];


    const topCourses =
        dashboard.topCourses ?? [];


    // =========================================================
    // UI
    // =========================================================

    return (
        <div
            className="
                min-h-screen
                bg-[#faf6f8]
                p-5
                md:p-7
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    mb-7
                    flex
                    flex-col
                    gap-3
                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            text-[#667085]
                        "
                    >
                        Welcome back,
                    </p>


                    <h1
                        className="
                            mt-1
                            text-3xl
                            font-bold
                            text-[#1D2939]
                        "
                    >
                        Admin Dashboard
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#667085]
                        "
                    >
                        Overview of your student management system.
                    </p>

                </div>


                <div
                    className="
                        rounded-xl
                        border
                        border-[#eadde2]
                        bg-white
                        px-4
                        py-3
                        shadow-sm
                    "
                >

                    <p
                        className="
                            text-xs
                            text-[#667085]
                        "
                    >
                        Today
                    </p>


                    <p
                        className="
                            mt-1
                            text-sm
                            font-semibold
                            text-[#51021E]
                        "
                    >
                        {currentDate}
                    </p>

                </div>

            </div>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div
                className="
                    grid
                    gap-5
                    md:grid-cols-2
                    xl:grid-cols-4
                "
            >

                <StatCard
                    icon={<IconUsers size={25} />}
                    title="Total Students"
                    value={
                        dashboard.totalStudents ?? 0
                    }
                    color="pink"
                />


                <StatCard
                    icon={<IconUserShield size={25} />}
                    title="Total Teachers"
                    value={
                        dashboard.totalTeachers ?? 0
                    }
                    color="blue"
                />


                <StatCard
                    icon={<IconBook2 size={25} />}
                    title="Total Courses"
                    value={
                        dashboard.totalCourses ?? 0
                    }
                    color="green"
                />


                <StatCard
                    icon={<IconClock size={25} />}
                    title="Pending Enrollment Requests"
                    value={
                        dashboard.pendingEnrollmentRequests ?? 0
                    }
                    color="orange"
                />

            </div>


            {/* =================================================
                OVERVIEW + QUICK ACTIONS
            ================================================= */}

            <div
                className="
                    mt-6
                    grid
                    gap-6
                    xl:grid-cols-3
                "
            >

                {/* ENROLLMENT OVERVIEW */}

                <OverviewCard
                    title="Enrollment Overview"
                    icon={<IconUsers size={21} />}
                >

                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            gap-7
                            sm:flex-row
                            sm:justify-center
                        "
                    >

                        <DonutChart
                            percentage={
                                enrollmentStats.approvedPercent
                            }
                            value={
                                dashboard
                                    .enrollmentOverview
                                    ?.total ?? 0
                            }
                            label="Total"
                            color="#55c395"
                            secondaryColor="#f3bdce"
                        />


                        <div
                            className="
                                w-full
                                max-w-[220px]
                                space-y-4
                            "
                        >

                            <LegendRow
                                color="bg-[#55c395]"
                                label="Approved"
                                value={
                                    dashboard
                                        .enrollmentOverview
                                        ?.approved ?? 0
                                }
                                percentage={
                                    enrollmentStats
                                        .approvedPercent
                                }
                            />


                            <LegendRow
                                color="bg-[#f3bdce]"
                                label="Pending"
                                value={
                                    dashboard
                                        .enrollmentOverview
                                        ?.pending ?? 0
                                }
                                percentage={
                                    enrollmentStats
                                        .pendingPercent
                                }
                            />

                        </div>

                    </div>

                </OverviewCard>


                {/* COURSE OVERVIEW */}

                <OverviewCard
                    title="Course Overview"
                    icon={<IconBook2 size={21} />}
                >

                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            gap-7
                            sm:flex-row
                            sm:justify-center
                        "
                    >

                        <DonutChart
                            percentage={
                                courseStats.activePercent
                            }
                            value={
                                dashboard
                                    .courseOverview
                                    ?.total ?? 0
                            }
                            label="Total"
                            color="#51021E"
                            secondaryColor="#f3bdce"
                        />


                        <div
                            className="
                                w-full
                                max-w-[220px]
                                space-y-4
                            "
                        >

                            <LegendRow
                                color="bg-[#51021E]"
                                label="Active Courses"
                                value={
                                    dashboard
                                        .courseOverview
                                        ?.active ?? 0
                                }
                                percentage={
                                    courseStats
                                        .activePercent
                                }
                            />


                            <LegendRow
                                color="bg-[#f3bdce]"
                                label="Inactive Courses"
                                value={
                                    dashboard
                                        .courseOverview
                                        ?.inactive ?? 0
                                }
                                percentage={
                                    courseStats
                                        .inactivePercent
                                }
                            />


                            {(dashboard
                                .courseOverview
                                ?.archived ?? 0) > 0 && (

                                <LegendRow
                                    color="bg-[#d5d9df]"
                                    label="Archived"
                                    value={
                                        dashboard
                                            .courseOverview
                                            ?.archived ?? 0
                                    }
                                    percentage={
                                        dashboard
                                            .courseOverview
                                            ?.total
                                            ? (
                                                (
                                                    dashboard
                                                        .courseOverview
                                                        .archived
                                                ) /
                                                dashboard
                                                    .courseOverview
                                                    .total
                                            ) * 100
                                            : 0
                                    }
                                />

                            )}

                        </div>

                    </div>

                </OverviewCard>


                {/* QUICK ACTIONS */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-[#eadde2]
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <IconFileDescription
                            size={21}
                            className="text-[#51021E]"
                        />


                        <h2
                            className="
                                font-bold
                                text-[#1D2939]
                            "
                        >
                            Quick Actions
                        </h2>

                    </div>


                    <div
                        className="
                            mt-5
                            space-y-3
                        "
                    >

                        <QuickAction
                            icon={<IconPlus size={21} />}
                            title="Add Course"
                            onClick={() =>
                                navigate(
                                    "/admin/courses"
                                )
                            }
                            filled
                        />


                        <QuickAction
                            icon={<IconUsers size={21} />}
                            title="Review Enrollments"
                            onClick={() =>
                                navigate(
                                    "/admin/enrollments"
                                )
                            }
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                TABLES
            ================================================= */}

            <div
                className="
                    mt-6
                    grid
                    gap-6
                    xl:grid-cols-[1.7fr_1fr]
                "
            >

                {/* RECENT ENROLLMENTS */}

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#eadde2]
                        bg-white
                        shadow-sm
                    "
                >

                    <SectionHeader
                        icon={<IconClock size={21} />}
                        title="Recent Enrollment Requests"
                        onClick={() =>
                            navigate(
                                "/admin/enrollments"
                            )
                        }
                    />


                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr
                                    className="
                                        border-b
                                        border-[#f1e6ea]
                                        bg-[#faf6f8]
                                        text-left
                                    "
                                >

                                    <th className={tableHead}>
                                        #
                                    </th>

                                    <th className={tableHead}>
                                        Student Name
                                    </th>

                                    <th className={tableHead}>
                                        Course
                                    </th>

                                    <th className={tableHead}>
                                        Date
                                    </th>

                                    <th className={tableHead}>
                                        Status
                                    </th>

                                    <th className={tableHead}>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {recentRequests.length > 0 ? (

                                    recentRequests.map(
                                        (request) => (

                                            <tr
                                                key={
                                                    request.enrollmentId
                                                }
                                                className="
                                                    border-b
                                                    border-[#f5eaee]
                                                    last:border-none
                                                "
                                            >

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            inline-flex
                                                            rounded-md
                                                            bg-[#fbe7ef]
                                                            px-2
                                                            py-1
                                                            text-xs
                                                            font-bold
                                                            text-[#51021E]
                                                        "
                                                    >
                                                        #{request.enrollmentId}
                                                    </span>

                                                </td>


                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        font-semibold
                                                        text-[#344054]
                                                    "
                                                >
                                                    {
                                                        request.studentName ||
                                                        "-"
                                                    }
                                                </td>


                                                <td
                                                    className="
                                                        max-w-[220px]
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-[#667085]
                                                    "
                                                >

                                                    <span className="block truncate">
                                                        {
                                                            request.courseName ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                <td
                                                    className="
                                                        whitespace-nowrap
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-[#667085]
                                                    "
                                                >
                                                    {
                                                        formatDate(
                                                            request.enrollmentDate
                                                        )
                                                    }
                                                </td>


                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >

                                                    <StatusBadge
                                                        status={
                                                            request.status
                                                        }
                                                    />

                                                </td>


                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                "/admin/enrollments"
                                                            )
                                                        }
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1
                                                            text-sm
                                                            font-semibold
                                                            text-[#51021E]
                                                        "
                                                    >

                                                        Review

                                                        <IconArrowRight
                                                            size={15}
                                                        />

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="
                                                px-5
                                                py-12
                                                text-center
                                                text-sm
                                                text-[#98A2B3]
                                            "
                                        >
                                            No pending enrollment requests.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* TOP COURSES */}

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#eadde2]
                        bg-white
                        shadow-sm
                    "
                >

                    <SectionHeader
                        icon={<IconChartBar size={21} />}
                        title="Top Courses by Enrollments"
                        onClick={() =>
                            navigate(
                                "/admin/courses"
                            )
                        }
                    />


                    <div className="p-2">

                        {topCourses.length > 0 ? (

                            topCourses.map(
                                (course, index) => (

                                    <div
                                        key={
                                            course.courseId
                                        }
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            border-b
                                            border-[#f1e6ea]
                                            px-4
                                            py-4
                                            last:border-none
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-3
                                            "
                                        >

                                            <span
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-[#fbe7ef]
                                                    text-xs
                                                    font-bold
                                                    text-[#51021E]
                                                "
                                            >
                                                {index + 1}
                                            </span>


                                            <div className="min-w-0">

                                                <p
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-[#344054]
                                                    "
                                                >
                                                    {
                                                        course.courseName ||
                                                        "-"
                                                    }
                                                </p>


                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-xs
                                                        text-[#98A2B3]
                                                    "
                                                >
                                                    {
                                                        course.courseCode ||
                                                        "-"
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        <div
                                            className="
                                                shrink-0
                                                text-right
                                            "
                                        >

                                            <p
                                                className="
                                                    text-sm
                                                    font-bold
                                                    text-[#51021E]
                                                "
                                            >
                                                {
                                                    course.enrollmentCount ??
                                                    0
                                                }
                                            </p>


                                            <p
                                                className="
                                                    text-[10px]
                                                    text-[#98A2B3]
                                                "
                                            >
                                                enrollments
                                            </p>

                                        </div>

                                    </div>

                                )
                            )

                        ) : (

                            <div
                                className="
                                    px-5
                                    py-12
                                    text-center
                                    text-sm
                                    text-[#98A2B3]
                                "
                            >
                                No course enrollment data available.
                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                REFRESH
            ================================================= */}

            <div
                className="
                    mt-6
                    flex
                    justify-end
                "
            >

                <button
                    onClick={handleRefresh}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-[#eadde2]
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-[#51021E]
                        shadow-sm
                        transition
                        hover:bg-[#fffafb]
                    "
                >

                    <IconRefresh
                        size={16}
                    />

                    Refresh Dashboard

                </button>

            </div>

        </div>
    );
};


// =============================================================
// TABLE HEADER CLASS
// =============================================================

const tableHead = `
    px-5
    py-4
    text-xs
    font-semibold
    text-[#667085]
`;


// =============================================================
// STAT CARD
// =============================================================

const StatCard = ({
    icon,
    title,
    value,
    color,
}) => {

    const colors = {

        pink: {
            wrapper:
                "border-[#eadde2] bg-white",

            icon:
                "bg-[#fae7ee] text-[#51021E]",
        },

        blue: {
            wrapper:
                "border-[#dce9f5] bg-white",

            icon:
                "bg-[#eaf4ff] text-[#3b82c4]",
        },

        green: {
            wrapper:
                "border-[#d8eadf] bg-white",

            icon:
                "bg-[#e8f7ed] text-[#287d48]",
        },

        orange: {
            wrapper:
                "border-[#f0dfc8] bg-white",

            icon:
                "bg-[#fff0d9] text-[#a96b12]",
        },
    };


    const selected =
        colors[color] || colors.pink;


    return (
        <div
            className={`
                rounded-2xl
                border
                p-5
                shadow-sm
                transition
                hover:shadow-md
                ${selected.wrapper}
            `}
        >

            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >

                <div
                    className={`
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${selected.icon}
                    `}
                >
                    {icon}
                </div>


                <div className="min-w-0">

                    <p
                        className="
                            text-sm
                            text-[#667085]
                        "
                    >
                        {title}
                    </p>


                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-[#1D2939]
                        "
                    >
                        {value}
                    </p>

                </div>

            </div>

        </div>
    );
};


// =============================================================
// OVERVIEW CARD
// =============================================================

const OverviewCard = ({
    title,
    icon,
    children,
}) => {

    return (
        <div
            className="
                rounded-2xl
                border
                border-[#eadde2]
                bg-white
                p-6
                shadow-sm
            "
        >

            <div
                className="
                    mb-6
                    flex
                    items-center
                    gap-2
                "
            >

                <span className="text-[#51021E]">
                    {icon}
                </span>


                <h2
                    className="
                        font-bold
                        text-[#1D2939]
                    "
                >
                    {title}
                </h2>

            </div>


            {children}

        </div>
    );
};


// =============================================================
// DONUT CHART
// =============================================================

const DonutChart = ({
    percentage,
    value,
    label,
    color,
    secondaryColor,
}) => {

    const safePercentage =
        Math.max(
            0,
            Math.min(
                100,
                Number(percentage || 0)
            )
        );


    return (
        <div
            className="
                flex
                h-40
                w-40
                shrink-0
                items-center
                justify-center
                rounded-full
            "
            style={{
                background:
                    `conic-gradient(
                        ${color}
                        ${safePercentage}%,
                        ${secondaryColor}
                        ${safePercentage}% 100%
                    )`,
            }}
        >

            <div
                className="
                    flex
                    h-28
                    w-28
                    flex-col
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                "
            >

                <span
                    className="
                        text-2xl
                        font-bold
                        text-[#1D2939]
                    "
                >
                    {value}
                </span>


                <span
                    className="
                        mt-0.5
                        text-xs
                        text-[#667085]
                    "
                >
                    {label}
                </span>

            </div>

        </div>
    );
};


// =============================================================
// LEGEND ROW
// =============================================================

const LegendRow = ({
    color,
    label,
    value,
    percentage,
}) => {

    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-4
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <span
                    className={`
                        h-3
                        w-3
                        rounded-full
                        ${color}
                    `}
                />


                <span
                    className="
                        text-sm
                        text-[#667085]
                    "
                >
                    {label}
                </span>

            </div>


            <div className="text-right">

                <p
                    className="
                        text-sm
                        font-bold
                        text-[#1D2939]
                    "
                >
                    {value}
                </p>


                <p
                    className="
                        text-[10px]
                        text-[#98A2B3]
                    "
                >
                    {Number(
                        percentage || 0
                    ).toFixed(1)}%
                </p>

            </div>

        </div>
    );
};


// =============================================================
// QUICK ACTION
// =============================================================

const QuickAction = ({
    icon,
    title,
    onClick,
    filled,
}) => {

    return (
        <button
            onClick={onClick}
            className={`
                group
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                border
                px-4
                py-3.5
                text-left
                transition-all
                ${
                    filled
                        ? `
                            border-[#51021E]
                            bg-[#51021E]
                            text-white
                            hover:bg-[#6D1535]
                        `
                        : `
                            border-[#eadde2]
                            bg-[#fff8fa]
                            text-[#51021E]
                            hover:border-[#d7a4b6]
                            hover:bg-[#fff1f5]
                        `
                }
            `}
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                {icon}

                <span
                    className="
                        text-sm
                        font-semibold
                    "
                >
                    {title}
                </span>

            </div>


            <IconArrowRight
                size={17}
                className="
                    transition
                    group-hover:translate-x-1
                "
            />

        </button>
    );
};


// =============================================================
// SECTION HEADER
// =============================================================

const SectionHeader = ({
    icon,
    title,
    onClick,
}) => {

    return (
        <div
            className="
                flex
                items-center
                justify-between
                border-b
                border-[#f1e6ea]
                px-6
                py-5
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <span className="text-[#51021E]">
                    {icon}
                </span>


                <h2
                    className="
                        font-bold
                        text-[#1D2939]
                    "
                >
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


// =============================================================
// STATUS BADGE
// =============================================================

const StatusBadge = ({
    status,
}) => {

    const normalized =
        String(
            status || ""
        ).toUpperCase();


    if (normalized === "APPROVED") {

        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-[#e8f7ed]
                    px-2.5
                    py-1
                    text-[11px]
                    font-bold
                    text-[#287d48]
                "
            >

                <IconCheck
                    size={13}
                />

                APPROVED

            </span>
        );
    }


    if (normalized === "PENDING") {

        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-[#fff2d9]
                    px-2.5
                    py-1
                    text-[11px]
                    font-bold
                    text-[#a96b12]
                "
            >

                <IconClock
                    size={13}
                />

                PENDING

            </span>
        );
    }


    return (
        <span
            className="
                inline-flex
                items-center
                gap-1
                rounded-full
                bg-[#f1f3f5]
                px-2.5
                py-1
                text-[11px]
                font-bold
                text-[#667085]
            "
        >

            <IconX
                size={13}
            />

            {normalized || "UNKNOWN"}

        </span>
    );
};


// =============================================================
// DATE FORMATTER
// =============================================================

const formatDate = (date) => {

    if (!date) {

        return "-";
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return date;
    }


    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
};


// =============================================================
// EXPORT
// =============================================================

export default Dashboard;