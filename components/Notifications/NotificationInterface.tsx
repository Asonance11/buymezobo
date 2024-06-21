import { getCurrentUser } from '@/lib/authentication';
import useNotificationStore from '@/store/NotificationStore';
import { Notification } from '@prisma/client';
import { User } from 'lucia';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { renderNotificationComponent } from './NotificationTypes';
import { toast } from 'sonner';

export const NotificationsProvider = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [user, setUser] = useState<User | null>(null);
	const { addNotification, notifications: Notificactiona } = useNotificationStore();

    /*
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const user = await getCurrentUser();
				if (!user) {
					return;
				}
				setUser(user);
			} catch (error) {}
		};

		fetchUser();
	}, []);

	useEffect(() => {
		console.log('WTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
		if (user?.id) {
			const socket = io('http://socketserver:3001');
			console.log('ABOUT TO EMIT TO JOIN EVENT');
			console.log(socket);
			socket.emit('join', user?.id);

			// Listen for notifications
			socket.on('notification', (notification) => {
				if (notification.userId === user?.id) {
					setNotifications((prevNotifications) => [...(prevNotifications as Notification[]), notification]);
					addNotification({ ...notification });
					sendNotificaction(notification);
				}
			});

			return () => {
				socket.disconnect();
			};
		}
	}, [user?.id]);

	function sendNotificaction(notification: Notification) {
		const component = renderNotificationComponent(notification);
		toast(component);
	}

	return null;
        */
};
