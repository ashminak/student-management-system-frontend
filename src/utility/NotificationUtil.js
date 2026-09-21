import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
const successNotification = (message) => {
    // Implementation for displaying success notification
    notifications.show({
        title: 'Success',
        message: message,
        color: 'green',
        icon:<IconCheck  />,
        withCloseButton: true,
        withBorder: true,
        className:"!border-green-500"
    });

}

const errorNotification = (message) => {
    // Implementation for displaying error notification
    notifications.show({
        title: 'Error',
        message: message,
        color: 'red',
        icon:<IconX  />,
        withCloseButton: true,
        withBorder: true,
        className:"!border-red-500"
    });

}
 export { successNotification, errorNotification };