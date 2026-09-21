import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../service/UserService';
import { successNotification, errorNotification } from '../utility/NotificationUtil';
import { PasswordInput } from '@mantine/core';
import { TextInput } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { SegmentedControl } from '@mantine/core';

const RegisterPage = () => {
  const navigate=useNavigate();
  const[loading,setLoading]=useState(false);
  const form = useForm({

    initialValues: {
      name: '',
      role:"TEACHER",
      email: '',
      password: '',
      confirmPassword:''
     
    },

    validate: {
      name:(value)=> (!value?"Name is required":null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
     password: (value) =>
  !value
    ? "Password is required"
    : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value)
    ? "Password must be 8-15 characters and contain uppercase, lowercase, number and special character"
    : null,
      confirmPassword: (value,values)=> (value === values.password? null:"Password didn't match")

    },
  });
  
  const handleSubmit = (values) => {
    // Handle form submission logic here
    setLoading(true);
    registerUser(values).then((data)=>{
        console.log("REGISTER RESPONSE:", data);
      console.log(data);
      successNotification("User Registered Successfully");
      navigate("/login");
    }).catch((error)=>{
        console.log("FULL ERROR:", error);

        if (error.response) {
            console.log("STATUS:", error.response.status);
            console.log("DATA:", error.response.data);
        } else {
            console.log("NETWORK ERROR:", error.message);
        }

      errorNotification(error.response.data.errorMessage || "Failed to register user");
    }).finally(()=> setLoading(false));
  };

  return (
    <div style={{background:'url("/student1.png")'}} className='h-screen w-screen !bg-cover !bg-center !bg-no-repeat flex flex-col items-center justify-center'>
            <div className='flex text-white gap-1 py-4  items-center'>
                  <IconSchool stroke={2} size={50}/>
                  <span className='font-heading font-semibold text-xl'>Student Management System</span>
            </div>
        <div className='w-[450px] backdrop-blur-md p-10 py-8 rounded-lg'>
            <form  onSubmit={form.onSubmit(handleSubmit)}  className='flex flex-col gap-5 [&_input]:placeholder-black [&_.mantine-Input-input]:!border
             [&_.mantine-Input-input]:!border-black [&_input]:pl-3 focus-within:[&_.mantine-Input-input]:!border-gray-400'>
                <div className='self-center text-heading font-medium  text-xl'>Register</div>
                <SegmentedControl fullWidth size="md" radius="md" color='black' bg="none" className='[&_*]:!text-white border border-black' data={[{label:"Teacher",value:"TEACHER"},{label:"Student",value:"STUDENT"},
                  {label:"Admin",value:"ADMIN"}
                ]} {...form.getInputProps('role')}/>
                 <TextInput variant="unstyled" size="md" radius="md" placeholder="Name" className='transition duration-300' {...form.getInputProps('name')}/>   
                <TextInput variant="unstyled" size="md" radius="md" placeholder="Email" className='transition duration-300' {...form.getInputProps('email')}/>   
                <PasswordInput variant="unstyled"size="md" radius="md"placeholder="Password"styles={{visibilityToggle: {backgroundColor: "transparent",},}} className='transition duration-300'     {...form.getInputProps('password')}/>
                <PasswordInput variant="unstyled"size="md" radius="md"placeholder="Confirm Password"styles={{visibilityToggle: {backgroundColor: "transparent",},}} className='transition duration-300'     {...form.getInputProps('confirmPassword')}/>
                <Button type='submit' radius="md" size='md' color='black' loading={loading}>Register</Button>
                <div className='text-sm self-center text-gray-500'>Have an Account? <Link to="/login" className='hover:underline'>Login</Link></div>
            </form>

        </div>

    </div>
  )
}

export default RegisterPage