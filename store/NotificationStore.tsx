import { Notification } from '@prisma/client';
import create from 'zustand';

interface NotificationStateInterface {
	notifications: Notification[];
	theresNewNotification: boolean;
	addNotification: (notification: Notification) => void;
	removeNotification: (id: string) => void;
	updateNotification: (id: string, newNotification: Notification) => void;
	clearNotifications: () => void;
	markAllAsRead: () => void;
}

// Define the Zustand store
const useNotificationStore = create<NotificationStateInterface>((set) => ({
	notifications: [],
	theresNewNotification: false,

	// Action to add a notification
	addNotification: (notification) =>
		set((state) => {
			const newNotifications = [...state.notifications, notification];
			const theresNewNotification = newNotifications.some((notif) => !notif.isRead);
			return {
				notifications: newNotifications,
				theresNewNotification,
			};
		}),

	// Action to remove a notification by ID
	removeNotification: (id: string) =>
		set((state) => {
			const newNotifications = state.notifications.filter((notif) => notif.id !== id);
			const theresNewNotification = newNotifications.some((notif) => !notif.isRead);
			return {
				notifications: newNotifications,
				theresNewNotification,
			};
		}),

	// Action to update a notification by ID
	updateNotification: (id, newNotification) =>
		set((state) => {
			const newNotifications = state.notifications.map((notif) =>
				notif.id === id ? { ...notif, ...newNotification } : notif,
			);
			const theresNewNotification = newNotifications.some((notif) => !notif.isRead);
			return {
				notifications: newNotifications,
				theresNewNotification,
			};
		}),

	// Action to clear all notifications
	clearNotifications: () => set({ notifications: [], theresNewNotification: false }),

	// Action to mark all notifications as read
	markAllAsRead: () =>
		set((state) => ({
			notifications: state.notifications.map((notif) => ({
				...notif,
				isRead: true,
			})),
			theresNewNotification: false,
		})),
}));

export default useNotificationStore;
