import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    IconArrowLeft,
    IconBook2,
    IconCertificate,
    IconCheck,
    IconFileDescription,
} from "@tabler/icons-react";

import {
    Badge,
    Loader,
} from "@mantine/core";

import {
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getStudentMarksByCourse,
} from "../../../service/MarksService";


const StudentCourseMarks = () => {

    const navigate =
        useNavigate();

    const { courseId } =
        useParams();

    const user =
        useSelector(
            (state) => state.user
        );

    const profileId =
        user?.profileId;


    const [course, setCourse] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // =====================================================
    // FETCH
    // =====================================================

    useEffect(() => {

        if (
            !profileId ||
            !courseId
        ) {
            return;
        }

        fetchCourseMarks();

    }, [
        profileId,
        courseId,
    ]);


    const fetchCourseMarks =
        async () => {

            try {

                setLoading(true);
                setError(null);

                const data =
                    await getStudentMarksByCourse(
                        profileId,
                        courseId
                    );

                setCourse(data);

            } catch (error) {

                console.error(
                    "COURSE MARKS ERROR:",
                    error
                );

                setError(
                    "Unable to load marks."
                );

            } finally {

                setLoading(false);
            }
        };


    // =====================================================
    // PERCENTAGE
    // =====================================================

    const percentage =
        useMemo(() => {

            if (!course) {
                return 0;
            }

            if (
                course.percentage !==
                null &&
                course.percentage !==
                undefined
            ) {
                return Number(
                    course.percentage
                );
            }

            if (
                !course.totalMarks
            ) {
                return 0;
            }

            return (
                Number(
                    course.obtainedMarks
                ) /
                Number(
                    course.totalMarks
                )
            ) * 100;

        }, [course]);


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

    if (error || !course) {

        return (
            <div className="p-6">

                <button
                    onClick={() =>
                        navigate(
                            "/student/marks"
                        )
                    }
                    className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#51021E]"
                >
                    <IconArrowLeft
                        size={17}
                    />

                    Back to My Marks

                </button>

                <div className="rounded-2xl border border-[#eadde2] bg-white p-10 text-center">

                    <p className="text-sm text-[#667085]">
                        {error ||
                            "Marks not available."}
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#faf6f8] p-5 md:p-7">

            {/* =================================================
                BACK
            ================================================= */}

            <button
                onClick={() =>
                    navigate(
                        "/student/marks"
                    )
                }
                className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#51021E]"
            >

                <IconArrowLeft
                    size={17}
                />

                Back to My Marks

            </button>


            {/* =================================================
                COURSE HEADER
            ================================================= */}

            <div className="rounded-2xl border border-[#eadde2] bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="
                            flex
                            h-16
                            w-16
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[#faf0f5]
                            text-sm
                            font-bold
                            text-[#51021E]
                        ">
                            {course.courseCode}
                        </div>


                        <div>

                            <h1 className="text-2xl font-bold text-[#1D2939]">
                                {course.courseName}
                            </h1>

                            <div className="mt-2 flex flex-wrap gap-2">

                                {course.courseType && (

                                    <Badge
                                        variant="light"
                                        color="gray"
                                        radius="xl"
                                    >
                                        {course.courseType}
                                    </Badge>

                                )}

                                {course.credits !==
                                    null &&
                                    course.credits !==
                                    undefined && (

                                    <Badge
                                        variant="light"
                                        color="pink"
                                        radius="xl"
                                    >
                                        {course.credits}
                                        {" "}
                                        Credits
                                    </Badge>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="mt-6 grid gap-4 md:grid-cols-3">

                <MarkSummaryCard
                    icon={
                        <IconFileDescription
                            size={22}
                        />
                    }
                    label="Total Marks"
                    value={
                        course.totalMarks ??
                        0
                    }
                />

                <MarkSummaryCard
                    icon={
                        <IconCheck
                            size={22}
                        />
                    }
                    label="Obtained Marks"
                    value={
                        course.obtainedMarks ??
                        0
                    }
                    green
                />

                <MarkSummaryCard
                    icon={
                        <span className="text-xl font-bold">
                            %
                        </span>
                    }
                    label="Percentage"
                    value={`${percentage.toFixed(
                        1
                    )}%`}
                />

            </div>


            {/* =================================================
                ASSESSMENT DETAILS
            ================================================= */}

            <div className="mt-6 rounded-2xl border border-[#eadde2] bg-white shadow-sm">

                <div className="border-b border-[#eadde2] px-6 py-5">

                    <h2 className="text-lg font-bold text-[#1D2939]">
                        Assessment Details
                    </h2>

                    <p className="mt-1 text-xs text-[#667085]">
                        Detailed marks for each assessment
                    </p>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-[#faf0f5] text-left">

                                <th className="px-6 py-4 text-xs font-semibold text-[#344054]">
                                    Assessment
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-[#344054]">
                                    Max Marks
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-[#344054]">
                                    Obtained Marks
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-[#344054]">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-[#344054]">
                                    Remarks
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {course.marks?.length ? (

                                course.marks.map(
                                    (mark) => (

                                        <tr
                                            key={
                                                mark.id
                                            }
                                            className="border-b border-[#f1e6ea] last:border-none"
                                        >

                                            <td className="px-6 py-4 text-sm font-medium text-[#344054]">
                                                {formatExamType(
                                                    mark.examType
                                                )}
                                            </td>


                                            <td className="px-6 py-4 text-sm text-[#667085]">
                                                {mark.maxMarks}
                                            </td>


                                            <td className="px-6 py-4 text-sm font-semibold text-[#1D2939]">
                                                {mark.marksObtained}
                                            </td>


                                            <td className="px-6 py-4">

                                                <Badge
                                                    color="green"
                                                    variant="light"
                                                    radius="xl"
                                                >
                                                    Completed
                                                </Badge>

                                            </td>


                                            <td className="px-6 py-4 text-sm text-[#667085]">
                                                {mark.remarks ||
                                                    "-"}
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="px-6 py-12 text-center text-sm text-[#667085]"
                                    >
                                        No marks have been published
                                        for this course yet.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                OVERALL RESULT
            ================================================= */}

            <div className="mt-6 rounded-2xl border border-[#cde8d6] bg-[#effaf2] p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9f2df]">

                            <IconCheck
                                size={21}
                                className="text-[#258548]"
                            />

                        </div>


                        <div>

                            <h3 className="font-bold text-[#1D2939]">
                                Overall Result
                            </h3>

                            <p className="mt-1 text-xs text-[#4d7c5e]">
                                Keep up the good work!
                            </p>

                        </div>

                    </div>


                    <p className="text-3xl font-bold text-[#258548]">
                        {percentage.toFixed(1)}%
                    </p>

                </div>

            </div>

        </div>
    );
};


// =========================================================
// SUMMARY CARD
// =========================================================

const MarkSummaryCard = ({
    icon,
    label,
    value,
    green,
}) => {

    return (
        <div className="rounded-2xl border border-[#eadde2] bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

                <div
                    className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        ${
                            green
                                ? "bg-[#e8f7ed] text-[#287d48]"
                                : "bg-[#faf0f5] text-[#51021E]"
                        }
                    `}
                >
                    {icon}
                </div>


                <div>

                    <p className="text-xs text-[#667085]">
                        {label}
                    </p>

                    <p className="mt-1 text-xl font-bold text-[#1D2939]">
                        {value}
                    </p>

                </div>

            </div>

        </div>
    );
};


// =========================================================
// EXAM TYPE FORMATTER
// =========================================================

const formatExamType = (
    examType
) => {

    if (!examType) {
        return "-";
    }

    const map = {
        QUIZ: "Quiz",
        ASSIGNMENT: "Assignment",
        MID_TERM: "Mid Term",
        FINAL_EXAM: "Final Exam",
        PRACTICAL: "Practical",
    };

    return (
        map[examType] ||
        examType
    );
};


export default StudentCourseMarks;