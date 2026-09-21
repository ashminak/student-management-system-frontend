import React, { useState,editMode,setEdit,useEffect } from 'react'
import { Avatar, Button, Divider,Table,Text, TextInput } from '@mantine/core'
import { useSelector } from 'react-redux'
import { IconEdit } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { NumberInput } from '@mantine/core';
import { Select } from '@mantine/core';
import { TagsInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Modal} from '@mantine/core';
import { getTeacher} from '../../../service/TeacherProfileService';

const Profile = () => {
  const user =useSelector((state)=>state.user);
  const [editMode, setEdit] = useState(false);
  const [profile,setProfile]=useState({});
  const Profile = () => {
    const user =useSelector((state)=>state.user);
    const [editMode, setEdit] = useState(false);
    const[profile,setProfile]=useState({});
    console.log(user);
    useEffect(()=>{
      getTeacher(user.profileId).then((data)=>{
        setProfile(data.map((teacher)=>({
          value: ""+teacher.id,
          label: teacher.email

        })));
      }).catch((error)=>{
        console.log(error);
      });
    }, []);

} 
  console.log(user);

      const teacher = {
        employeeCode: "EMP001",
        name: "Nia",
        email: "nia@gmail.com",
        designation: "PROFESSOR",
        qualification: "MCA",
        experienceYears: 5,
        joiningDate: "2022-06-12",
        salary: 45000,
        phone: "9876543210",
        address: "Kolkata, West Bengal, India",
        gender: "FEMALE",
        profilePicture: "avatar.png"
    };

const [phone, setPhone] = useState(teacher.phone || '');
const [opened, { open, close }] = useDisclosure(false);
return (
    <div className="min-h-screen bg-[#fafafa] p-6 md:p-8">

        {/* Profile Header */}
        <div className="rounded-2xl border border-[#eadde2] bg-white shadow-sm">

            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">

                {/* Left Side */}
                <div className="flex items-center gap-5">

                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                        <Avatar
                            src="/avatar.png"
                            variant="filled"
                            size={130}
                            radius="xl"
                            alt="Profile"
                        />

                        {editMode && (
                            <Button
                                variant="light"
                                color="pink"
                                size="sm"
                                onClick={open}
                                className="!border !border-[#eadde2] !text-[#51021E]"
                            >
                                Upload
                            </Button>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-[#344054] md:text-3xl">
                            {user.name}
                        </h1>

                        <p className="text-sm text-[#667085] md:text-base">
                            {user.email}
                        </p>

                        <span className="mt-2 inline-flex w-fit rounded-full bg-[#faf0f5] px-3 py-1 text-xs font-semibold text-[#51021E]">
                            TEACHER
                        </span>
                    </div>

                </div>

                {/* Action Button */}
                <div>
                    {!editMode ? (
                        <Button
                            variant="filled"
                            size="md"
                            onClick={() => setEdit(true)}
                            leftSection={<IconEdit size={18} />}
                            className="!bg-[#51021E] hover:!bg-[#6D1535]"
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <Button
                            variant="filled"
                            size="md"
                            onClick={() => setEdit(false)}
                            className="!bg-[#51021E] hover:!bg-[#6D1535]"
                        >
                            Save Changes
                        </Button>
                    )}
                </div>

            </div>

        </div>


        {/* Personal Information */}
        <div className="mt-8">

            <div className="mb-4">
                <h2 className="text-2xl font-bold text-[#344054]">
                    Personal Information
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                    View and manage your professional information
                </p>
            </div>


            {/* Teacher Details Card */}
            <div className="overflow-hidden rounded-2xl border border-[#eadde2] bg-white shadow-sm">

                {/* Card Header */}
                <div className="border-b border-[#eadde2] px-6 py-5 md:px-7">

                    <h3 className="text-lg font-bold text-[#344054]">
                        Teacher Details
                    </h3>

                    <p className="mt-1 text-sm text-[#667085]">
                        Your professional and contact information
                    </p>

                </div>


                {/* Table */}
                <div className="overflow-x-auto">

                    <Table
                        striped={false}
                        highlightOnHover
                        withTableBorder={false}
                        withColumnBorders={false}
                        className="w-full"
                        style={{
                            minWidth: "700px"
                        }}
                    >

                        <Table.Tbody>

                            {/* Employee Code */}
                            <Table.Tr className="border-b border-[#f0e6ea]">

                                <Table.Th className="w-[35%] bg-[#faf0f5] px-6 py-4 text-left text-sm font-semibold text-[#344054]">
                                    Employee Code
                                </Table.Th>

                                <Table.Td className="px-6 py-4 text-sm text-[#475467]">
                                    {editMode ? (
                                        <TextInput
                                            placeholder="e.g. EMP001"
                                            label="Employee Code"
                                            description="Enter your employee code"
                                            withAsterisk
                                        />
                                    ) : (
                                        teacher.employeeCode
                                    )}
                                </Table.Td>

                            </Table.Tr>


                            {/* Email */}
                            <Table.Tr className="border-b border-[#f0e6ea]">

                                <Table.Th className="bg-[#faf0f5] px-6 py-4 text-left text-sm font-semibold text-[#344054]">
                                    Email
                                </Table.Th>

                                <Table.Td className="px-6 py-4 text-sm text-[#475467]">
                                    {editMode ? (
                                        <TextInput
                                            placeholder="e.g. nia@gmail.com"
                                            label="Email"
                                            description="Enter your official email address"
                                            withAsterisk
                                        />
                                    ) : (
                                        teacher.email
                                    )}
                                </Table.Td>

                            </Table.Tr>


                            {/* Designation */}
                            <Table.Tr className="border-b border-[#f0e6ea]">

                                <Table.Th className="bg-[#faf0f5] px-6 py-4 text-left text-sm font-semibold text-[#344054]">
                                    Designation
                                </Table.Th>

                                <Table.Td className="px-6 py-4 text-sm text-[#475467]">
                                    {editMode ? (
                                        <TextInput
                                            placeholder="e.g. Professor"
                                            label="Designation"
                                            description="Enter your current designation"
                                            withAsterisk
                                        />
                                    ) : (
                                        teacher.designation
                                    )}
                                </Table.Td>

                            </Table.Tr>


                            {/* Qualification */}
                            <Table.Tr className="border-b border-[#f0e6ea]">

                                <Table.Th className="bg-[#faf0f5] px-6 py-4 text-left text-sm font-semibold text-[#344054]">
                                    Qualification
                                </Table.Th>

                                <Table.Td className="px-6 py-4 text-sm text-[#475467]">
                                    {editMode ? (
                                        <TagsInput
                                            label="Qualification"
                                            description="Enter your highest qualification"
                                            placeholder="e.g. MCA"
                                            withAsterisk
                                        />
                                    ) : (
                                        teacher.qualification
                                    )}
                                </Table.Td>

                            </Table.Tr>


                            {/* Experience */}
                            <Table.Tr className="border-b border-[#f0e6ea]">

                                <Table.Th className="bg-[#faf0f5] px-6 py-4 text-left text-sm font-semibold text-[#344054]">
                                    Experience
                                </Table.Th>

                                <Table.Td className="px-6 py-4 text-sm text-[#475467]">
                                    {editMode ? (
                                        <NumberInput
                                            label="Experience"
                                            description="Enter total years of experience"
                                            min={0}
                                            clampBehavior="strict"
                                            placeholder="e.g. 5"
                                            withAsterisk
                                        />
                                    ) : (
                                        `${teacher.experienceYears} Years`
                                    )}
                                </Table.Td>

                            </Table.Tr>


                            {/* Joining Date */}
                            <Table.Tr className="border-b border-[#f0e6ea]">

                                <Table.Th className="bg-[#faf0f5] px-6 py-4 text-left text-sm font-semibold text-[#344054]">
                                    Joining Date
                                </Table.Th>

                                <Table.Td className="px-6 py-4 text-sm text-[#475467]">
                                    {editMode ? (
                                        <DateInput
                                            label="Joining Date"
                                            description="Select your joining date"
                                            placeholder="YYYY-MM-DD"
                                            withAsterisk
                                        />
                                    ) : (
                                        teacher.joiningDate
                                    )}
                                </Table.Td>

                            </Table.Tr>


                            {/* Salary */}
                            <Table.Tr className="border-b border-[#f0e6ea]">

                                <Table.Th className="bg-[#faf0f5] px-6 py-4 text-left text-sm font-semibold text-[#344054]">
                                    Salary
                                </Table.Th>

                                <Table.Td className="px-6 py-4 text-sm font-medium text-[#344054]">
                                    {editMode ? (
                                        <NumberInput
                                            label="Salary"
                                            description="Enter your monthly salary"
                                            placeholder="e.g. 45000"
                                            withAsterisk
                                        />
                                    ) : (
                                        `₹${teacher.salary}`
                                    )}
                                </Table.Td>

                            </Table.Tr>


                            {/* Phone */}
                            <Table.Tr className="border-b border-[#f0e6ea]">

                                <Table.Th className="bg-[#faf0f5] px-6 py-4 text-left text-sm font-semibold text-[#344054]">
                                    Phone
                                </Table.Th>

                                <Table.Td className="px-6 py-4 text-sm text-[#475467]">
                                    {editMode ? (
                                        <PhoneInput
                                            country="in"
                                            value={phone}
                                            onChange={(phone) => setPhone(phone)}
                                        />
                                    ) : (
                                        teacher.phone
                                    )}
                                </Table.Td>

                            </Table.Tr>


                            {/* Address */}
                            <Table.Tr className="border-b border-[#f0e6ea]">

                                <Table.Th className="bg-[#faf0f5] px-6 py-4 text-left text-sm font-semibold text-[#344054]">
                                    Address
                                </Table.Th>

                                <Table.Td className="px-6 py-4 text-sm text-[#475467]">
                                    {editMode ? (
                                        <TextInput
                                            label="Address"
                                            description="Enter your complete address"
                                            placeholder="e.g. Kolkata, West Bengal, India"
                                            withAsterisk
                                        />
                                    ) : (
                                        teacher.address
                                    )}
                                </Table.Td>

                            </Table.Tr>


                            {/* Gender */}
                            <Table.Tr>

                                <Table.Th className="bg-[#faf0f5] px-6 py-4 text-left text-sm font-semibold text-[#344054]">
                                    Gender
                                </Table.Th>

                                <Table.Td className="px-6 py-4 text-sm text-[#475467]">
                                    {editMode ? (
                                        <Select
                                            label="Gender"
                                            placeholder="Select Gender"
                                            data={[
                                                "Female",
                                                "Male",
                                                "Other"
                                            ]}
                                        />
                                    ) : (
                                        teacher.gender
                                    )}
                                </Table.Td>

                            </Table.Tr>

                        </Table.Tbody>

                    </Table>

                </div>

            </div>

        </div>


        {/* Upload Modal */}
        <Modal
            centered
            opened={opened}
            onClose={close}
            title={
                <span className="text-lg font-semibold text-[#344054]">
                    Upload Profile Picture
                </span>
            }
            radius="lg"
        >
            {/* Modal content */}
        </Modal>

    </div>
);
}

export default Profile