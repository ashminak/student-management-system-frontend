import React,{useState,useEffect} from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {TextInput,} from '@mantine/core';
import { Toolbar } from 'primereact/toolbar';
import { getCourseById } from '../../../service/CourseService';
import { getStudentsByCourseId } from '../../../service/EnrollmentService';
import { IconSearch } from '@tabler/icons-react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
const Students = ({ courseId }) => {
    const navigate = useNavigate();
    const[studentDetails,setStudentDetails]=useState([]);
    const[courseDetails,setCourseDetails]=useState([]);
    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            const course = await getCourseById(courseId);
            const student = await getStudentsByCourseId(courseId);
            
            setCourseDetails(course);
            setStudentDetails(student);
            console.log("Course Details:", course);
            console.log("Student Details:", student);
        } catch (error) {
            console.error("Error fetching course details:", error);
        }
    }

         const [filters, setFilters] = useState({
               global: {
                   value: null,
                   matchMode: FilterMatchMode.CONTAINS
               },
           
               profileName: {
                   operator: FilterOperator.AND,
                   constraints: [
                       {
                           value: null,
                           matchMode: FilterMatchMode.STARTS_WITH
                       }
                   ]
               },
           
               profileEmail: {
                   operator: FilterOperator.AND,
                   constraints: [
                       {
                           value: null,
                           matchMode: FilterMatchMode.STARTS_WITH
                       }
                   ]
               },
           
               
                enrollmentDate:{
                   operator: FilterOperator.AND,
                   constraints: [
                       {
                           value: null,
                           matchMode: FilterMatchMode.EQUALS
                       }
                   ]
               },
           
               status: {
                   operator: FilterOperator.AND,
                   constraints: [
                       {
                           value: null,
                           matchMode: FilterMatchMode.EQUALS
                       }
                   ]
               },
           
            
               
            });
            const [globalFilterValue, setGlobalFilterValue] = useState('');
            const onGlobalFilterChange = (e) => {
                const value = e.target.value;
                let _filters = { ...filters }; 
        
                _filters['global'].value = value;
        
                setFilters(_filters);
                setGlobalFilterValue(value);
            };

        const rightToolbarTemplate = () => {
            return  <TextInput leftSection={<IconSearch stroke={2}/>} fa={500} value={globalFilterValue} onChange={onGlobalFilterChange} 
            placeholder="Keyword Search" />
    ;
        };
           
  return (
    <div>
        <button
    onClick={() => navigate('/teacher/courses')}
    className="mb-5 mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#51021E] hover:text-[#6D1535]"
>
    <IconArrowLeft size={18} stroke={2} />
    Back to My Courses
</button>
<div className="w-full min-h-full bg-[#fafafa] p-6">

    {/* Back / Page heading */}
    <div className="mb-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-[#51021E]">
                    Enrolled Students
                </h1>

                <p className="mt-1 text-sm text-[#667085]">
                    Students enrolled in this course
                </p>
            </div>
        </div>
    </div>

    {/* Course Overview Card */}
    <div className="rounded-2xl border border-[#eadde2] bg-white p-6 shadow-sm">

        {/* Course title */}
        <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#344054]">
                {courseDetails.courseName}
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
                {courseDetails.description}
            </p>
        </div>

        {/* Course information */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

            {/* Course Code */}
            <div className="rounded-xl bg-[#faf0f5] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
                    Course Code
                </p>

                <p className="mt-1 text-sm font-semibold text-[#344054]">
                    {courseDetails.courseCode}
                </p>
            </div>

            {/* Credits */}
            <div className="rounded-xl bg-[#faf0f5] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
                    Credits
                </p>

                <p className="mt-1 text-sm font-semibold text-[#344054]">
                    {courseDetails.credits}
                </p>
            </div>

            {/* Course Type */}
            <div className="rounded-xl bg-[#faf0f5] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
                    Course Type
                </p>

                <p className="mt-1 text-sm font-semibold text-[#344054]">
                    {courseDetails.courseType}
                </p>
            </div>

            {/* Duration */}
            <div className="rounded-xl bg-[#faf0f5] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
                    Duration
                </p>

                <p className="mt-1 text-sm font-semibold text-[#344054]">
                    {courseDetails.duration} Months
                </p>
            </div>

        </div>

        {/* Bottom overview row */}
        <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-[#eee3e7] pt-5">

            <div>
                <p className="text-xs text-[#667085]">
                    Total Students
                </p>

                <p className="mt-1 text-lg font-bold text-[#51021E]">
                    {studentDetails.length}
                </p>
            </div>

            <div>
                <p className="text-xs text-[#667085]">
                    Course Status
                </p>

                <span
                    className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        courseDetails.status === "ACTIVE"
                            ? "bg-[#ecfdf3] text-[#027a48]"
                            : "bg-[#f2f4f7] text-[#475467]"
                    }`}
                >
                    {courseDetails.status}
                </span>
            </div>

        </div>
    </div>

    {/* Student Section */}
    <div className="mt-6 rounded-2xl border border-[#eadde2] bg-white shadow-sm">

        {/* Student header */}
        <div className="flex flex-col gap-3 border-b border-[#eee3e7] p-5 md:flex-row md:items-center md:justify-between">

            <div>
                <h3 className="text-lg font-bold text-[#344054]">
                    Enrolled Students
                </h3>

                <p className="mt-1 text-sm text-[#667085]">
                    View students enrolled in {courseDetails.courseName}
                </p>
            </div>

            {/* Search */}
            <div>
                <TextInput
                    leftSection={<IconSearch size={18} stroke={2} />}
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Search students..."
                    radius="md"
                    size="sm"
                    className="w-full md:w-[260px]"
                />
            </div>

        </div>

        {/* Data table */}
        <div className="p-3 md:p-5">

            <DataTable
                value={studentDetails}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={[
                    "profileName",
                    "profileEmail",
                    "enrollmentDate",
                    "status"
                ]}
                emptyMessage="No students enrolled."
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                className="
                    [&_.p-datatable-wrapper]:rounded-xl
                    [&_.p-datatable-thead>tr>th]:bg-[#faf0f5]
                    [&_.p-datatable-thead>tr>th]:text-[#344054]
                    [&_.p-datatable-thead>tr>th]:font-sans
                    [&_.p-datatable-thead>tr>th]:text-[14px]
                    [&_.p-datatable-thead>tr>th]:font-semibold
                    [&_.p-datatable-thead>tr>th]:border-b
                    [&_.p-datatable-thead>tr>th]:border-[#eadde2]
                    [&_.p-datatable-tbody>tr>td]:border-b
                    [&_.p-datatable-tbody>tr>td]:border-[#f2e9ed]
                    [&_.p-datatable-tbody>tr:hover]:bg-[#fff8fa]
                "
            >

                <Column
                    field="profileName"
                    header="Student Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Student Name"
                    bodyClassName="font-sans text-[14px] font-medium text-[#344054]"
                    style={{ minWidth: "12rem" }}
                />

                <Column
                    field="profileEmail"
                    header="Student Email"
                    sortable
                    filter
                    filterPlaceholder="Search by Student Email"
                    bodyClassName="font-sans text-[14px] text-[#475467]"
                    style={{ minWidth: "16rem" }}
                />

                <Column
                    field="enrollmentDate"
                    header="Enrollment Date"
                    sortable
                    filter
                    bodyClassName="font-sans text-[14px] text-[#475467]"
                    style={{ minWidth: "12rem" }}
                />

                <Column
                    field="status"
                    header="Status"
                    sortable
                    filter
                    body={(rowData) => (
                        <span className="inline-flex rounded-full bg-[#ecfdf3] px-3 py-1 text-xs font-semibold text-[#027a48]">
                            {rowData.status}
                        </span>
                    )}
                    style={{ minWidth: "9rem" }}
                />

            </DataTable>

        </div>
    </div>

</div>  

    </div>
  )
}

export default Students