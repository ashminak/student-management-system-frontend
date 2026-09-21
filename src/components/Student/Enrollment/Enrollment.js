import React, { useEffect, useState } from 'react'
import { getAllCourses } from '../../../service/CourseService';
import { requestEnrollment } from '../../../service/EnrollmentService';
import  Card  from './Card';
import { Button, Select, TextInput } from '@mantine/core';
import {IconSearch } from '@tabler/icons-react';
import { useSelector } from "react-redux";
import { errorNotification, successNotification } from '../../../utility/NotificationUtil';

const Enrollment = () => {

    const[courses,setCourses]=useState([]);
    const[searchCourse,setSearchCourse]=useState("");
    const[searchCourseType,setSearchCourseType]=useState("");
   
    const profileId = useSelector((state) => state.user.profileId);

    useEffect(()=>{
        fetchData();
    },[]);

    const fetchData =()=>{
        getAllCourses()
        .then((data)=>{
            console.log("All Courses",data);
            setCourses(data);
        }).catch((error)=>{
              console.error("GET COURSES ERROR:", error);
              console.error("STATUS:", error.response?.status);
              console.error("URL:", error.config?.url);
              console.error("RESPONSE:", error.response?.data);
        });
    }

    const filteredCourses = courses.filter((course) =>
        course.courseName.toLowerCase().includes(searchCourse.toLowerCase())
        && (searchCourseType === "" || course.courseType === searchCourseType)

    );

    const handleRequestEnrollment = (course) => {
       const enrollmentData = {
        profileId: profileId,
        courseId: course.id,
       }
       console.log("Enrollment Data:", enrollmentData);
       requestEnrollment(enrollmentData)
       .then((response)=>{
        console.log("Enrollment Request Successful:", response);
        successNotification("Enrollment Request Successful");
       }).catch((error)=>{
        console.error("Enrollment Request Error:", error);
        errorNotification("Enrollment Request Failed");
       });
    }

  return (
    <div className="flex flex-col">
        <div className="mb-3 pt-2 pl-4">
             <h1 className="text-3xl font-bold text-[#51021E] tracking-tight">
                     Student Enrollment
             </h1>
             <p className="mt-1 text-sm text-slate-500">
              Browse and request enrollment for available courses
            </p>
        </div>
        <div className="flex gap-10 justify-between mt-1">
            <TextInput placeholder="Search courses..." leftSection={<IconSearch size={16} />} className='w-[400px] ml-14'
             value={searchCourse} onChange={(e) => setSearchCourse(e.target.value)}/>
            <div className='flex  items-center gap-2 mr-10'>
            <Select placeHolder="Select Course Type" data={["ONLINE", "OFFLINE"]} styles={{
        input: {
            backgroundColor: "#51021E",
            color: "white",
            borderColor: "#51021E",

            "&::placeholder": {
                color: "white",
            },
        },
        section: {
            color: "white",
        },
    }}       className='w-[220px]' value={searchCourseType} onChange={(value) => setSearchCourseType(value||"")} clearable/>
             
             </div>
       </div>

        <div className="flex justify-center flex-wrap gap-4 m-4 max-w-[1400px] mx-auto">
            {
            filteredCourses.map((course,index)=>{
                return<Card key ={course.id} {...course} index={index} onClick={handleRequestEnrollment}/>
            })
            }
        </div>
        
            
    </div>
  )
}

export default Enrollment