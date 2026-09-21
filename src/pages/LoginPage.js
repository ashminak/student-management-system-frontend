import React from 'react'
import { PasswordInput } from '@mantine/core';
import { TextInput } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import {useState} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import {loginUser} from '../service/UserService';
import { successNotification, errorNotification } from '../utility/NotificationUtil';
import {jwtDecode} from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setJwt } from '../slices/JwtSlice';
import { setUser } from '../slices/UserSlice';


const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const[loading,setLoading]=useState(false);
  const form = useForm({

    initialValues: {
      email: '',
      password: ''
     
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value)=> (!value?"Password is required":null)

    },
  });
  
 const handleSubmit = (values) => {
  setLoading(true);

  loginUser(values)
    .then((data) => {

      const decodedToken = jwtDecode(data);

      console.log("JWT:", data);
      console.log("Decoded JWT:", decodedToken);
      console.log("Role:", decodedToken.role);

      // Save JWT and user
     localStorage.setItem("token", data);

dispatch(setJwt(data));
dispatch(setUser(decodedToken));

      successNotification("User Logged In Successfully");

      // Navigate according to role
   if (decodedToken.role === "STUDENT") {
    navigate("/student/dashboard");
} 
else if (decodedToken.role === "TEACHER") {
    navigate("/teacher/dashboard");
} 
else if (decodedToken.role === "ADMIN") {
    navigate("/admin/dashboard");
}else {
      navigate("/login");
    }

    })
    .catch((error) => {
      console.error(error);

      errorNotification(
        error.response?.data?.errorMessage || "Invalid login credentials"
      );
    })
    .finally(() => setLoading(false));
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
                <div className='self-center text-heading font-medium  text-xl'>Login</div>
                <TextInput variant="unstyled" size="md" radius="md" placeholder="Email" className='transition duration-300' {...form.getInputProps('email')}/>   
                <PasswordInput variant="unstyled"size="md" radius="md"placeholder="Password"styles={{visibilityToggle: {backgroundColor: "transparent",},}} className='transition duration-300'     {...form.getInputProps('password')}/>
                <Button type='submit' radius="md" size='md' color='black' loading={loading}>Login</Button>
                <div className='text-sm self-center text-gray-500'>Don't have an Account? <Link to="/register" className='hover:underline'>Register</Link></div>
            </form>

        </div>

    </div>
  )
}

export default LoginPage