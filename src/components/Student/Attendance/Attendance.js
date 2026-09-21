import React, { useState, useEffect, lazy } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Modal,Button, Select,LoadingOverlay, ActionIcon,Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { TextInput } from '@mantine/core';
 import { IconSearch,IconPlus, IconEdit,IconTrash } from '@tabler/icons-react';
import { getTeacherDropdowns } from '../../../service/TeacherProfileService';
import { Textarea,SegmentedControl  } from '@mantine/core';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { errorNotification, successNotification } from '../../../utility/NotificationUtil';
import { formateDate } from '../../../utility/DateUtility';
import { modals } from '@mantine/modals';
import { useSelector } from "react-redux";
import { Toolbar } from 'primereact/toolbar';
import {
    addAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceDetails,
    getAllAttendancesByStudentId,
    getStudentByName,
    getCourseByName
} from '../../../service/AttendanceService';

const Attendance=()=> {
    const userDetails = useSelector((state) => state.user);
    const [attendance,setAttendance]=useState([]);
    const [tab,setTab]=useState('Today');
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
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters }; 

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const fetchData = () =>{
        getAllAttendancesByStudentId(userDetails.profileId)
        .then((data) => {
            console.log("All Attendances",data);
            setAttendance(data);
        }).catch((error) => {
              console.error("GET ATTENDANCE ERROR:", error);
              console.error("STATUS:", error.response?.status);
              console.error("URL:", error.config?.url);
              console.error("RESPONSE:", error.response?.data);
        });
    }

    useEffect(() => {
        if(!userDetails?.profileId){
            return;
        }
        fetchData();
    },[userDetails?.profileId]);


    const timeTemplate =(rowData)=>{
    return<span className='text-ted-400'>{formateDate(rowData.attendanceDate)}</span>
    };
    
    
    
    const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getStatus(rowData.status)} />;
    };
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


    const leftToolbarTemplate = () =>{
    return <SegmentedControl
            value={tab}
            onChange={setTab}
            data={[
                "Today",
                "Past"
            ]}
            color="#51021E"
            bg="#F3E8ED"
            radius="md"
            className="border border-[#E8D5DD]"/>
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
    const rightToolbarTemplate = () => {
            return  <TextInput leftSection={<IconSearch stroke={2}/>} fa={500} val teue={globalFilterValue} onChange={onGlobalFilterChange} 
            placeholder="Keyword Search" />
    
    };
    

    return (
        <div className="card">
            <div className="card shadow-[0_0_15px_rgba(0,0,0,0.2)] ml-7 mr-7 overflow-x-auto">
                 <div>  
                    <div className="text-4xl font-sans text-bold m-2 text-[#51021e]">{userDetails.name}</div>
                    <div className='m-2 text-base font-sans font-normal text-slate-500  '>View your attendance records</div>
                </div>
                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                    <DataTable value={filteredAttendance} paginator  rows={10} className="
                    [&_.p-datatable-thead>tr>th]:bg-[#faf0f5]
                    [&_.p-datatable-thead>tr>th]:text-[#344054]"
                
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                    filters={filters} filterDisplay="menu" globalFilterFields={['studentName','teacherEmail', 'courseName', 'attendanceDate', 'status', 'remarks']}
                    emptyMessage="No attendance found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
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
                field="courseName"
                header="Course"
                sortable
                filter
                filterPlaceholder="Search by Course"
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
                          
            <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
        </DataTable>
        </div>
        </div>
    );
}
        
export default Attendance;