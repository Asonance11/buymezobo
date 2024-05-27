import { getCurrentUser } from '@/lib/authentication';
import { Notification } from '@prisma/client';
import { User } from 'lucia';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'sonner';

export const NotificationsProvider = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                if (!user) {
                    return;
                }
                setUser(user);
            } catch (error) { }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (user?.id) {
            const socket = io('http://localhost:3001');
            console.log('ABOUT TO EMIT TO JOIN EVENT');
            socket.emit('join', user?.id);

            // Listen for notifications
            socket.on('notification', (notification) => {
                console.log('SOCKET NOTIFICATION', notification);
                if (notification.userId === user?.id) {
                    setNotifications((prevNotifications) => [...(prevNotifications as Notification[]), notification]);
                    //TODO: create state for notifiactions right here
                    toast.info(notification.type);
                }
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [user?.id]);

    return null;
};
