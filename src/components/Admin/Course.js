import React, { useState, useEffect } from 'react';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';

import {
    Modal,
    Button,
    Select,
    LoadingOverlay,
    ActionIcon,
    Text,
    Card,
    Drawer,
    Tooltip,
    Paper,
    TextInput,
    SegmentedControl
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

import {
    IconSearch,
    IconPlus,
    IconEdit,
    IconTrash,
    IconEye,
    IconUsers,
    IconX,
    IconSchool
} from '@tabler/icons-react';

import {
    addCourse,
    deleteCourse,
    getCourseById,
    assignTeacherToCourse
} from '../../service/CourseService';

import {
    errorNotification,
    successNotification
} from '../../utility/NotificationUtil';

import { modals } from '@mantine/modals';
import { useSelector } from 'react-redux';
import api from "../../Interceptor/AxiosInterceptor";
import { notifications } from "@mantine/notifications";
import {
    getCachedCourses,
    clearCourseCache,
} from '../../service/AdminCourseCache';
 
const Course = () => {
    const userDetails = useSelector((state) => state.user);
    const [course, setCourse] =useState([]);
    const [loading,setLoading]=useState(false);
    const [loadingView, setLoadingView] = useState(false);
    const [loadingAssign, setLoadingAssign] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [courseTab,setCourseTab] =useState('ACTIVE');
    const [viewOpened, setViewOpened] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [assignOpened, setAssignOpened] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [assignedTeachers, setAssignedTeachers] = useState([]);
    const [removeTeacherOpened, setRemoveTeacherOpened] = useState(false);
    const [teacherToRemove, setTeacherToRemove] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [teacherOptions, setTeacherOptions] = useState([]);   
    
    const getStatus = (status) => {
        switch (status) {
            case 'ONLINE':
                return 'success';
            case 'OFFLINE':
                return 'info';
            default :
            return null;    

            
        }
    };
    
     const [filters, setFilters] = useState({
           global: {
               value: null,
               matchMode: FilterMatchMode.CONTAINS
           },
       
           courseCode: {
               operator: FilterOperator.AND,
               constraints: [
                   {
                       value: null,
                       matchMode: FilterMatchMode.STARTS_WITH
                   }
               ]
           },
       
           courseName: {
               operator: FilterOperator.AND,
               constraints: [
                   {
                       value: null,
                       matchMode: FilterMatchMode.CONTAINS
                   }
               ]
           },
       
           description: {
               operator: FilterOperator.AND,
               constraints: [
                   {
                       value: null,
                       matchMode: FilterMatchMode.CONTAINS
                   }
               ]
           },
            credits:{
               operator: FilterOperator.AND,
               constraints: [
                   {
                       value: null,
                       matchMode: FilterMatchMode.EQUALS
                   }
               ]
           },
       
           courseType: {
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

const fetchData = async () => {

    try {

        const cachedData =
            await getCachedCourses();


        // -----------------------------------------------------
        // SAFE TEACHER ARRAY
        // -----------------------------------------------------

        const cachedTeachers =
            Array.isArray(
                cachedData?.teachers
            )
                ? cachedData.teachers
                : [];


        // -----------------------------------------------------
        // SAFE COURSE ARRAY
        // -----------------------------------------------------

        const cachedCourses =
            Array.isArray(
                cachedData?.courses
            )
                ? cachedData.courses
                : [];


        setTeachers(
            cachedTeachers
        );


        setCourse(
            cachedCourses
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


        // Never allow the UI to receive undefined.
        setTeachers([]);

        setCourse([]);
    }
};
 

    useEffect(() => {
    fetchData();
}, [refresh]);

    const handleSubmit = async (values) => {
    try {
        console.log("========== 1. SUBMIT START ==========");
        console.log("FORM VALUES:", values);

      


        const courseDTO = {
            courseCode: values.courseCode,
            courseName: values.courseName,
            description: values.description,
            credits: values.credits,
            courseType: values.courseType,
            status: values.status,
            duration: values.duration
        };

        console.log("========== 5. FINAL DTO ==========");
        console.log(courseDTO);

        const response = await addCourse(courseDTO);

        console.log("========== 6. COURSE POST SUCCESS ==========");
        console.log(response);

        successNotification("Course Added Successfully");

        form.reset();
        close();
        clearCourseCache();
        fetchData();
    } catch (error) {

        console.error("========== COURSE ERROR ==========");
        console.error(error);

        console.error("STATUS:", error.response?.status);
        console.error("URL:", error.config?.url);
        console.error("RESPONSE:", error.response?.data);

        errorNotification(
            error.response?.data?.message ||
            error.response?.data?.errorMessage ||
            error.message ||
            "Failed to add Course"
        );
    }
    };
    const confirmRemoveTeacher = (teacher) => {
    setTeacherToRemove(teacher);
    setRemoveTeacherOpened(true);
};
    const handleDelete = (rowData) => {

    modals.openConfirmModal({
        title: (
            <span className="text-xl font-serif font-semibold">
                Are you Sure?
            </span>
        ),

        centered: true,

        children: (
            <Text size="sm">
                Are you sure you want to delete this Course?
                This action cannot be undone.
            </Text>
        ),

        labels: {
            confirm: 'Confirm',
            cancel: 'Cancel'
        },

        onCancel: () => console.log('Cancel'),

        onConfirm: () => {
            console.log("DELETING IS",rowData.id)
            deleteCourse(rowData.id)
                .then(() => {

                    successNotification(
                        "Course Deleted Successfully"
                    );

                    // setAttendance(
                    //     attendance.filter(
                    //         (attendance) => attendance.id !== rowData.id
                    //     )
                    // );
                     setCourse(prev =>
            prev.filter(course => course.id !== rowData.id)
        );

                    clearCourseCache();

                })
                .catch((error) => {

                    errorNotification(
                        error.response?.data?.errorMessage ||
                        "Failed to delete Course"
                    );

                });
        }
    });
    };
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
        courseCode: '',
        courseName: '',
        description:'',
        credits:'',
        courseType:'',
        status: '',
        duration: ''
        },
    
        validate: {
        courseCode: (value) =>
            !value ? "Course Code is Required" : undefined,
    
        courseName: (value) =>
            !value ? "Course Name is Required" : undefined,
    
        description: (value) =>
            !value ? "Description is Required" : undefined,
        credits: (value) =>
            !value ? "Credits is Required" : undefined,
        courseType: (value) =>
            !value ? "Course Type is Required" : undefined,
    
        status: (value) =>
            !value ? "Status is Required" : undefined,
    
        duration: (value) =>
            !value ? "Duration is Required" : undefined,
        },
        });

    const actionBodyTemplate = (rowData) => {
        return (
  <div className="flex gap-1">
     <Tooltip label="Delete Course" position="top">
    <ActionIcon
        variant="subtle"
        color="red"
        onClick={() => handleDelete(rowData)}
    >
        <IconTrash size={18} stroke={1.8} />
    </ActionIcon>
    </Tooltip>
       <Tooltip label="View Course" position="top">    
    <ActionIcon
        variant="subtle"
        color="gray"
        onClick={() => handleView(rowData)}
    >
        <IconEye size={18} stroke={1.8} />
    </ActionIcon>
     </Tooltip>   
     <Tooltip label="Assign Teachers" position="top">      
    <ActionIcon
        variant="subtle"
        color="#51021E"
        onClick={() => handleAssign(rowData)}
    >
        <IconUsers size={18} stroke={1.8} />
    </ActionIcon>
            </Tooltip>  
</div>
        );
    };
    const handleAddTeacher = (teacher) => {

    setAssignedTeachers((prev) => [
        ...prev,
        {
            teacherId: teacher.id,
            email: teacher.email
        }
    ]);

};
const handleRemoveTeacher = async (assignmentId) => {
    try {

        await api.delete(
            `/course/removeTeacherFromCourse/${assignmentId}`
        );

        setAssignedTeachers((prev) =>
            prev.filter(
                (teacher) => teacher.id !== assignmentId
            )
        );
        clearCourseCache();
        setRefresh((prev) => prev + 1);

        notifications.show({
            title: "Teacher Removed",
            message: "Teacher has been removed from this course.",
            color: "green",
        });
        window.location.reload();
    } catch (error) {

        console.error(error);

        notifications.show({
            title: "Error",
            message: "Failed to remove teacher from course.",
            color: "red",
        });
    }
};
   const handleView = async (rowData) => {
    setLoadingView(true);

    try {
        const courseDetails = await getCourseById(rowData.id);

        const cachedCourse = course.find(
            (item) => item.id === rowData.id
        );

        const courseWithTeachers = {
            ...courseDetails,
            teacherEmails:
                cachedCourse?.teacherEmails || [],
            assignedTeachers:
                cachedCourse?.assignedTeachers || []
        };

        console.log("COURSE DETAILS:", courseWithTeachers);

        setSelectedCourse(courseWithTeachers);
        setViewOpened(true);

    } catch (error) {
        console.error("GET COURSE DETAILS ERROR:", error);
        console.error("STATUS:", error.response?.status);
        console.error("URL:", error.config?.url);
        console.error("RESPONSE:", error.response?.data);

    } finally {
        setLoadingView(false);
    }
};

  const handleAssign = async (rowData) => {

    setSelectedCourse(rowData);
    setAssignOpened(true);

    const cachedCourse = course.find(
        (item) => item.id === rowData.id
    );

    setAssignedTeachers(
        cachedCourse?.assignedTeachers || []
    );
};
const handleSaveAssignments = async () => {

    if (!selectedCourse) {
        return;
    }

    if (assignedTeachers.length === 0) {
        errorNotification("Please assign at least one teacher");
        return;
    }

    try {

        for (const teacher of assignedTeachers) {

            const dto = {
                teacherId: teacher.teacherId,
                courseId: selectedCourse.id
            };

            console.log("ASSIGNMENT DTO:", dto);

            await assignTeacherToCourse(dto);
        }

        successNotification(
            "Teacher Assigned Successfully"
        );

        closeAssignDrawer();

        clearCourseCache();
        fetchData();

    } catch (error) {

        console.error("ASSIGN TEACHER ERROR:", error);
        console.error("STATUS:", error.response?.status);
        console.error("URL:", error.config?.url);
        console.error("RESPONSE:", error.response?.data);

        errorNotification(
            error.response?.data?.errorMessage ||
            "Failed to assign teacher"
        );
    }
};
    const closeAssignDrawer = () => {
    setAssignOpened(false);
    setSelectedCourse(null);
    };
  
    const leftToolbarTemplate = () =>{
           return <div> <Button leftSection={<IconPlus/>} variant="filled" onClick={open} 
            className="!bg-[#51021e] !text-white  font-serif" >Add Course</Button>
    
          </div>
    
    }
    const rightToolbarTemplate = () => {
            return  <TextInput leftSection={<IconSearch stroke={2}/>} fa={500} value={globalFilterValue} onChange={onGlobalFilterChange} 
            placeholder="Keyword Search" />
    ;
        };
          
    const statusBodyTemplate = (rowData) => {
            return <Tag value={rowData.status} severity={getStatus(rowData.status)} />;
        };
        
    const centerToolTemplate = () => {
        return <SegmentedControl
        value={courseTab}
         onChange={setCourseTab}
         data={[
        { label: 'All Courses', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive'},
        { label: 'Archived', value: 'archived' }
        ]}
         color="#51021E"
        bg="#F3E8ED"
        radius="md"
        className="border border-[#E8D5DD]"
        />
    }
    
   const filteredCourses = course.filter((item) => {

    if (courseTab === "active") {
        return item.status === "ACTIVE";
    }

    if (courseTab === "inactive") {
        return item.status === "INACTIVE";
    }

    if (courseTab === "archived") {
        return item.status === "ARCHIVED";
    }

    return true;
});

return (
          <>
          <div className="card shadow-[0_0_15px_rgba(0,0,0,0.2)] ml-2 mr-2 overflow-x-auto">
               <div> 
                 <div className="text-3xl font-sans text-bold m-2 text-[#51021e]">Course Management</div>
                 <div className='m-2 text-base font-sans font-normal text-slate-500  '>Create, manage, and organize courses</div>
               </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 ml-1 mr-1">

    <Card shadow="sm" radius="md" withBorder>
        <Text size="sm" c="dimmed">
            Total Courses
        </Text>

        <Text size="xl" fw={700} className="text-[#51021e]">
            {course.length}
        </Text>
    </Card>

    <Card shadow="sm" radius="md" withBorder>
        <Text size="sm" c="dimmed">
            Active Courses
        </Text>

        <Text size="xl" fw={700} className="text-[#51021e]">
            {course.filter(
                (item) => item.status === "ACTIVE"
            ).length}
        </Text>
    </Card>

    <Card shadow="sm" radius="md" withBorder>
        <Text size="sm" c="dimmed">
            Archived Courses
        </Text>

        <Text size="xl" fw={700} className="text-[#51021e]">
            {course.filter(
                (item) => item.status === "ARCHIVED"
            ).length}
        </Text>
    </Card>

           </div>
              <Toolbar className="mb-4" start={leftToolbarTemplate} center={centerToolTemplate} end={rightToolbarTemplate}></Toolbar>
              <DataTable value={filteredCourses} paginator  rows={10} className="
          [&_.p-datatable-thead>tr>th]:bg-[#faf0f5]
          [&_.p-datatable-thead>tr>th]:text-[#344054]
           [&_.p-datatable-thead>tr>th]:font-sans
    [&_.p-datatable-thead>tr>th]:text-[14px]
    [&_.p-datatable-thead>tr>th]:font-semibold
 

      "
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                      rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                      filters={filters} filterDisplay="menu" globalFilterFields={['courseCode','courseName', 'description', 'credits','courseType', 'status']}
                      emptyMessage="No Course Found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
          
                  <Column
      field="courseCode"
      header="Course Code"
      sortable
      filter
      filterPlaceholder="Search by  Course Code"
      bodyClassName="font-sans text-[14px] font-medium text-[#344054]"
      style={{ minWidth: '2rem' }}
  />
  
  <Column
      field="courseName"
      header="Course Name"
      sortable
      filter
      filterPlaceholder="Search by Course Name"
      bodyClassName="font-sans text-[14px] font-medium text-[#344054]"
      style={{ minWidth: '6rem' }}
  />
  
  <Column
      field="description"
      header="Description"
      sortable
      filter
      filterPlaceholder="Search by Description"
      bodyClassName="font-sans text-[14px] font-normal text-[#475467]"
      style={{ minWidth: '10rem' }}
  />
  <Column
    header="Teacher"
    body={(rowData) => (
        <div className="flex flex-col gap-1">
            {rowData.teacherEmails?.length > 0 ? (
                rowData.teacherEmails.map((email) => (
                    <span
                        key={email}
                         className="font-sans text-[14px] font-medium text-[#344054]"
                    >
                        {email}
                    </span>
                ))
            ) : (
                <span className="font-sans text-[14px] text-[#98A2B3]">
                    Unassigned
                </span>
            )}
        </div>
    )}
    style={{ minWidth: "6rem" }}
/>

  <Column
      field="credits"
      header="Credits"
      sortable
      filter
      filterPlaceholder="Search by Credits"
      bodyClassName="font-sans text-[14px] font-medium text-[#344054]"
      style={{ minWidth: '2rem' }}
      
  />

  <Column
      field="courseType"
      header="Course Type"
      filter
      filterPlaceholder="Search Course Type"
      bodyClassName="font-sans text-[14px] font-medium text-[#344054]"
      style={{ minWidth: '3rem' }}
  />
  
  <Column
      field="status"
      header="Status"
      sortable
      filter
      bodyClassName="font-sans text-[14px] font-medium text-[#344054]"
      style={{ minWidth: '2rem' }}
      body={statusBodyTemplate}
  />
  
  <Column
      field="duration"
      header="Duration"
      bodyClassName="font-sans text-[14px] font-medium text-[#344054]"
      style={{ minWidth: '2rem' }}
  />
                
                  <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
                   body={actionBodyTemplate} />
              </DataTable>
                </div>
                <Drawer
    opened={viewOpened}
    onClose={() => setViewOpened(false)}
    position="right"
    size="md"
    title={
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#51021E] flex items-center justify-center">
                <span className="text-white text-lg"><IconSchool stroke={2} /></span>
            </div>

            <div>
                <Text className="text-lg font-bold text-[#51021E]">
                    Course Details
                </Text>

                <Text className="text-xs text-slate-500">
                    Course information
                </Text>
            </div>
        </div>
    }
    styles={{
        header: {
            padding: "20px 24px",
            borderBottom: "1px solid #E5E7EB",
        },
        body: {
            padding: 0,
        },
    }}
>
    {selectedCourse && (
        <div className="relative h-full flex flex-col">

            {/* ================= COURSE HEADER ================= */}
            <div className="px-6 pt-6 pb-5 border-b border-slate-100">

                <div className="flex items-start justify-between gap-4">

                    <div>
                        <Text className="text-2xl font-bold text-slate-900">
                            {selectedCourse.courseName}
                        </Text>

                        <Text className="text-sm text-slate-500 mt-1">
                            Course Code:{" "}
                            <span className="font-medium text-slate-700">
                                {selectedCourse.courseCode}
                            </span>
                        </Text>
                    </div>

                    {/* Status */}
                    <span
                        className={`shrink-0 inline-flex items-center gap-1.5
                        px-3 py-1.5 rounded-full text-xs font-semibold
                        ${
                            selectedCourse.status === "ACTIVE"
                                ? "bg-green-50 text-green-700"
                                : selectedCourse.status === "INACTIVE"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-slate-100 text-slate-600"
                        }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full
                            ${
                                selectedCourse.status === "ACTIVE"
                                    ? "bg-green-500"
                                    : selectedCourse.status === "INACTIVE"
                                    ? "bg-yellow-500"
                                    : "bg-slate-400"
                            }`}
                        />

                        {selectedCourse.status}
                    </span>

                </div>

            </div>


            {/* ================= SCROLLABLE CONTENT ================= */}
            <div className="flex-1 overflow-y-auto px-6 py-6">

                {/* ================= COURSE OVERVIEW ================= */}
                <div>

                    <div className="flex items-center justify-between mb-3">
                        <Text className="text-sm font-bold text-slate-900">
                            Course Overview
                        </Text>

                        <Text className="text-xs text-slate-400">
                            Basic information
                        </Text>
                    </div>


                    <div className="grid grid-cols-2 gap-3">

                        {/* Course Type */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <Text className="text-xs font-medium text-slate-500">
                                Course Type
                            </Text>

                            <Text className="text-sm font-semibold text-slate-900 mt-2">
                                {selectedCourse.courseType}
                            </Text>

                        </div>


                        {/* Credits */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <Text className="text-xs font-medium text-slate-500">
                                Credits
                            </Text>

                            <Text className="text-lg font-bold text-slate-900 mt-1">
                                {selectedCourse.credits}
                            </Text>

                        </div>


                        {/* Duration */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <Text className="text-xs font-medium text-slate-500">
                                Duration
                            </Text>

                            <Text className="text-sm font-semibold text-slate-900 mt-2">
                                {selectedCourse.duration}
                            </Text>

                        </div>


                        {/* Status */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <Text className="text-xs font-medium text-slate-500">
                                Status
                            </Text>

                            <Text
                                className={`text-sm font-semibold mt-2 ${
                                    selectedCourse.status === "ACTIVE"
                                        ? "text-green-600"
                                        : "text-slate-600"
                                }`}
                            >
                                {selectedCourse.status}
                            </Text>

                        </div>

                    </div>

                </div>


                {/* ================= DESCRIPTION ================= */}
                <div className="mt-7">

                    <Text className="text-sm font-bold text-slate-900">
                        Description
                    </Text>

                    <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">

                        <Text className="text-sm leading-6 text-slate-600">
                            {selectedCourse.description ||
                                "No description available for this course."}
                        </Text>

                    </div>

                </div>


                {/* ================= TEACHERS ================= */}
                <div className="mt-7">

                    <div className="flex items-center justify-between">

                        <Text className="text-sm font-bold text-slate-900">
                            Assigned Teachers
                        </Text>

                        <span className="text-xs text-slate-400">
                            {selectedCourse.teacherEmails?.length || 0}{" "}
                            {selectedCourse.teacherEmails?.length === 1
                                ? "Teacher"
                                : "Teachers"}
                        </span>

                    </div>


                    {selectedCourse.teacherEmails?.length > 0 ? (

                        <div className="flex flex-col gap-3 mt-3">

                            {selectedCourse.teacherEmails.map((email) => {

                                // Get first letter for avatar
                                const firstLetter =
                                    email?.charAt(0)?.toUpperCase() || "T";

                                // Create a simple display name
                                const teacherName =
                                    email?.split("@")[0] || "Teacher";

                                return (
                                    <div
                                        key={email}
                                        className="flex items-center gap-3
                                        rounded-xl border border-slate-200
                                        bg-white p-3
                                        hover:bg-slate-50
                                        transition-colors"
                                    >

                                        {/* Avatar */}
                                        <div
                                            className="w-10 h-10 shrink-0
                                            rounded-full bg-[#51021E]
                                            flex items-center justify-center
                                            text-white text-sm font-bold"
                                        >
                                            {firstLetter}
                                        </div>


                                        {/* Teacher information */}
                                        <div className="flex-1 min-w-0">

                                            <Text
                                                className="text-sm font-semibold
                                                text-slate-900 capitalize"
                                            >
                                                {teacherName}
                                            </Text>

                                            <Text
                                                className="text-xs text-slate-500
                                                truncate mt-0.5"
                                            >
                                                {email}
                                            </Text>

                                        </div>


                                        {/* Role */}
                                        <span
                                            className="shrink-0 px-2.5 py-1
                                            rounded-md bg-slate-100
                                            text-xs font-medium
                                            text-slate-600"
                                        >
                                            Teacher
                                        </span>

                                    </div>
                                );
                            })}

                        </div>

                    ) : (

                        /* No teacher assigned */
                        <div
                            className="mt-3 rounded-xl border border-dashed
                            border-slate-300 bg-slate-50 p-5 text-center"
                        >

                            <Text className="text-sm font-medium text-slate-500">
                                No teacher assigned
                            </Text>

                            <Text className="text-xs text-slate-400 mt-1">
                                This course currently has no assigned teacher.
                            </Text>

                        </div>

                    )}

                </div>


                {/* ================= COURSE INFORMATION ================= */}
                <div className="mt-7 pb-6">

                    <Text className="text-sm font-bold text-slate-900">
                        Course Information
                    </Text>

                    <div className="mt-3 rounded-xl border border-slate-200 divide-y divide-slate-100">

                        {/* Course Code */}
                        <div className="flex items-center justify-between px-4 py-3">

                            <Text className="text-sm text-slate-500">
                                Course Code
                            </Text>

                            <Text className="text-sm font-semibold text-slate-800">
                                {selectedCourse.courseCode}
                            </Text>

                        </div>


                        {/* Course Type */}
                        <div className="flex items-center justify-between px-4 py-3">

                            <Text className="text-sm text-slate-500">
                                Type
                            </Text>

                            <Text className="text-sm font-semibold text-slate-800">
                                {selectedCourse.courseType}
                            </Text>

                        </div>


                        {/* Credits */}
                        <div className="flex items-center justify-between px-4 py-3">

                            <Text className="text-sm text-slate-500">
                                Credits
                            </Text>

                            <Text className="text-sm font-semibold text-slate-800">
                                {selectedCourse.credits}
                            </Text>

                        </div>


                        {/* Duration */}
                        <div className="flex items-center justify-between px-4 py-3">

                            <Text className="text-sm text-slate-500">
                                Duration
                            </Text>

                            <Text className="text-sm font-semibold text-slate-800">
                                {selectedCourse.duration}
                            </Text>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= STICKY FOOTER ================= */}
            <div
                className="shrink-0 border-t border-slate-200
                bg-white px-6 py-4"
            >

            </div>

        </div>
    )}
</Drawer>
<Drawer
    opened={assignOpened}
    onClose={closeAssignDrawer}
    position="right"
    size="md"
    title={
        <div className="font-sans text-xl font-bold text-[#51021E]">
            Assign Teachers
        </div>
    }
>
    <div className="flex flex-col h-full">

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-y-auto pr-1">

            {/* Available Teachers */}
            <div className="mb-8">

                <div className="flex items-center justify-between mb-3">

                    <div>
                        <Text
                            className="font-semibold text-[#51021E]"
                            size="md"
                        >
                            Available Teachers
                        </Text>

                        <Text
                            size="xs"
                            className="text-slate-400 mt-0.5"
                        >
                            Select a teacher to assign to this course
                        </Text>
                    </div>

                    <div className="
                        min-w-[28px]
                        h-7
                        px-2
                        rounded-full
                        bg-[#faf0f5]
                        text-[#51021E]
                        flex items-center justify-center
                        text-xs
                        font-bold
                    ">
                        {
                            teachers.filter(
                                (teacher) =>
                                    !assignedTeachers.some(
                                        (assigned) =>
                                            assigned.teacherId === teacher.id
                                    )
                            ).length
                        }
                    </div>

                </div>


                <div className="flex flex-col gap-2">

                    {teachers
                        .filter(
                            (teacher) =>
                                !assignedTeachers.some(
                                    (assigned) =>
                                        assigned.teacherId === teacher.id
                                )
                        )
                        .map((teacher) => (

                            <Paper
                                key={teacher.id}
                                withBorder
                                radius="md"
                                p="sm"
                                className="
                                    !border-slate-200
                                    hover:!border-[#d9b7c6]
                                    hover:!bg-[#fffafd]
                                    transition-all
                                    duration-200
                                "
                            >

                                <div className="flex items-center justify-between">

                                    {/* Teacher information */}
                                    <div className="flex items-center gap-3">

                                        <div className="
                                            w-10
                                            h-10
                                            rounded-full
                                            bg-[#faf0f5]
                                            text-[#51021E]
                                            flex
                                            items-center
                                            justify-center
                                            font-bold
                                            text-sm
                                        ">
                                            {teacher.email
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>

                                            <Text
                                                size="sm"
                                                fw={600}
                                                className="text-slate-700"
                                            >
                                                {teacher.email}
                                            </Text>

                                            <Text
                                                size="xs"
                                                className="text-slate-400"
                                            >
                                                Teacher
                                            </Text>

                                        </div>

                                    </div>


                                    {/* Add button */}
                                    <ActionIcon
                                        variant="light"
                                        color="#51021E"
                                        radius="xl"
                                        size="lg"
                                        onClick={() =>
                                            handleAddTeacher(teacher)
                                        }
                                        className="
                                            hover:!bg-[#51021E]
                                            hover:!text-white
                                            transition-all
                                            duration-200
                                        "
                                    >
                                        <IconPlus size={18} />
                                    </ActionIcon>

                                </div>

                            </Paper>

                        ))}

                </div>

            </div>


            {/* ================= ASSIGNED TEACHERS ================= */}

            <div>

                <div className="flex items-center justify-between mb-3">

                    <div>
                        <Text
                            className="font-semibold text-[#51021E]"
                            size="md"
                        >
                            Assigned Teachers
                        </Text>

                        <Text
                            size="xs"
                            className="text-slate-400 mt-0.5"
                        >
                            Teachers currently assigned to this course
                        </Text>
                    </div>


                    <div className="
                        min-w-[28px]
                        h-7
                        px-2
                        rounded-full
                        bg-[#51021E]
                        text-white
                        flex items-center justify-center
                        text-xs
                        font-bold
                    ">
                        {assignedTeachers.length}
                    </div>

                </div>


                {assignedTeachers.length === 0 ? (

                    /* Empty state */
                    <div className="
                        rounded-lg
                        border
                        border-dashed
                        border-slate-300
                        bg-slate-50
                        px-4
                        py-8
                        text-center
                    ">

                        <div className="
                            mx-auto
                            mb-3
                            w-10
                            h-10
                            rounded-full
                            bg-white
                            flex
                            items-center
                            justify-center
                            text-slate-400
                        ">
                            <IconUsers size={20} />
                        </div>

                        <Text
                            size="sm"
                            fw={600}
                            className="text-slate-600"
                        >
                            No teachers assigned
                        </Text>

                        <Text
                            size="xs"
                            className="text-slate-400 mt-1"
                        >
                            Add teachers from the available list above.
                        </Text>

                    </div>

                ) : (

                    <div className="flex flex-col gap-2">

                        {assignedTeachers.map((teacher) => (

                            <Paper
                                key={teacher.teacherId}
                                withBorder
                                radius="md"
                                p="sm"
                                className="
                                    !border-[#ead5df]
                                    !bg-[#fffafd]
                                "
                            >

                                <div className="flex items-center justify-between">

                                    {/* Teacher */}
                                    <div className="flex items-center gap-3">

                                        <div className="
                                            w-10
                                            h-10
                                            rounded-full
                                            bg-[#51021E]
                                            text-white
                                            flex
                                            items-center
                                            justify-center
                                            font-bold
                                            text-sm
                                        ">
                                            {teacher.email
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>

                                            <Text
                                                size="sm"
                                                fw={600}
                                                className="text-slate-700"
                                            >
                                                {teacher.email}
                                            </Text>

                                            <div className="flex items-center gap-1 mt-0.5">

                                                <span className="
                                                    w-1.5
                                                    h-1.5
                                                    rounded-full
                                                    bg-green-500
                                                " />

                                                <Text
                                                    size="xs"
                                                    className="text-slate-400"
                                                >
                                                    Assigned
                                                </Text>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Remove */}
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        radius="xl"
                                        size="lg"
                                        onClick={() =>
                                            confirmRemoveTeacher(teacher)
                                        }
                                        className="
                                            hover:!bg-red-50
                                            transition-all
                                        "
                                    >
                                        <IconX size={18} />
                                    </ActionIcon>

                                </div>

                            </Paper>

                        ))}

                    </div>

                )}

            </div>

        </div>


        {/* ================= FOOTER ================= */}

        <div className="
            pt-4
            mt-4
            border-t
            border-slate-200
        ">

            <Button
                fullWidth
                onClick={handleSaveAssignments}
                className="
                    !bg-[#51021E]
                    !text-white
                    !rounded-lg
                    !h-11
                    !font-semibold
                    hover:!bg-[#6D1535]
                    transition-all
                    duration-200
                "
            >
                Save Assignments
            </Button>

        </div>

    </div>
</Drawer>

          
              <Modal opened={opened} size="lg" onClose={close} title={<div className="text-2xl font-bold text-[#51021e] font-sans">Mark Attendance</div>}>
                   <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
              <form onSubmit={form.onSubmit(handleSubmit)}  className=' grid grid-cols-1 gap-5'>
                 <div className="flex flex-col gap-2">
             <label htmlFor="courseCode"className="text-base font-semibold text-gray-900">
            Course Code <span className="text-red-500">*</span>
            </label>
      <InputText
          id="courseCode"
          value={form.values.courseCode}
  
          onChange={(e) =>
              form.setFieldValue("courseCode", e.target.value)
          }
          placeholder="Enter Course Code"
          
           className="border border-gray-700 rounded-lg shadow-sm focus:border-[#51021e] 
          focus:ring-1 focus:ring-[#51021e] p-1"
      />
      </div>
      <div className="flex flex-col gap-2">
      <label htmlFor="courseName" className="text-base font-semibold text-gray-900">CourseName<span className="text-red-500">*</span></label>
  
      <InputText
          id="courseName"
          value={form.values.courseName}
          onChange={(e) =>
              form.setFieldValue("courseName", e.target.value)
          }
          placeholder="Enter Course Name"
          className="border border-gray-700 rounded-lg shadow-sm focus:border-[#51021e] 
          focus:ring-1 focus:ring-[#51021e] p-1"
      />
      </div>

      <div className="flex flex-col gap-2">
      <label htmlFor="description" className="text-base font-semibold text-gray-900">
      Description <span className="text-red-500">*</span>
      </label>
      <InputText
          id="description"
          value={form.values.description}
          onChange={(e) =>
              form.setFieldValue("description", e.target.value)
          }
          
          placeholder="Enter Description" 
          className="border border-gray-700 rounded-lg shadow-sm focus:border-[#51021e] 
          focus:ring-1 focus:ring-[#51021e] p-1"
      />
      </div>
      <div className="flex flex-col gap-2">
      <label htmlFor="credits" className="text-base font-semibold text-gray-900">
      Credits <span className="text-red-500">*</span>
      </label>
      <InputText
          id="credits"
          value={form.values.credits}
          onChange={(e) =>
              form.setFieldValue("credits", e.target.value)
          }
          
          placeholder="Enter Credits" 
          className="border border-gray-700 rounded-lg shadow-sm focus:border-[#51021e] 
          focus:ring-1 focus:ring-[#51021e] p-1"
      />
      </div>
      
     <Select  {...form.getInputProps("courseType")} withAsterisk label="Course Type "placeholder="Select Course Type" 
     data={[{ value: 'ONLINE', label: 'Online' },{ value: 'OFFLINE', label: 'Offline' }]}/>   
  
    <Select  {...form.getInputProps("status")} withAsterisk label="Status"placeholder="Select Status" data={[{ value: 'ACTIVE', label: 'Active' },{ value: 'INACTIVE', label: 'Inactive' },{ value: 'Archived', label: 'Archived'}]}/>   

    <div className="flex flex-col gap-2">
      <label htmlFor="duration" className="text-base font-semibold text-gray-900">
      Duration <span className="text-red-500">*</span>
      </label>
      <InputText
          id="duration"
          value={form.values.duration}
          onChange={(e) =>
              form.setFieldValue("duration", e.target.value)
          }
          
          placeholder="Enter Duration" 
          className="border border-gray-700 rounded-lg shadow-sm focus:border-[#51021e] 
          focus:ring-1 focus:ring-[#51021e] p-1"
      />
      </div>            
      <Button type='submit' fullWidth className="
          !bg-[#51021e]
          !text-white
          !rounded-lg
          !h-11
          !font-semibold
          !shadow-md
          hover:!bg-[#6b0629]
          transition
      ">Submit</Button>
      </form>
      </Modal>
          <Modal
    opened={removeTeacherOpened}
    onClose={() => setRemoveTeacherOpened(false)}
    title="Remove Teacher"
    centered
>
    <Text size="sm" className="text-slate-600">
        Are you sure you want to remove{" "}
        <strong>{teacherToRemove?.email}</strong>{" "}
        from this course?
    </Text>

    <div className="flex justify-end gap-3 mt-6">

        <Button
            variant="default"
            onClick={() => setRemoveTeacherOpened(false)}
        >
            Cancel
        </Button>

        <Button
            color="red"
            onClick={() => {
                handleRemoveTeacher(teacherToRemove.id);
                setRemoveTeacherOpened(false);
            }}
        >
            Remove Teacher
        </Button>

    </div>
</Modal>
        </>
      );
      
}

export default Course;