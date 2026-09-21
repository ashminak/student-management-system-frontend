import React from 'react'
import { useEffect, useMemo, useState } from 'react';

import { Text,Card } from '@mantine/core';

import { FilterMatchMode, FilterOperator } from 'primereact/api';

import { DataTable } from 'primereact/datatable';

import { Column } from 'primereact/column';

import { InputText } from 'primereact/inputtext';

import { Toolbar } from 'primereact/toolbar';

import { Tag } from 'primereact/tag';

import { DatePickerInput  } from '@mantine/dates';

import { useForm } from '@mantine/form';

import { IconCalendar } from '@tabler/icons-react';

import {
    Modal,
    Button,
    Select,
    LoadingOverlay,
    ActionIcon,
    Drawer,
    Tooltip,
    Paper,
    TextInput,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';

import {
    IconSearch,
    IconPlus,
    IconUserPlus
} from '@tabler/icons-react';

import {
    errorNotification,
    successNotification
} from '../../../utility/NotificationUtil';

import {
    formateDate,
    formatDateForBackend
} from '../../../utility/DateUtility';

import { modals } from '@mantine/modals';

import { useSelector } from 'react-redux';

import {
    assignStudentToCourse
} from '../../../service/EnrollmentService';


// =============================================================
// CACHE
// =============================================================

import {
    getCachedEnrollments,
    refreshEnrollments,
} from '../../../service/EnrollmentCache';


// =============================================================
// COMPONENT
// =============================================================

const Enrollment = () => {

    const [
        enrollmentData,
        setEnrollmentData
    ] = useState([]);


    const [
        opened,
        {
            open,
            close
        }
    ] = useDisclosure(false);


    const [
        globalFilterValue,
        setGlobalFilterValue
    ] = useState('');


    const [
        courseTab,
        setCourseTab
    ] = useState('ACTIVE');


    // =========================================================
    // FETCH ENROLLMENT DATA
    // =========================================================

    const fetchEnrollmentData = async (
        forceRefresh = false
    ) => {

        try {

            const data =
                forceRefresh
                    ? await refreshEnrollments()
                    : await getCachedEnrollments();


            console.log(
                "Enrollment Data:",
                data
            );


            setEnrollmentData(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error fetching enrollment data:",
                error
            );


            setEnrollmentData([]);
        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        fetchEnrollmentData();

    }, []);


    // =========================================================
    // STATUS
    // =========================================================

    const getStatus = (
        status
    ) => {

        switch (status) {

            case 'APPROVED':

                return 'success';


            case 'PENDING':

                return 'warning';


            default:

                return null;
        }
    };


    // =========================================================
    // SELECTED ENROLLMENT
    // =========================================================

    const [
        selectedEnrollment,
        setSelectedEnrollment
    ] = useState(null);


    // =========================================================
    // OPEN UPDATE MODAL
    // =========================================================

    const openUpdateModal = (
        rowData
    ) => {

        console.log(
            "Selected Row:",
            rowData
        );


        setSelectedEnrollment(
            rowData
        );


        form.setValues({

            profileId:
                rowData.profileId,

            courseId:
                rowData.courseId,

            enrollmentDate:
                rowData.enrollmentDate
                    ? new Date(
                        rowData.enrollmentDate
                    )
                    : null,

            enrollmentStatus:
                "APPROVED"
        });


        open();
    };


    // =========================================================
    // SUBMIT / APPROVE ENROLLMENT
    // =========================================================

    const handleSubmit = async (
        values
    ) => {

        try {

            if (
                !selectedEnrollment
            ) {

                errorNotification(
                    "No enrollment selected"
                );

                return;
            }


            const enrollmentData = {

                id:
                    selectedEnrollment.id,

                profileId:
                    Number(
                        selectedEnrollment.profileId
                    ),

                courseId:
                    Number(
                        selectedEnrollment.courseId
                    ),

                enrollmentDate:
                    values.enrollmentDate
                        ? values.enrollmentDate
                            .toISOString()
                            .split("T")[0]
                        : null,

                enrollmentStatus:
                    values.enrollmentStatus
            };


            console.log(
                "Complete Enrollment DTO:",
                enrollmentData
            );


            const response =
                await assignStudentToCourse(
                    selectedEnrollment.id,
                    enrollmentData
                );


            console.log(
                "Updated:",
                response
            );


            successNotification(
                "Enrollment Approved"
            );


            // -------------------------------------------------
            // FORCE FRESH DATA AFTER UPDATE
            // -------------------------------------------------

            await fetchEnrollmentData(
                true
            );


            close();


            setSelectedEnrollment(
                null
            );

        } catch (error) {

            console.error(
                "Enrollment Update Error:",
                error
            );


            errorNotification(
                "Enrollment Update Failed"
            );
        }
    };


    // =========================================================
    // FORM
    // =========================================================

    const form = useForm({

        mode: 'uncontrolled',

        initialValues: {

            profileId: '',

            courseId: '',

            enrollmentDate: null,

            enrollmentStatus: '',
        },


        validate: {

            profileId: (
                value
            ) =>
                !value
                    ? "Profile ID is Required"
                    : undefined,


            courseId: (
                value
            ) =>
                !value
                    ? "Course ID is Required"
                    : undefined,


            enrollmentDate: (
                value
            ) =>
                !value
                    ? "Enrollment Date is Required"
                    : undefined,


            enrollmentStatus: (
                value
            ) =>
                !value
                    ? "Enrollment Status is Required"
                    : undefined,
        },
    });


    // =========================================================
    // ACTION COLUMN
    // =========================================================

    const actionBodyTemplate = (
        rowData
    ) => {

        return (

            <Button

                onClick={() =>
                    openUpdateModal(
                        rowData
                    )
                }

                variant="outline"

                color="#51021e"

                radius="md"

                size="sm"

                fw={600}

                leftSection={
                    <IconUserPlus
                        size={16}
                    />
                }

            >
                Assign
            </Button>
        );
    };


    // =========================================================
    // FILTERS
    // =========================================================

    const [
        filters,
        setFilters
    ] = useState({

        global: {

            value: null,

            matchMode:
                FilterMatchMode.CONTAINS
        },


        profileName: {

            operator:
                FilterOperator.AND,

            constraints: [

                {

                    value: null,

                    matchMode:
                        FilterMatchMode.STARTS_WITH
                }

            ]
        },


        courseName: {

            operator:
                FilterOperator.AND,

            constraints: [

                {

                    value: null,

                    matchMode:
                        FilterMatchMode.CONTAINS
                }

            ]
        },


        enrollmentDate: {

            operator:
                FilterOperator.AND,

            constraints: [

                {

                    value: null,

                    matchMode:
                        FilterMatchMode.DATE_IS
                }

            ]
        },


        status: {

            operator:
                FilterOperator.AND,

            constraints: [

                {

                    value: null,

                    matchMode:
                        FilterMatchMode.EQUALS
                }

            ]
        },
    });


    // =========================================================
    // SEARCH
    // =========================================================

    const onGlobalFilterChange = (
        e
    ) => {

        const value =
            e.target.value;


        let _filters =
            {
                ...filters
            };


        _filters[
            'global'
        ].value =
            value;


        setFilters(
            _filters
        );


        setGlobalFilterValue(
            value
        );
    };


    // =========================================================
    // TAB FILTER
    // =========================================================

    const filteredCourses =
        useMemo(() => {

            return enrollmentData.filter(
                (item) => {

                    if (
                        courseTab ===
                        "APPROVED"
                    ) {

                        return (
                            item.status ===
                            "APPROVED"
                        );
                    }


                    if (
                        courseTab ===
                        "PENDING"
                    ) {

                        return (
                            item.status ===
                            "PENDING"
                        );
                    }


                    return true;
                }
            );

        }, [
            enrollmentData,
            courseTab
        ]);


    // =========================================================
    // DATE
    // =========================================================

    const timeTemplate = (
        rowData
    ) => {

        return (
            <span
                className="text-ted-400"
            >
                {
                    formateDate(
                        rowData.enrollmentDate
                    )
                }
            </span>
        );
    };


    // =========================================================
    // STATUS COLUMN
    // =========================================================

    const statusBodyTemplate = (
        rowData
    ) => {

        const severityMap = {

            APPROVED:
                "success",

            PENDING:
                "warning",

            REJECTED:
                "danger"
        };


        return (

            <Tag

                value={
                    rowData.status
                }

                severity={
                    severityMap[
                        rowData.status
                    ]
                }

                className="
                    font-sans
                    font-semibold
                "
            />
        );
    };


    // =========================================================
    // SEARCH TOOLBAR
    // =========================================================

    const rightToolbarTemplate = () => {

        return (

            <TextInput

                leftSection={
                    <IconSearch
                        stroke={2}
                    />
                }

                fa={500}

                value={
                    globalFilterValue
                }

                onChange={
                    onGlobalFilterChange
                }

                placeholder="Keyword Search"
            />

        );
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                flex
                flex-col
                w-full
                h-full
                bg-[#f9f9f9]
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    mb-3
                    pt-2
                    pl-4
                "
            >

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-[#51021E]
                        tracking-tight
                    "
                >
                    Enrollment Management
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Manage student course
                    enrollments and enrollment
                    requests
                </p>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-4
                    mb-5
                    ml-1
                    mr-1
                "
            >

                <Card
                    shadow="sm"
                    radius="md"
                    withBorder
                >

                    <Text
                        size="sm"
                        c="dimmed"
                    >
                        Total Enrollments
                    </Text>


                    <Text
                        size="xl"
                        fw={700}
                        className="
                            text-[#51021e]
                        "
                    >
                        {
                            enrollmentData.length
                        }
                    </Text>

                </Card>


                <Card
                    shadow="sm"
                    radius="md"
                    withBorder
                >

                    <Text
                        size="sm"
                        c="dimmed"
                    >
                        Pending Enrollment Requests
                    </Text>


                    <Text
                        size="xl"
                        fw={700}
                        className="
                            text-[#51021e]
                        "
                    >
                        {
                            enrollmentData.filter(
                                (item) =>
                                    item.status ===
                                    "PENDING"
                            ).length
                        }
                    </Text>

                </Card>


                <Card
                    shadow="sm"
                    radius="md"
                    withBorder
                >

                    <Text
                        size="sm"
                        c="dimmed"
                    >
                        Approved Enrollments
                    </Text>


                    <Text
                        size="xl"
                        fw={700}
                        className="
                            text-[#51021e]
                        "
                    >
                        {
                            enrollmentData.filter(
                                (item) =>
                                    item.status ===
                                    "APPROVED"
                            ).length
                        }
                    </Text>

                </Card>

            </div>


            {/* =================================================
                DATA TABLE
            ================================================= */}

            <DataTable

                value={
                    filteredCourses
                }

                paginator

                rows={10}

                className="
                    [&_.p-datatable-thead>tr>th]:bg-[#faf0f5]
                    [&_.p-datatable-thead>tr>th]:text-[#344054]
                    [&_.p-datatable-thead>tr>th]:font-sans
                    [&_.p-datatable-thead>tr>th]:text-[14px]
                    [&_.p-datatable-thead>tr>th]:font-semibold
                "

                paginatorTemplate="
                    FirstPageLink
                    PrevPageLink
                    PageLinks
                    NextPageLink
                    LastPageLink
                    CurrentPageReport
                    RowsPerPageDropdown
                "

                rowsPerPageOptions={[
                    10,
                    25,
                    50
                ]}

                dataKey="id"

                filters={
                    filters
                }

                filterDisplay="menu"

                globalFilterFields={[
                    'profileName',
                    'courseName',
                    'enrollmentDate',
                    'status'
                ]}

                emptyMessage="
                    No Enrollment Found.
                "

                currentPageReportTemplate="
                    Showing {first}
                    to {last}
                    of {totalRecords}
                    entries
                "
            >


                <Column

                    field="profileId"

                    header="Student Profile ID"

                    body={(
                        rowData
                    ) => (

                        <span
                            className="
                                inline-flex
                                items-center
                                rounded-md
                                bg-[#faf0f5]
                                px-3
                                py-1
                                text-[13px]
                                font-semibold
                                text-[#51021E]
                            "
                        >
                            #{
                                rowData.profileId
                            }
                        </span>

                    )}

                    style={{
                        minWidth:
                            '9rem'
                    }}
                />


                <Column

                    field="profileName"

                    header="Student Name"

                    sortable

                    filter

                    filterPlaceholder="
                        Search by Student Name
                    "

                    body={(
                        rowData
                    ) => (

                        <span
                            className="
                                font-sans
                                text-[14px]
                                font-semibold
                                text-[#344054]
                            "
                        >
                            {
                                rowData.profileName
                            }
                        </span>

                    )}

                    style={{
                        minWidth:
                            '10rem'
                    }}
                />


                <Column

                    field="courseId"

                    header="Course ID"

                    body={(
                        rowData
                    ) => (

                        <span
                            className="
                                inline-flex
                                items-center
                                rounded-md
                                bg-gray-100
                                px-3
                                py-1
                                text-[13px]
                                font-semibold
                                text-gray-700
                            "
                        >
                            #{
                                rowData.courseId
                            }
                        </span>

                    )}

                    style={{
                        minWidth:
                            '7rem'
                    }}
                />


                <Column

                    field="courseName"

                    header="Course Name"

                    sortable

                    filter

                    filterPlaceholder="
                        Search by Course Name
                    "

                    body={(
                        rowData
                    ) => (

                        <span
                            className="
                                font-sans
                                text-[14px]
                                font-semibold
                                text-[#344054]
                            "
                        >
                            {
                                rowData.courseName
                            }
                        </span>

                    )}

                    style={{
                        minWidth:
                            '13rem'
                    }}
                />


                <Column

                    field="enrollmentDate"

                    header="Enrollment Date"

                    sortable

                    filter

                    filterPlaceholder="
                        Search by Date
                    "

                    body={(
                        rowData
                    ) => (

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                text-[#667085]
                            "
                        >

                            <IconCalendar
                                size={17}
                                stroke={1.8}
                                className="
                                    text-[#51021E]
                                "
                            />


                            <span
                                className="
                                    font-sans
                                    text-[14px]
                                    font-medium
                                "
                            >
                                {
                                    formateDate(
                                        rowData.enrollmentDate
                                    )
                                }
                            </span>

                        </div>

                    )}

                    style={{
                        minWidth:
                            '12rem'
                    }}
                />


                <Column

                    field="status"

                    header="Status"

                    sortable

                    filter

                    body={
                        statusBodyTemplate
                    }

                    style={{
                        minWidth:
                            '9rem'
                    }}
                />


                <Column

                    header="Action"

                    body={
                        actionBodyTemplate
                    }

                />

            </DataTable>


            {/* =================================================
                APPROVE ENROLLMENT MODAL
            ================================================= */}

            <Modal

                opened={
                    opened
                }

                onClose={
                    close
                }

                size="lg"

                title={

                    <div
                        className="
                            text-2xl
                            font-bold
                            text-[#51021e]
                            font-sans
                        "
                    >
                        Enroll Student
                    </div>

                }
            >

                <form
                    onSubmit={
                        form.onSubmit(
                            handleSubmit
                        )
                    }
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-1
                        "
                    >

                        <label
                            htmlFor="profileId"
                            className="
                                text-base
                                font-semibold
                                text-gray-900
                            "
                        >
                            Profile Id
                            <span
                                className="
                                    text-red-500
                                "
                            >
                                *
                            </span>
                        </label>


                        <InputText

                            id="profileId"

                            value={
                                form.values.profileId
                            }

                            onChange={(
                                e
                            ) =>
                                form.setFieldValue(
                                    'profileId',
                                    e.target.value
                                )
                            }

                            placeholder="
                                Enter Profile Id
                            "

                            className="
                                border
                                border-gray-700
                                rounded-lg
                                shadow-sm
                                focus:border-[#51021e]
                                focus:ring-1
                                focus:ring-[#51021e]
                                p-2
                                mb-3
                            "
                        />

                    </div>


                    <div
                        className="
                            flex
                            flex-col
                            gap-1
                        "
                    >

                        <label
                            htmlFor="courseId"
                            className="
                                text-base
                                font-semibold
                                text-gray-900
                            "
                        >
                            Course Id
                            <span
                                className="
                                    text-red-500
                                "
                            >
                                *
                            </span>
                        </label>


                        <InputText

                            id="courseId"

                            value={
                                form.values.courseId
                            }

                            onChange={(
                                e
                            ) =>
                                form.setFieldValue(
                                    'courseId',
                                    e.target.value
                                )
                            }

                            placeholder="
                                Enter Course Id
                            "

                            className="
                                border
                                border-gray-700
                                rounded-lg
                                mb-2
                                shadow-sm
                                focus:border-[#51021e]
                                focus:ring-1
                                focus:ring-[#51021e]
                                p-2
                                mb-3
                            "
                        />

                    </div>


                    <div
                        className="
                            flex
                            flex-col
                            gap-1
                        "
                    >

                        <label
                            htmlFor="enrollmentDate"
                            className="
                                text-base
                                font-semibold
                                text-gray-900
                            "
                        >
                            Enrollment Date
                            <span
                                className="
                                    text-red-500
                                "
                            >
                                *
                            </span>
                        </label>


                        <DatePickerInput

                            {...form.getInputProps(
                                "enrollmentDate"
                            )}

                            id="enrollmentDate"

                            withAsterisk

                            placeholder="
                                Pick date
                            "

                            className="
                                border
                                border-gray-700
                                rounded-lg
                                mb-2
                                shadow-sm
                                focus:border-[#51021e]
                                focus:ring-1
                                focus:ring-[#51021e]
                                p-2
                                mb-3
                            "
                        />

                    </div>


                    <div
                        className="
                            flex
                            flex-col
                            gap-1
                        "
                    >

                        <label
                            htmlFor="enrollmentStatus"
                            className="
                                text-base
                                font-semibold
                                text-gray-900
                            "
                        >
                            Enrollment Status
                            <span
                                className="
                                    text-red-500
                                "
                            >
                                *
                            </span>
                        </label>


                        <Select

                            {...form.getInputProps(
                                "enrollmentStatus"
                            )}

                            id="enrollmentStatus"

                            placeholder="
                                Select Enrollment Status
                            "

                            className="
                                border
                                border-gray-700
                                rounded-lg
                                mb-2
                                shadow-sm
                                focus:border-[#51021e]
                                focus:ring-1
                                focus:ring-[#51021e]
                                p-2
                                mb-3
                            "

                            data={[
                                {
                                    value:
                                        'APPROVED',
                                    label:
                                        'APPROVED'
                                }
                            ]}
                        />

                    </div>


                    <Button
                        type="submit"
                        className="mt-4"
                        fullWidth
                        bg="#51021e"
                    >
                        Assign Student
                    </Button>

                </form>

            </Modal>

        </div>
    );
};


export default Enrollment;