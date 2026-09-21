
import React, { useState, useEffect, lazy } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Modal,Button, Select,LoadingOverlay, ActionIcon,Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { TextInput } from '@mantine/core';
 import { IconSearch,IconPlus, IconEdit,IconTrash ,IconArrowLeft} from '@tabler/icons-react';
import { getTeacherDropdowns } from '../../../service/TeacherProfileService';
import { Textarea,SegmentedControl  } from '@mantine/core';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Toolbar } from 'primereact/toolbar';

import {
    addAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceDetails,
    getAllAttendanceByTeacherId,
    getStudentByName,
    getCourseByName
} from '../../../service/AttendanceService';
import { data } from 'react-router-dom';
import { errorNotification, successNotification } from '../../../utility/NotificationUtil';
import { formateDate } from '../../../utility/DateUtility';
import { modals } from '@mantine/modals';
import { useSelector } from "react-redux";

import { useNavigate } from 'react-router-dom';

const Attendance=()=> {
        const navigate = useNavigate();
    
const userDetails = useSelector((state) => state.user);

console.log("FULL USER DETAILS:", userDetails);
console.log("USER ID:", userDetails?.id);
console.log("PROFILE ID:", userDetails?.profileId);
console.log("ALL KEYS:", Object.keys(userDetails || {}));
    const [loading,setLoading]=useState(false);
    const [tab,setTab]=useState('Today');
    const [opened, { open, close }] = useDisclosure(false); 
 
    const [attendance,setAttendance]=useState([]);
  
   const [filters, setFilters] = useState({
    global: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS
    },

    studentName: {
        operator: FilterOperator.AND,
        constraints: [
            {
                value: null,
                matchMode: FilterMatchMode.STARTS_WITH
            }
        ]
    },

    teacherEmail: {
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
                matchMode: FilterMatchMode.STARTS_WITH
            }
        ]
    },

    attendanceDate: {
        operator: FilterOperator.AND,
        constraints: [
            {
                value: null,
                matchMode: FilterMatchMode.DATE_IS
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

    remarks: {
        operator: FilterOperator.AND,
        constraints: [
            {
                value: null,
                matchMode: FilterMatchMode.CONTAINS
            }
        ]
    }
});
    const [globalFilterValue, setGlobalFilterValue] = useState('');
 
    const [statuses] = useState(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']);

    const getStatus = (status) => {
        switch (status) {
            case 'PRESENT':
                return 'success';

            case 'ABSENT':
                return 'danger';

            case 'LATE':
                return 'warning';

            case 'EXCUSED':
                return 'info';
            default :
            return null;    

            
        }
    };
 const fetchData = () =>{
        getAllAttendanceByTeacherId(userDetails.profileId)
        .then((data) => {
            console.log("ALL ATTENDANCE:", data);
            setAttendance(data);
        })
        .catch((error) => {
            console.error("GET ATTENDANCE ERROR:", error);
            console.error("STATUS:", error.response?.status);
            console.error("URL:", error.config?.url);
            console.error("RESPONSE:", error.response?.data);
        });
 }
 useEffect(() => {

    if (!userDetails?.profileId) {
        return;
    }

    fetchData();

}, [userDetails?.profileId]);

   




    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters }; 

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
    studentName: '',
    courseName: '',
    attendanceDate: new Date(),
    status: '',
    remarks: ''
    },

    validate: {
    studentName: (value) =>
        !value ? "Student Name is Required" : undefined,

    courseName: (value) =>
        !value ? "Course Name is Required" : undefined,

    attendanceDate: (value) =>
        !value ? "Attendance Date is Required" : undefined,

    status: (value) =>
        !value ? "Status is Required" : undefined,

    remarks: (value) =>
        !value ? "Reason for remarks is Required" : undefined,
    },
    });

    const renderHeader = () => {
        return (
            
            <div className='flex flex-col gap-7 '>
               
                            
          
            <div className="flex flex-wrap gap-2 justify-between items-center">
               <Button leftSection={<IconPlus/>} variant="filled" onClick={open}  className="!bg-[#51021e] !text-white font-serif" >Add Attendance</Button>
                    <TextInput leftSection={<IconSearch stroke={2}/>} fa={500} val teue={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
              
            </div>  </div>
        );
    };

  

    const timeTemplate =(rowData)=>{
        return<span className='text-ted-400'>{formateDate(rowData.attendanceDate)}</span>
    }

   

;



    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getStatus(rowData.status)} />;
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
                Are you sure you want to delete this attendance record?
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
            deleteAttendance(rowData.id)
                .then(() => {

                    successNotification(
                        "Attendance Deleted Successfully"
                    );

                    // setAttendance(
                    //     attendance.filter(
                    //         (attendance) => attendance.id !== rowData.id
                    //     )
                    // );
                     setAttendance(prev =>
            prev.filter(attendance => attendance.id !== rowData.id)
        );

                })
                .catch((error) => {

                    errorNotification(
                        error.response?.data?.errorMessage ||
                        "Failed to delete Attendance"
                    );

                });
        }
    });
};


 const actionBodyTemplate = (rowData) => {
    return (
        <div>
            <ActionIcon color="red" onClick={() => handleDelete(rowData)}>
                <IconTrash size={20} stroke={1.5} />
            </ActionIcon>
        </div>
    );
};


    const header = renderHeader();

   const handleSubmit = async (values) => {
    try {
        console.log("========== 1. SUBMIT START ==========");
        console.log("FORM VALUES:", values);

        const student = await getStudentByName(values.studentName);

        console.log("========== 2. STUDENT FOUND ==========");
        console.log(student);

        const course = await getCourseByName(values.courseName);

        console.log("========== 3. COURSE FOUND ==========");
        console.log(course);

        const teacherId = userDetails.profileId;

        console.log("========== 4. TEACHER ID ==========");
        console.log(teacherId);

        const attendanceDTO = {
            studentId: student.id,
            teacherId: teacherId,
            courseId: course.id,
            attendanceDate: values.attendanceDate,
             
            status: values.status,
            remarks: values.remarks
        };

        console.log("========== 5. FINAL DTO ==========");
        console.log(attendanceDTO);

        const response = await addAttendance(attendanceDTO);

        console.log("========== 6. ATTENDANCE POST SUCCESS ==========");
        console.log(response);

        successNotification("Attendance Added Successfully");

        form.reset();
        close();
        fetchData();
    } catch (error) {

        console.error("========== ATTENDANCE ERROR ==========");
        console.error(error);

        console.error("STATUS:", error.response?.status);
        console.error("URL:", error.config?.url);
        console.error("RESPONSE:", error.response?.data);

        errorNotification(
            error.response?.data?.message ||
            error.response?.data?.errorMessage ||
            error.message ||
            "Failed to add attendance"
        );
    }
};

      const leftToolbarTemplate = () =>{
       return <div> <Button leftSection={<IconPlus/>} variant="filled" onClick={open} 
        className="!bg-[#51021e] !text-white  font-serif" >Add Attendance</Button>

      </div>

}
const rightToolbarTemplate = () => {
        return  <TextInput leftSection={<IconSearch stroke={2}/>} fa={500} val teue={globalFilterValue} onChange={onGlobalFilterChange} 
        placeholder="Keyword Search" />
;
    };

       const centerToolbarTemplate = () =>{
          return  <SegmentedControl
    value={tab}
    onChange={setTab}
    data={[
        "Today",
        "Past"
    ]}
    color="#51021E"
    bg="#F3E8ED"
    radius="md"
    className="border border-[#E8D5DD]"
/>
       }
      

const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const filteredAttendance = attendance.filter((item) => {

    const todayDate = getTodayDate();

    if (tab === "Today") {
        return item.attendanceDate === todayDate;
    }

    if (tab === "Past") {
        return item.attendanceDate < todayDate;
    }

    return true;
});
     return (
        <>
        <button
    onClick={() => navigate('/teacher/courses')}
    className="mb-5 mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#51021E] hover:text-[#6D1535]"
>
    <IconArrowLeft size={18} stroke={2} />
    Back to My Courses
</button>
        <div className="card shadow-[0_0_15px_rgba(0,0,0,0.2)] ml-7 mr-7 overflow-x-auto">
             <div>  <div className="text-3xl font-sans text-bold m-2 text-[#51021e]">Teacher Attendance</div>
                        <div className='m-2 text-base font-sans font-normal text-slate-500  '>Track and Manage student attendance</div>
</div>
            <Toolbar className="mb-4" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
            <DataTable value={filteredAttendance} paginator  rows={10} className="
        [&_.p-datatable-thead>tr>th]:bg-[#faf0f5]
        [&_.p-datatable-thead>tr>th]:text-[#344054]
    "
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                    filters={filters} filterDisplay="menu" globalFilterFields={['studentName','teacherEmail', 'courseName', 'attendanceDate', 'status', 'remarks']}
                    emptyMessage="No attendance found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
        
                <Column
    field="studentName"
    header="Student"
    sortable
    filter
    filterPlaceholder="Search by Student name"
    style={{ minWidth: '10rem' }}
/>

<Column
    field="teacherEmail"
    header="Teacher"
    sortable
    filter
    filterPlaceholder="Search by Teacher"
    style={{ minWidth: '10rem' }}
/>

<Column
    field="courseName"
    header="Course"
    sortable
    filter
    filterPlaceholder="Search by Course"
    style={{ minWidth: '10rem' }}
/>

<Column
    field="attendanceDate"
    header="Attendance Date"
    sortable
    filter
    filterPlaceholder="Search by Date"
    style={{ minWidth: '10rem' }}
    body={(rowData) => timeTemplate(rowData)}
/>

<Column
    field="status"
    header="Status"
    sortable
    filter
    style={{ minWidth: '10rem' }}
    body={statusBodyTemplate}
/>

<Column
    field="remarks"
    header="Remarks"
    filter
    filterPlaceholder="Search remarks"
    style={{ minWidth: '10rem' }}
/>
              
                <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} 
                body={actionBodyTemplate} />
            </DataTable>
        </div>
            <Modal opened={opened} size="lg" onClose={close} title={<div className="text-2xl font-bold text-[#51021e] font-sans">Mark Attendance</div>}>
                 <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <form onSubmit={form.onSubmit(handleSubmit)}  className=' grid grid-cols-1 gap-5'>
               <div className="flex flex-col gap-2">
  <label htmlFor="studentName"className="text-base font-semibold text-gray-900">
    Student Name <span className="text-red-500">*</span>
</label>
    <InputText
        id="studentName"
        value={form.values.studentName}

        onChange={(e) =>
            form.setFieldValue("studentName", e.target.value)
        }
        placeholder="Enter Student Name"
        
         className="border border-gray-700 rounded-lg shadow-sm focus:border-[#51021e] 
        focus:ring-1 focus:ring-[#51021e] p-1"
    />
</div>
               <div className="flex flex-col gap-2">
    <label htmlFor="teacherEmail" className="text-base font-semibold text-gray-900">Teacher</label>

    <InputText
        id="teacherEmail"
        value={userDetails?.email || ''}
        readOnly className="border border-gray-700 rounded-lg shadow-sm focus:border-[#51021e] 
        focus:ring-1 focus:ring-[#51021e] p-1"
    />
</div>
              <div className="flex flex-col gap-2">
    <label htmlFor="courseName" className="text-base font-semibold text-gray-900">
    Course Name <span className="text-red-500">*</span>
</label>
    <InputText
        id="courseName"
        value={form.values.courseName}
        onChange={(e) =>
            form.setFieldValue("courseName", e.target.value)
        }
        
        placeholder="Enter Course Name" 
        withAsterisk
        className="border border-gray-700 rounded-lg shadow-sm focus:border-[#51021e] 
        focus:ring-1 focus:ring-[#51021e] p-1"
    />
</div>
      
                <DatePickerInput  {...form.getInputProps("attendanceDate")}  label="Attendance Date" placeholder='Pick date and time '/>
               <Select  {...form.getInputProps("status")} withAsterisk label="Status"placeholder="Select Status" data={[{ value: 'PRESENT', label: 'Present' },{ value: 'ABSENT', label: 'Absent' },{ value: 'LATE', label: 'Late'},{ value: 'EXCUSED', label: 'Excused'}]}/>   
 
                <Textarea  {...form.getInputProps("remarks")} label="Remarks" placeholder="Enter Remarks"/>
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
      </>
    );

}
        
export default Attendance;