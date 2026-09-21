import { Menu, Button, Text,rem } from '@mantine/core';
import {
  IconSettings,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconArrowsLeftRight,
  IconTrash,
} from "@tabler/icons-react";
import { Avatar } from '@mantine/core';
import { useSelector } from 'react-redux';

function ProfileMenu(){
  const user = useSelector((state) => state.user);
return(
    <Menu shadow="md" width={220}>
  <Menu.Target>
    <div className='flex items-center gap-3 cursor-pointer'>
        <span className='font-medium text-lg text-neutral-900'>{user.name}</span>
       <Avatar src="/avatar.png" variant='filled' size={50} alt="it's me" />
    </div>
  
  </Menu.Target>

  <Menu.Dropdown>
    <Menu.Label>Application</Menu.Label>

    <Menu.Item leftSection={<IconSettings size={14} />}>
      Settings
    </Menu.Item>

    <Menu.Item leftSection={<IconMessageCircle size={14} />}>
      Messages
    </Menu.Item>

    <Menu.Item leftSection={<IconPhoto size={14} />}>
      Gallery
    </Menu.Item>

    <Menu.Item
      leftSection={<IconSearch size={14} />}
      rightSection={
        <Text size="xs" c="dimmed">
          Ctrl + K
        </Text>
      }
    >
      Search
    </Menu.Item>

    <Menu.Divider />

    <Menu.Label>Danger zone</Menu.Label>

    <Menu.Item leftSection={<IconArrowsLeftRight size={14} />}>
      Transfer my data
    </Menu.Item>

    <Menu.Item
      color="red"
      leftSection={<IconTrash size={14} />}
    >
      Delete my account
    </Menu.Item>
  </Menu.Dropdown>
</Menu>
)
}
export default ProfileMenu;