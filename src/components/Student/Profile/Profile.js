import React, { useEffect, useState } from "react";

import {
    Button,
    Modal,
    NumberInput,
    Select,
    TextInput,
} from "@mantine/core";

import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useSelector } from "react-redux";

import {
    
    IconCalendar,
    IconCalendarBolt,
    IconEdit,
    IconMail,
    IconMapPin,
    IconPhone,
    IconSchool,
    IconSchoolOff,
    IconUpload,
    IconUserCircle,
    IconUserSearch,
    IconDroplet
} from "@tabler/icons-react";

import {
    getStudent,
    updateStudent,
} from "../../../service/StudentProfileService";

import {
    successNotification,
    errorNotification,
} from "../../../utility/NotificationUtil";

import ProfileAvatar from "./ProfileAvatar";

import bloodGroup from "./BloodGroupData";
import gender from "./Gender";


const Profile = () => {

    // =========================================================
    // REDUX USER
    // =========================================================

    const user = useSelector(
        (state) => state.user
    );

    const profileId = user?.profileId;


    // =========================================================
    // STATE
    // =========================================================

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [editMode, setEditMode] = useState(false);

    const [saving, setSaving] = useState(false);

    const [phone, setPhone] = useState("");

    const [guardianPhone, setGuardianPhone] =
        useState("");

    const [
        opened,
        {
            open,
            close,
        },
    ] = useDisclosure(false);


    // =========================================================
    // FORM
    // =========================================================

    const form = useForm({

        initialValues: {
            rollNo: "",
            semester: "",
            admissionDate: null,
            dob: null,
            gender: "",
            phone: "",
            address: "",
            guardianName: "",
            guardianPhone: "",
            bloodGroup: "",
        },

        validate: {

            rollNo: (value) =>
                !value
                    ? "Roll number is required"
                    : null,

            semester: (value) =>
                !value
                    ? "Semester is required"
                    : null,

            admissionDate: (value) =>
                !value
                    ? "Admission date is required"
                    : null,

            dob: (value) =>
                !value
                    ? "Date of birth is required"
                    : null,

            gender: (value) =>
                !value
                    ? "Gender is required"
                    : null,

            address: (value) =>
                !value
                    ? "Address is required"
                    : null,

            guardianName: (value) =>
                !value
                    ? "Guardian name is required"
                    : null,

            bloodGroup: (value) =>
                !value
                    ? "Blood group is required"
                    : null,
        },
    });


    // =========================================================
    // FETCH PROFILE DATA
    // =========================================================

    const fetchProfile = async () => {

        if (!profileId) {
            setLoading(false);
            return;
        }

        try {

            setLoading(true);

            const data =
                await getStudent(profileId);

            console.log(
                "STUDENT PROFILE DATA:",
                data
            );

            setProfile(data);

            setPhone(
                data?.phone || ""
            );

            setGuardianPhone(
                data?.guardianPhone || ""
            );

        } catch (error) {

            console.error(
                "PROFILE FETCH ERROR:",
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

            errorNotification(
                "Failed to load student profile"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchProfile();

    }, [profileId]);


    // =========================================================
    // OPEN EDIT MODE
    // =========================================================
const handleEdit = () => {

    form.setValues({

        rollNo: profile?.rollNo || "",

        semester: profile?.semester || "",

        admissionDate: profile?.admissionDate
            ? new Date(profile.admissionDate)
            : null,

        dob: profile?.dob
            ? new Date(profile.dob)
            : null,

        gender: profile?.gender || "",

        phone: profile?.phone || "",

        address: profile?.address || "",

        guardianName: profile?.guardianName || "",

        guardianPhone: profile?.guardianPhone || "",

        bloodGroup: profile?.bloodGroup || "",
    });

    setPhone(
        profile?.phone || ""
    );

    setGuardianPhone(
        profile?.guardianPhone || ""
    );

    setEditMode(true);
};


    // =========================================================
    // CANCEL EDIT
    // =========================================================

    const handleCancel = () => {

        form.reset();

        setPhone(
            profile?.phone || ""
        );

        setGuardianPhone(
            profile?.guardianPhone || ""
        );

        setEditMode(false);
    };


    // =========================================================
    // SUBMIT PROFILE UPDATE
    // =========================================================

  const handleSubmit = async () => {

    const validation = form.validate();

    if (validation.hasErrors) {
        return;
    }

    const values = form.getValues();

    const formatDate = (value) => {

        if (!value) {
            return null;
        }

        // Already a Date object
        if (value instanceof Date) {
            return value.toISOString().split("T")[0];
        }

        // Already a string like 2022-07-15
        if (typeof value === "string") {
            return value;
        }

        return null;
    };

    const updatedData = {
        ...profile,
        ...values,

        admissionDate: formatDate(
            values.admissionDate
        ),

        dob: formatDate(
            values.dob
        ),

        phone: phone,

        guardianPhone: guardianPhone,
    };

    try {

        setSaving(true);

        console.log(
            "PROFILE UPDATE DATA:",
            updatedData
        );

        const updatedProfile =
            await updateStudent(
                profileId,
                updatedData
            );

        console.log(
            "UPDATED PROFILE:",
            updatedProfile
        );

        setProfile(updatedProfile);

        setPhone(
            updatedProfile?.phone || ""
        );

        setGuardianPhone(
            updatedProfile?.guardianPhone || ""
        );

        setEditMode(false);

        successNotification(
            "Profile updated successfully"
        );

    } catch (error) {

        console.error(
            "PROFILE UPDATE ERROR:",
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

        errorNotification(
            error.response?.data?.errorMessage ||
            "Profile update failed"
        );

    } finally {

        setSaving(false);
    }
};

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="
                flex
                min-h-[70vh]
                items-center
                justify-center
            ">

                <div className="
                    h-10
                    w-10
                    animate-spin
                    rounded-full
                    border-4
                    border-[#f3c8d6]
                    border-t-[#51021E]
                " />

            </div>
        );
    }


    // =========================================================
    // PROFILE ID NOT AVAILABLE
    // =========================================================

    if (!profileId) {

        return (
            <div className="
                flex
                min-h-[70vh]
                items-center
                justify-center
                p-6
            ">

                <div className="
                    rounded-2xl
                    border
                    border-[#eadde2]
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                ">

                    <h2 className="
                        text-lg
                        font-bold
                        text-[#1D2939]
                    ">
                        Student information not available
                    </h2>

                    <p className="
                        mt-2
                        text-sm
                        text-[#667085]
                    ">
                        Please log in again.
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="
            min-h-screen
            bg-[#faf6f8]
            p-4
            sm:p-5
            md:p-7
        ">

            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div className="
                overflow-hidden
                rounded-2xl
                border
                border-[#eadde2]
                bg-white
                shadow-sm
            ">

                {/* Cover */}

                <div className="
                    h-28
                    bg-gradient-to-r
                    from-[#51021E]
                    via-[#6d1638]
                    to-[#943a60]
                " />


                <div className="
                    px-5
                    pb-6
                    sm:px-7
                ">

                    <div className="
                        -mt-14
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    ">

                        {/* PROFILE IDENTITY */}

                        <div className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-end
                        ">

                            <div className="
                                rounded-full
                                bg-white
                                p-2
                                shadow-lg
                            ">

                                <ProfileAvatar
                                    src={
                                        profile?.profilePicture ||
                                        "/avatar.png"
                                    }
                                    alt="Student profile"
                                />

                            </div>


                            <div className="pb-1">

                                <h1 className="
                                    text-2xl
                                    font-bold
                                    text-[#1D2939]
                                    sm:text-3xl
                                ">
                                    Hello{" "}
                                    {user?.name ||
                                        profile?.name ||
                                        "Student"}
                                    {" "}👋
                                </h1>


                                <div className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-[#667085]
                                ">

                                    <IconMail
                                        size={17}
                                    />

                                    <span>
                                        {user?.email ||
                                            profile?.email ||
                                            "-"}
                                    </span>

                                </div>


                                <div className="
                                    mt-3
                                    flex
                                    flex-wrap
                                    gap-2
                                ">

                                    {user?.role ===
                                        "STUDENT" && (

                                        <span className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            rounded-full
                                            bg-[#fbe7ef]
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-semibold
                                            text-[#9f1239]
                                        ">

                                            <IconSchoolOff
                                                size={14}
                                            />

                                            STUDENT

                                        </span>

                                    )}


                                    <span className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-[#e9f8ef]
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-[#23824b]
                                    ">

                                        <span className="
                                            h-2
                                            w-2
                                            rounded-full
                                            bg-[#35a765]
                                        " />

                                        ACTIVE

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ACTION BUTTONS */}

                        {!editMode ? (

                            <Button
                                onClick={
                                    handleEdit
                                }
                                leftSection={
                                    <IconEdit
                                        size={17}
                                    />
                                }
                                size="md"
                                radius="md"
                                styles={{
                                    root: {
                                        backgroundColor:
                                            "#51021E",
                                    },
                                }}
                            >
                                Edit Profile
                            </Button>

                        ) : (

                            <div className="
                                flex
                                flex-wrap
                                gap-3
                            ">

                                <Button
                                    variant="default"
                                    size="md"
                                    radius="md"
                                    onClick={
                                        handleCancel
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    size="md"
                                    radius="md"
                                    loading={saving}
                                    onClick={
                                        handleSubmit
                                    }
                                    styles={{
                                        root: {
                                            backgroundColor:
                                                "#51021E",
                                        },
                                    }}
                                >
                                    Save Changes
                                </Button>

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="
                mt-6
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-5
            ">

                <SummaryCard
                    icon={
                        <IconSchool
                            size={23}
                        />
                    }
                    title="Roll Number"
                    value={
                        profile?.rollNo ||
                        "-"
                    }
                    color="pink"
                />


                


                <SummaryCard
                    icon={
                        <IconCalendarBolt
                            size={23}
                        />
                    }
                    title="Current Semester"
                    value={
                        profile?.semester ||
                        "-"
                    }
                    color="green"
                />


                <SummaryCard
    icon={<IconCalendar size={23} />}
    title="Admission Date"
    value={profile?.admissionDate || "-"}
    color="blue"
/>

<SummaryCard
    icon={<IconDroplet size={23} />}
    title="Blood Group"
    value={profile?.bloodGroup || "-"}
    color="red"
/>


                <SummaryCard
                    icon={
                        <IconCalendar
                            size={23}
                        />
                    }
                    title="Admission Date"
                    value={
                        profile?.admissionDate ||
                        "-"
                    }
                    color="orange"
                />

            </div>


            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div className="mt-8">

                <div className="mb-4">

                    <h2 className="
                        text-xl
                        font-bold
                        text-[#1D2939]
                    ">
                        Personal Information
                    </h2>

                    <div className="
                        mt-2
                        h-1
                        w-12
                        rounded-full
                        bg-[#51021E]
                    " />

                </div>


                <div className="
                    grid
                    gap-6
                    xl:grid-cols-2
                ">


                    {/* =================================================
                        STUDENT DETAILS
                    ================================================= */}

                    <SectionCard
                        icon={
                            <IconUserCircle
                                size={21}
                            />
                        }
                        title="Student Details"
                    >

                        {!editMode ? (

                            <div className="space-y-0">

                                <InfoRow
                                    label="Roll Number"
                                    value={
                                        profile?.rollNo
                                    }
                                />

                                <InfoRow
                                    label="Semester"
                                    value={
                                        profile?.semester
                                    }
                                />

                                <InfoRow
                                    label="Admission Date"
                                    value={
                                        profile?.admissionDate
                                    }
                                />

                                <InfoRow
                                    label="Date of Birth"
                                    value={
                                        profile?.dob
                                    }
                                />

                                <InfoRow
                                    label="Gender"
                                    value={
                                        profile?.gender
                                    }
                                />

                                <InfoRow
                                    label="Blood Group"
                                    value={
                                        profile?.bloodGroup
                                    }
                                />

                            </div>

                        ) : (

                            <div className="
                                grid
                                gap-4
                                sm:grid-cols-2
                            ">

                                <FormField
                                    label="Roll Number"
                                >

                                    <TextInput
                                        {...form.getInputProps(
                                            "rollNo"
                                        )}
                                        placeholder="STU001"
                                    />

                                </FormField>


                                <FormField
                                    label="Semester"
                                >

                                    <NumberInput
                                        {...form.getInputProps(
                                            "semester"
                                        )}
                                        min={1}
                                        max={20}
                                        placeholder="5"
                                    />

                                </FormField>


                                <FormField
                                    label="Admission Date"
                                >

                                    <DateInput
                                        {...form.getInputProps(
                                            "admissionDate"
                                        )}
                                        placeholder="Select date"
                                    />

                                </FormField>


                                <FormField
                                    label="Date of Birth"
                                >

                                    <DateInput
                                        {...form.getInputProps(
                                            "dob"
                                        )}
                                        placeholder="Select date"
                                    />

                                </FormField>


                                <FormField
                                    label="Gender"
                                >

                                    <Select
                                        {...form.getInputProps(
                                            "gender"
                                        )}
                                        placeholder="Select gender"
                                        data={gender}
                                    />

                                </FormField>


                                <FormField
                                    label="Blood Group"
                                >

                                    <Select
                                        {...form.getInputProps(
                                            "bloodGroup"
                                        )}
                                        placeholder="Select blood group"
                                        data={bloodGroup}
                                    />

                                </FormField>

                            </div>

                        )}

                    </SectionCard>


                    {/* =================================================
                        CONTACT INFORMATION
                    ================================================= */}

                    <SectionCard
                        icon={
                            <IconPhone
                                size={21}
                            />
                        }
                        title="Contact & Guardian Information"
                    >

                        {!editMode ? (

                            <div>

                                <ContactRow
                                    icon={
                                        <IconPhone
                                            size={18}
                                        />
                                    }
                                    label="Phone"
                                    value={
                                        profile?.phone
                                    }
                                    color="pink"
                                />

                                <ContactRow
                                    icon={
                                        <IconMapPin
                                            size={18}
                                        />
                                    }
                                    label="Address"
                                    value={
                                        profile?.address
                                    }
                                    color="blue"
                                />

                                <ContactRow
                                    icon={
                                        <IconUserSearch
                                            size={18}
                                        />
                                    }
                                    label="Guardian Name"
                                    value={
                                        profile?.guardianName
                                    }
                                    color="green"
                                />

                                <ContactRow
                                    icon={
                                        <IconPhone
                                            size={18}
                                        />
                                    }
                                    label="Guardian Phone"
                                    value={
                                        profile?.guardianPhone
                                    }
                                    color="orange"
                                />

                            </div>

                        ) : (

                            <div className="space-y-5">

                                <FormField
                                    label="Phone Number"
                                >

                                    <PhoneInput
                                        country="in"
                                        value={phone}
                                        onChange={
                                            setPhone
                                        }
                                        containerClass="!w-full"
                                        inputClass="
                                            !w-full
                                            !h-[42px]
                                            !rounded-md
                                            !border-[#ced4da]
                                        "
                                    />

                                </FormField>


                                <FormField
                                    label="Address"
                                >

                                    <TextInput
                                        {...form.getInputProps(
                                            "address"
                                        )}
                                        placeholder="Kolkata, West Bengal, India"
                                    />

                                </FormField>


                                <FormField
                                    label="Guardian Name"
                                >

                                    <TextInput
                                        {...form.getInputProps(
                                            "guardianName"
                                        )}
                                        placeholder="Enter guardian name"
                                    />

                                </FormField>


                                <FormField
                                    label="Guardian Phone"
                                >

                                    <PhoneInput
                                        country="in"
                                        value={
                                            guardianPhone
                                        }
                                        onChange={
                                            setGuardianPhone
                                        }
                                        containerClass="!w-full"
                                        inputClass="
                                            !w-full
                                            !h-[42px]
                                            !rounded-md
                                            !border-[#ced4da]
                                        "
                                    />

                                </FormField>

                            </div>

                        )}

                    </SectionCard>

                </div>

            </div>


            {/* =================================================
                PROFILE PICTURE MODAL
            ================================================= */}

            <Modal
                opened={opened}
                onClose={close}
                centered
                radius="lg"
                title={
                    <span className="
                        text-lg
                        font-bold
                        text-[#1D2939]
                    ">
                        Upload Profile Picture
                    </span>
                }
            >

                <div className="
                    rounded-xl
                    border
                    border-dashed
                    border-[#d9b5c2]
                    bg-[#fffafb]
                    p-8
                    text-center
                ">

                    <div className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-[#faf0f5]
                    ">

                        <IconUpload
                            size={25}
                            className="text-[#51021E]"
                        />

                    </div>


                    <p className="
                        mt-4
                        text-sm
                        font-semibold
                        text-[#344054]
                    ">
                        Upload profile picture
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-[#98A2B3]
                    ">
                        Your existing upload functionality can
                        be connected here.
                    </p>

                </div>

            </Modal>

        </div>
    );
};


// =============================================================
// SUMMARY CARD
// =============================================================

const SummaryCard = ({
    icon,
    title,
    value,
    color,
}) => {

    const colors = {

        pink: {
            wrapper:
                "border-[#eadde2] bg-[#fff8fa]",
            icon:
                "bg-[#fae7ee] text-[#51021E]",
        },

        blue: {
            wrapper:
                "border-[#dce9f5] bg-[#f8fbff]",
            icon:
                "bg-[#eaf4ff] text-[#3b82c4]",
        },

        green: {
            wrapper:
                "border-[#d8eadf] bg-[#f8fcf9]",
            icon:
                "bg-[#e8f7ed] text-[#287d48]",
        },

        purple: {
            wrapper:
                "border-[#e5dbf3] bg-[#fbf9ff]",
            icon:
                "bg-[#f1eafe] text-[#8752c7]",
        },

        orange: {
            wrapper:
                "border-[#efdfc9] bg-[#fffaf3]",
            icon:
                "bg-[#fff0d9] text-[#a96b12]",
        },
    };


    const selected =
        colors[color] ||
        colors.pink;


    return (
        <div className={`
            rounded-2xl
            border
            p-4
            shadow-sm
            ${selected.wrapper}
        `}>

            <div className="flex items-center gap-3">

                <div className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${selected.icon}
                `}>
                    {icon}
                </div>


                <div className="min-w-0">

                    <p className="
                        text-xs
                        text-[#667085]
                    ">
                        {title}
                    </p>

                    <p className="
                        mt-1
                        truncate
                        text-base
                        font-bold
                        text-[#1D2939]
                    ">
                        {value || "-"}
                    </p>

                </div>

            </div>

        </div>
    );
};


// =============================================================
// SECTION CARD
// =============================================================

const SectionCard = ({
    icon,
    title,
    children,
}) => {

    return (
        <div className="
            overflow-hidden
            rounded-2xl
            border
            border-[#eadde2]
            bg-white
            shadow-sm
        ">

            <div className="
                flex
                items-center
                gap-3
                border-b
                border-[#f1e6ea]
                px-6
                py-5
            ">

                <div className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#faf0f5]
                    text-[#51021E]
                ">
                    {icon}
                </div>


                <h2 className="
                    text-lg
                    font-bold
                    text-[#1D2939]
                ">
                    {title}
                </h2>

            </div>


            <div className="p-6">

                {children}

            </div>

        </div>
    );
};


// =============================================================
// FORM FIELD
// =============================================================

const FormField = ({
    label,
    children,
}) => {

    return (
        <div>

            <label className="
                mb-1.5
                block
                text-sm
                font-medium
                text-[#344054]
            ">
                {label}
            </label>

            {children}

        </div>
    );
};


// =============================================================
// INFO ROW
// =============================================================

const InfoRow = ({
    label,
    value,
}) => {

    return (
        <div className="
            flex
            flex-col
            gap-1
            border-b
            border-[#f1e6ea]
            py-4
            last:border-none
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:gap-5
        ">

            <span className="
                text-sm
                text-[#667085]
            ">
                {label}
            </span>


            <span className="
                break-words
                text-sm
                font-semibold
                text-[#344054]
                sm:text-right
            ">
                {value || "-"}
            </span>

        </div>
    );
};


// =============================================================
// CONTACT ROW
// =============================================================

const ContactRow = ({
    icon,
    label,
    value,
    color,
}) => {

    const colors = {

        pink:
            "bg-[#fae7ee] text-[#51021E]",

        blue:
            "bg-[#eaf4ff] text-[#3b82c4]",

        green:
            "bg-[#e8f7ed] text-[#287d48]",

        orange:
            "bg-[#fff0d9] text-[#a96b12]",
    };


    return (
        <div className="
            flex
            items-start
            gap-4
            border-b
            border-[#f1e6ea]
            py-4
            last:border-none
        ">

            <div className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                ${colors[color] || colors.pink}
            `}>
                {icon}
            </div>


            <div className="min-w-0">

                <p className="
                    text-xs
                    text-[#667085]
                ">
                    {label}
                </p>

                <p className="
                    mt-1
                    break-words
                    text-sm
                    font-semibold
                    text-[#344054]
                ">
                    {value || "-"}
                </p>

            </div>

        </div>
    );
};


export default Profile;