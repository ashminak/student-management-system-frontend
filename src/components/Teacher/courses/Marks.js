import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ActionIcon,
    Badge,
    Button,
    Divider,
    Modal,
    NumberInput,
    Select,
    Textarea,
    TextInput,
    Tooltip,
} from "@mantine/core";

import {
    IconArrowLeft,
    IconBook2,
    IconCalendar,
    IconCertificate,
    IconEdit,
    IconPlus,
    IconSearch,
    IconTrash,
    IconUser,
    IconUsers,
} from "@tabler/icons-react";

import {
    getMarksByCourseId,
    addMarks,
    updateMarks,
    deleteMarks,
} from "../../../service/MarksService";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { getCourseById } from "../../../service/CourseService";
import { getStudentsByCourseId } from "../../../service/EnrollmentService";

const Marks = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();

    const [courseDetails, setCourseDetails] = useState({});
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [marksStatus, setMarksStatus] = useState("ALL");

    const [modalOpened, setModalOpened] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [selectedMark, setSelectedMark] = useState(null);

    const [form, setForm] = useState({
        profileId: null,
        courseId: Number(courseId),
        examType: null,
        marksObtained: null,
        maxMarks: 100,
        remarks: "",
    });

    // =========================================================
    // FETCH PAGE DATA
    // =========================================================

    useEffect(() => {
        fetchPageData();
    }, [courseId]);

    const buildMarksRows = (markRecords, enrolledStudents) => {
        const studentMap = {};

        enrolledStudents.forEach((student) => {
            studentMap[student.profileId] = {
                profileId: student.profileId,
                profileName: student.profileName,
                profileEmail: student.profileEmail,

                midTerm: null,
                finalExam: null,

                midTermId: null,
                finalExamId: null,

                remarks: "",
            };
        });

        markRecords.forEach((mark) => {
            const student = studentMap[mark.profileId];

            if (!student) return;

            if (mark.examType === "MID_TERM") {
                student.midTerm = mark.marksObtained;
                student.midTermId = mark.id;
            }

            if (mark.examType === "FINAL_EXAM") {
                student.finalExam = mark.marksObtained;
                student.finalExamId = mark.id;
            }

            if (mark.remarks) {
                student.remarks = mark.remarks;
            }
        });

        return Object.values(studentMap);
    };

    const fetchPageData = async () => {
        setLoading(true);

        try {
            const [course, enrolledStudents, courseMarks] =
                await Promise.all([
                    getCourseById(courseId),
                    getStudentsByCourseId(courseId),
                    getMarksByCourseId(courseId),
                ]);

            setCourseDetails(course);
            setStudents(enrolledStudents);

            const marksRows = buildMarksRows(
                courseMarks,
                enrolledStudents
            );

            setMarks(marksRows);
        } catch (error) {
            console.error("GET MARKS PAGE ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // CALCULATIONS
    // =========================================================

    const calculateTotal = (row) => {
        const mid = Number(row.midTerm || 0);
        const final = Number(row.finalExam || 0);

        if (
            row.midTerm === null &&
            row.finalExam === null
        ) {
            return null;
        }

        return mid + final;
    };

    const calculatePercentage = (row) => {
        const total = calculateTotal(row);

        if (total === null) {
            return null;
        }

        // Mid Term = 100
        // Final Exam = 100
        // Total = 200
        return ((total / 200) * 100).toFixed(1);
    };

    const getGrade = (percentage) => {
        if (percentage === null) {
            return "-";
        }

        const value = Number(percentage);

        if (value >= 90) return "A+";
        if (value >= 80) return "A";
        if (value >= 70) return "B+";
        if (value >= 60) return "B";
        if (value >= 50) return "C";
        if (value >= 40) return "D";

        return "F";
    };

    const getGradeBadge = (grade) => {
        if (grade === "A+" || grade === "A") {
            return (
                <Badge
                    color="green"
                    variant="light"
                    radius="xl"
                >
                    {grade}
                </Badge>
            );
        }

        if (grade === "B+" || grade === "B") {
            return (
                <Badge
                    color="yellow"
                    variant="light"
                    radius="xl"
                >
                    {grade}
                </Badge>
            );
        }

        if (grade === "F") {
            return (
                <Badge
                    color="red"
                    variant="light"
                    radius="xl"
                >
                    {grade}
                </Badge>
            );
        }

        return (
            <Badge
                color="gray"
                variant="light"
                radius="xl"
            >
                {grade}
            </Badge>
        );
    };

    // =========================================================
    // FILTER
    // =========================================================

    const filteredMarks = useMemo(() => {
        return marks.filter((student) => {
            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                student.profileName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                student.profileEmail
                    ?.toLowerCase()
                    .includes(searchValue);

            const hasMarks =
                student.midTerm !== null ||
                student.finalExam !== null;

            const matchesStatus =
                marksStatus === "ALL"
                    ? true
                    : marksStatus === "SUBMITTED"
                        ? hasMarks
                        : !hasMarks;

            return matchesSearch && matchesStatus;
        });
    }, [marks, search, marksStatus]);

    // =========================================================
    // OPEN ADD MODAL
    // =========================================================

    const openAddModal = () => {
        setEditMode(false);
        setSelectedMark(null);

        setForm({
            profileId: null,
            courseId: Number(courseId),
            examType: null,
            marksObtained: null,
            maxMarks: 100,
            remarks: "",
        });

        setModalOpened(true);
    };

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (rowData, type) => {
        const markId =
            type === "MID_TERM"
                ? rowData.midTermId
                : rowData.finalExamId;

        const marksObtained =
            type === "MID_TERM"
                ? rowData.midTerm
                : rowData.finalExam;

        if (!markId) {
            return;
        }

        setEditMode(true);

        setSelectedMark({
            id: markId,
        });

        setForm({
            profileId: rowData.profileId,
            courseId: Number(courseId),
            examType: type,
            marksObtained: marksObtained,
            maxMarks: 100,
            remarks: rowData.remarks || "",
        });

        setModalOpened(true);
    };

    // =========================================================
    // SAVE / UPDATE MARKS
    // =========================================================

    const handleSaveMarks = async () => {
        if (!form.profileId) {
            return;
        }

        if (!form.examType) {
            return;
        }

        if (
            form.marksObtained === null ||
            form.maxMarks === null
        ) {
            return;
        }

        const marksObtained = Number(form.marksObtained);
        const maxMarks = Number(form.maxMarks);

        if (
            Number.isNaN(marksObtained) ||
            Number.isNaN(maxMarks)
        ) {
            return;
        }

        if (marksObtained < 0 || marksObtained > maxMarks) {
            return;
        }

        const payload = {
            profileId: Number(form.profileId),
            courseId: Number(courseId),
            examType: form.examType,
            marksObtained: marksObtained,
            maxMarks: maxMarks,
            remarks: form.remarks,
        };

        try {
            console.log("MARKS PAYLOAD:", payload);

            if (editMode) {
                await updateMarks(
                    selectedMark.id,
                    payload
                );
            } else {
                await addMarks(payload);
            }

            await fetchPageData();

            setModalOpened(false);
            setEditMode(false);
            setSelectedMark(null);

            setForm({
                profileId: null,
                courseId: Number(courseId),
                examType: null,
                marksObtained: null,
                maxMarks: 100,
                remarks: "",
            });
        } catch (error) {
            console.error("SAVE MARKS ERROR:", error);
            console.error(
                "STATUS:",
                error.response?.status
            );
            console.error(
                "RESPONSE:",
                error.response?.data
            );
        }
    };

    // =========================================================
    // DELETE MARKS
    // =========================================================

    const handleDelete = async (
        markId,
        studentName,
        examType
    ) => {
        const confirmed = window.confirm(
            `Delete ${examType} marks for ${studentName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteMarks(markId);
            await fetchPageData();
        } catch (error) {
            console.error(
                "DELETE MARKS ERROR:",
                error
            );
        }
    };

    // =========================================================
    // RESET FILTERS
    // =========================================================

    const resetFilters = () => {
        setSearch("");
        setMarksStatus("ALL");
    };

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 md:p-8">

            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#51021E] transition hover:text-[#6D1535]"
            >
                <IconArrowLeft size={18} />
                Back to My Courses
            </button>

            {/* Page heading */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#1D2939]">
                    Marks
                </h1>

                <p className="mt-1 text-sm text-[#667085]">
                    Manage and update student marks for this course
                </p>
            </div>

            {/* Course overview */}
            <div className="rounded-2xl border border-[#eadde2] bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

                    {/* Course info */}
                    <div className="flex gap-4">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#faf0f5]">
                            <IconBook2
                                size={34}
                                stroke={1.8}
                                className="text-[#51021E]"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-[#1D2939]">
                                {courseDetails.courseName}
                            </h2>

                            <p className="mt-1 text-sm font-medium text-[#667085]">
                                {courseDetails.courseCode}
                            </p>

                            <p className="mt-2 max-w-3xl text-sm text-[#667085]">
                                {courseDetails.description}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">

                                <Badge
                                    variant="light"
                                    color="gray"
                                    radius="xl"
                                >
                                    {courseDetails.courseType}
                                </Badge>

                                <Badge
                                    variant="light"
                                    color="green"
                                    radius="xl"
                                >
                                    {courseDetails.status}
                                </Badge>

                            </div>
                        </div>
                    </div>

                    {/* Course stats */}
                    <div className="grid grid-cols-2 gap-5 lg:min-w-[360px]">

                        <div className="flex items-center gap-3">
                            <IconUsers
                                size={23}
                                className="text-[#51021E]"
                            />

                            <div>
                                <p className="text-xs text-[#667085]">
                                    Total Students
                                </p>

                                <p className="font-semibold text-[#344054]">
                                    {students.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <IconCalendar
                                size={23}
                                className="text-[#51021E]"
                            />

                            <div>
                                <p className="text-xs text-[#667085]">
                                    Duration
                                </p>

                                <p className="font-semibold text-[#344054]">
                                    {courseDetails.duration} Months
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <IconCertificate
                                size={23}
                                className="text-[#51021E]"
                            />

                            <div>
                                <p className="text-xs text-[#667085]">
                                    Credits
                                </p>

                                <p className="font-semibold text-[#344054]">
                                    {courseDetails.credits}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <IconUser
                                size={23}
                                className="text-[#51021E]"
                            />

                            <div>
                                <p className="text-xs text-[#667085]">
                                    Teacher
                                </p>

                                <p className="font-semibold text-[#344054]">
                                    Mishley
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Marks section */}
            <div className="mt-6 rounded-2xl border border-[#eadde2] bg-white shadow-sm">

                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-[#eadde2] p-6 lg:flex-row lg:items-end lg:justify-between">

                    <div>
                        <h2 className="text-xl font-bold text-[#344054]">
                            Student Marks
                        </h2>

                        <p className="mt-1 text-sm text-[#667085]">
                            View and manage marks for enrolled students
                        </p>
                    </div>

                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={openAddModal}
                        className="!bg-[#51021E] hover:!bg-[#6D1535]"
                    >
                        Add Marks
                    </Button>
                </div>

                {/* Filters */}
                <div className="grid gap-4 border-b border-[#eadde2] p-5 lg:grid-cols-[220px_1fr_220px]">

                    {/* MARKS STATUS */}
                    <Select
                        label="Marks Status"
                        value={marksStatus}
                        onChange={setMarksStatus}
                        data={[
                            {
                                value: "ALL",
                                label: "All Students",
                            },
                            {
                                value: "SUBMITTED",
                                label: "Marks Submitted",
                            },
                            {
                                value: "NOT_SUBMITTED",
                                label: "Not Submitted",
                            },
                        ]}
                    />

                    {/* SEARCH */}
                    <TextInput
                        label="Search Student"
                        placeholder="Search by name or email..."
                        leftSection={
                            <IconSearch size={18} />
                        }
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.currentTarget.value
                            )
                        }
                    />

                    {/* RESET */}
                    <Button
                        variant="light"
                        color="pink"
                        className="mt-6 !text-[#51021E]"
                        onClick={resetFilters}
                    >
                        Reset
                    </Button>
                </div>

                {/* Data table */}
                <div className="p-4 md:p-6">

                    <DataTable
                        value={filteredMarks}
                        paginator
                        rows={6}
                        loading={loading}
                        dataKey="profileId"
                        emptyMessage="No marks found."
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[6, 10, 25]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        className="
                            [&_.p-datatable-wrapper]:rounded-xl
                            [&_.p-datatable-thead>tr>th]:bg-[#faf0f5]
                            [&_.p-datatable-thead>tr>th]:text-[#344054]
                            [&_.p-datatable-thead>tr>th]:font-semibold
                            [&_.p-datatable-thead>tr>th]:text-[13px]
                            [&_.p-datatable-tbody>tr>td]:text-[14px]
                            [&_.p-datatable-tbody>tr>td]:text-[#475467]
                            [&_.p-datatable-tbody>tr:hover]:bg-[#fff8fa]
                        "
                    >

                        {/* Number */}
                        <Column
                            header="#"
                            body={(_, options) =>
                                options.rowIndex + 1
                            }
                            style={{ width: "4rem" }}
                        />

                        {/* Student */}
                        <Column
                            field="profileName"
                            header="Student Name"
                            sortable
                            style={{ minWidth: "11rem" }}
                        />

                        {/* Email */}
                        <Column
                            field="profileEmail"
                            header="Email"
                            style={{ minWidth: "14rem" }}
                        />

                        {/* Mid Term */}
                        <Column
                            header="Mid Term"
                            body={(rowData) => (
                                <div className="flex items-center gap-1">

                                    <span>
                                        {rowData.midTerm ?? "-"}
                                    </span>

                                    {rowData.midTermId && (
                                        <>
                                            <Tooltip label="Edit Mid Term">
                                                <ActionIcon
                                                    variant="subtle"
                                                    onClick={() =>
                                                        openEditModal(
                                                            rowData,
                                                            "MID_TERM"
                                                        )
                                                    }
                                                    className="!text-[#51021E] hover:!bg-[#faf0f5]"
                                                >
                                                    <IconEdit size={16} />
                                                </ActionIcon>
                                            </Tooltip>

                                            <Tooltip label="Delete Mid Term">
                                                <ActionIcon
                                                    variant="subtle"
                                                    onClick={() =>
                                                        handleDelete(
                                                            rowData.midTermId,
                                                            rowData.profileName,
                                                            "Mid Term"
                                                        )
                                                    }
                                                    className="!text-red-500 hover:!bg-red-50"
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </>
                                    )}
                                </div>
                            )}
                            style={{ minWidth: "10rem" }}
                        />

                        {/* Final Exam */}
                        <Column
                            header="Final Exam"
                            body={(rowData) => (
                                <div className="flex items-center gap-1">

                                    <span>
                                        {rowData.finalExam ?? "-"}
                                    </span>

                                    {rowData.finalExamId && (
                                        <>
                                            <Tooltip label="Edit Final Exam">
                                                <ActionIcon
                                                    variant="subtle"
                                                    onClick={() =>
                                                        openEditModal(
                                                            rowData,
                                                            "FINAL_EXAM"
                                                        )
                                                    }
                                                    className="!text-[#51021E] hover:!bg-[#faf0f5]"
                                                >
                                                    <IconEdit size={16} />
                                                </ActionIcon>
                                            </Tooltip>

                                            <Tooltip label="Delete Final Exam">
                                                <ActionIcon
                                                    variant="subtle"
                                                    onClick={() =>
                                                        handleDelete(
                                                            rowData.finalExamId,
                                                            rowData.profileName,
                                                            "Final Exam"
                                                        )
                                                    }
                                                    className="!text-red-500 hover:!bg-red-50"
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </>
                                    )}
                                </div>
                            )}
                            style={{ minWidth: "10rem" }}
                        />

                        {/* Total */}
                        <Column
                            header="Total (200)"
                            body={(rowData) => {
                                const total =
                                    calculateTotal(rowData);

                                return total ?? "-";
                            }}
                            sortable
                            style={{ minWidth: "8rem" }}
                        />

                        {/* Percentage */}
                        <Column
                            header="Percentage"
                            body={(rowData) => {
                                const percentage =
                                    calculatePercentage(rowData);

                                return percentage
                                    ? `${percentage}%`
                                    : "-";
                            }}
                            style={{ minWidth: "8rem" }}
                        />

                        {/* Grade */}
                        <Column
                            header="Grade"
                            body={(rowData) => {
                                const percentage =
                                    calculatePercentage(rowData);

                                return getGradeBadge(
                                    getGrade(percentage)
                                );
                            }}
                            style={{ minWidth: "7rem" }}
                        />

                        {/* Remarks */}
                        <Column
                            field="remarks"
                            header="Remarks"
                            style={{ minWidth: "12rem" }}
                        />

                    </DataTable>
                </div>
            </div>

            {/* Add / Edit Modal */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                centered
                size="lg"
                radius="lg"
                title={
                    <div>
                        <p className="text-lg font-bold text-[#344054]">
                            {editMode
                                ? "Edit Marks"
                                : "Add Marks"}
                        </p>

                        <p className="text-xs text-[#667085]">
                            {courseDetails.courseName}
                        </p>
                    </div>
                }
            >

                <div className="space-y-4">

                    {/* Student */}
                    <Select
                        label="Student"
                        placeholder="Select student"
                        searchable
                        value={
                            form.profileId
                                ? String(form.profileId)
                                : null
                        }
                        onChange={(value) =>
                            setForm((prev) => ({
                                ...prev,
                                profileId: value
                                    ? Number(value)
                                    : null,
                            }))
                        }
                        data={students.map((student) => ({
                            value: String(
                                student.profileId
                            ),
                            label: `${student.profileName} - ${student.profileEmail}`,
                        }))}
                        disabled={editMode}
                    />

                    {/* Exam Type */}
                    <Select
                        label="Exam Type"
                        placeholder="Select exam type"
                        data={[
                            {
                                value: "MID_TERM",
                                label: "Mid Term",
                            },
                            {
                                value: "FINAL_EXAM",
                                label: "Final Exam",
                            },
                        ]}
                        value={form.examType}
                        onChange={(value) =>
                            setForm((prev) => ({
                                ...prev,
                                examType: value,
                            }))
                        }
                        disabled={editMode}
                    />

                    {/* Marks Obtained */}
                    <NumberInput
                        label="Marks Obtained"
                        placeholder="Enter marks"
                        min={0}
                        max={100}
                        value={form.marksObtained ?? ""}
                        onChange={(value) =>
                            setForm((prev) => ({
                                ...prev,
                                marksObtained:
                                    value === ""
                                        ? null
                                        : value,
                            }))
                        }
                    />

                    {/* Maximum Marks */}
                    <NumberInput
                        label="Maximum Marks"
                        value={100}
                        disabled
                    />

                    {/* Remarks */}
            <Textarea
    label="Remarks"
    placeholder="Enter remarks..."
    minRows={3}
    value={form.remarks}
    onChange={(event) => {
        const value = event.currentTarget.value;

        setForm((prev) => ({
            ...prev,
            remarks: value,
        }));
    }}
/>

                    <Divider />

                    <div className="flex justify-end gap-3">

                        <Button
                            variant="default"
                            onClick={() =>
                                setModalOpened(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSaveMarks}
                            className="!bg-[#51021E] hover:!bg-[#6D1535]"
                        >
                            {editMode
                                ? "Update Marks"
                                : "Save Marks"}
                        </Button>

                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Marks;