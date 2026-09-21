import { ActionIcon } from '@mantine/core';
import {IconBellRinging, IconMenu2} from "@tabler/icons-react";
import ProfileMenu from '../ProfileMenu';
import { Link } from 'react-router-dom';
import { Button } from "@mantine/core";
import { useDispatch, useSelector } from 'react-redux';
import { removeJwt } from '../../slices/JwtSlice';
import { removeUser } from '../../slices/UserSlice';
const Header = () => {
  const jwt = useSelector((state) => state.jwt);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch(); 
  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(removeJwt());
    dispatch(removeUser());
  }
  return (
    <div className="h-16 bg-[#E0D9D9] flex justify-between px-5">
      <ActionIcon variant='transparent' size="2xl" aria-label='Settings'>
          <IconMenu2 stroke={2} style={{width:'70%',height:'70%'}} />
      </ActionIcon>
    <div className='flex items-center gap-3'>
      {jwt ? (
        <Link to="login"><Button color="red" onClick={handleLogout}>
          Logout
        </Button></Link>
      ) : (
        <Link to="login"><Button>Login</Button></Link>
      )}
    {jwt && <><ActionIcon variant='transparent' size="2xl" aria-label='Settings'>
          
      </ActionIcon>
      <ProfileMenu/></>}
    </div>
    </div>
  
  )
}

export default Header