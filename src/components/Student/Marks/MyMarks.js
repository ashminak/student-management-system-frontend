import {
    useEffect,
    useState,
} from "react";

import {
    IconArrowRight,
    IconBook2,
    IconFileDescription,
    IconRefresh,
    IconUsers,
} from "@tabler/icons-react";

import {
    Loader,
} from "@mantine/core";

import {
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    getStudentMarks,
} from "../../../service/MarksService";


const MyMarks = () => {

    const navigate = useNavigate();

    const user =
        useSelector(
            (state) => state.user
        );

    const profileId =
        user?.profileId;


    const [courses, setCourses] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // =====================================================
    // FETCH MARKS
    // =====================================================

    useEffect(() => {

        if (
            profileId === undefined ||
            profileId === null
        ) {
            setLoading(false);
            return;
        }

        fetchMarks();

    }, [profileId]);


    const fetchMarks = async () => {

        try {

            setLoading(true);
            setError(null);

            const data =
                await getStudentMarks(
                    profileId
                );

            setCourses(
                data ?? []
            );

        } catch (error) {

            console.error(
                "STUDENT MARKS ERROR:",
                error
            );

            setError(
                "Unable to load your marks."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center">

                <Loader
                    color="#51021E"
                />

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center p-6">

                <div className="text-center">

                    <p className="text-sm text-[#667085]">
                        {error}
                    </p>

                    <button
                        onClick={fetchMarks}
                        className="mt-4 rounded-lg bg-[#51021E] px-5 py-2 text-sm font-semibold text-white"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#faf6f8] p-5 md:p-7">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="mb-7">

                <h1 className="text-3xl font-bold text-[#1D2939]">
                    My Marks
                </h1>

                <p className="mt-1 text-sm text-[#667085]">
                    View your marks and academic performance
                    across all your courses.
                </p>

            </div>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {courses.length === 0 ? (

                <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-[#eadde2] bg-white">

                    <div className="max-w-md px-6 text-center">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf0f5]">

                            <IconFileDescription
                                size={38}
                                className="text-[#d18ca2]"
                            />

                        </div>

                        <h2 className="mt-5 text-xl font-bold text-[#1D2939]">
                            No Marks Available
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#667085]">
                            Your marks will be visible here once
                            they are published by your teachers.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/student/courses"
                                )
                            }
                            className="mt-5 rounded-lg bg-[#51021E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D1535]"
                        >
                            Go to My Courses
                        </button>

                    </div>

                </div>

            ) : (

                /* =================================================
                   COURSE LIST
                ================================================= */

                <div className="grid gap-5 md:grid-cols-2">

                    {courses.map(
                        (course) => (

                            <div
                                key={
                                    course.courseId
                                }
                                className="
                                    rounded-2xl
                                    border
                                    border-[#eadde2]
                                    bg-white
                                    p-5
                                    shadow-sm
                                    transition
                                    hover:-translate-y-1
                                    hover:shadow-md
                                "
                            >

                                <div className="flex items-start justify-between gap-4">

                                    {/* COURSE INFO */}

                                    <div className="flex gap-4">

                                        <div className="
                                            flex
                                            h-14
                                            w-14
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[#faf0f5]
                                            text-sm
                                            font-bold
                                            text-[#51021E]
                                        ">
                                            {course.courseCode}
                                        </div>


                                        <div>

                                            <h2 className="text-base font-bold text-[#1D2939]">
                                                {course.courseName}
                                            </h2>

                                            <p className="mt-1 text-xs text-[#667085]">
                                                {course.courseType}
                                                {course.credits
                                                    ? ` • ${course.credits} Credits`
                                                    : ""}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* SUMMARY */}

                                <div className="mt-5 grid grid-cols-3 gap-3">

                                    <SummaryBox
                                        label="Total"
                                        value={
                                            course.totalMarks ??
                                            0
                                        }
                                    />

                                    <SummaryBox
                                        label="Obtained"
                                        value={
                                            course.obtainedMarks ??
                                            0
                                        }
                                    />

                                    <SummaryBox
                                        label="%"
                                        value={`${Math.round(
                                            course.percentage ??
                                            0
                                        )}%`}
                                    />

                                </div>


                                {/* BUTTON */}

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/student/marks/${course.courseId}`
                                        )
                                    }
                                    className="
                                        mt-5
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        bg-[#51021E]
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#6D1535]
                                    "
                                >

                                    View Marks

                                    <IconArrowRight
                                        size={16}
                                    />

                                </button>

                            </div>
                        )
                    )}

                </div>

            )}

        </div>
    );
};


// =========================================================
// SUMMARY BOX
// =========================================================

const SummaryBox = ({
    label,
    value,
}) => {

    return (
        <div className="rounded-lg bg-[#faf6f8] p-3">

            <p className="text-[11px] text-[#667085]">
                {label}
            </p>

            <p className="mt-1 text-lg font-bold text-[#1D2939]">
                {value}
            </p>

        </div>
    );
};


export default MyMarks;