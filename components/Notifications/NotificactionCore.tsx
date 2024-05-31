import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Notification } from '@prisma/client';
import Loader from '../common/Loader';
import { SlOptions } from 'react-icons/sl';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
	open: boolean;
}

export const NotificactionCore = ({ open }: Props) => {
	const [notifications, setNotificactions] = useState<Notification[] | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				setLoading(true);
			} catch (error) {
			} finally {
				//setLoading(false);
			}
		};
		if (open) {
			console.log('open notification');
			fetchNotifications();
		}
	}, [open]);

	const MarkAllasRead = async () => {};
	const deleteAllNotifications = async () => {};

	const NotificationOptions = () => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger>
					<div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5">
						<SlOptions />
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => MarkAllasRead()}>Mark all as read</DropdownMenuItem>
					<DropdownMenuItem onClick={() => deleteAllNotifications()}>
						Delete all notifiactions
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	};

	const MarkasRead = async (notificationId: string) => {};
	const deleteNotification = async (notificationId: string) => {};

	return (
		<section className="w-full h-full p-1 space-y-2">
			<div className="flex items-center justify-between">
				<p className="font-semibold lg:text-xl tracking-tight">Notifications</p>
				<div>
					<NotificationOptions />
				</div>
			</div>
			<div className="flex items-center justify-between">
				<div className="space-x-2">
					<Button variant={'secondary'} className="py-0.5">
						View all
					</Button>
					<Button variant={'secondary'} className="py-0.5">
						Unread
					</Button>
				</div>
				<Button variant={'ghost'}>Mark all as read</Button>
			</div>
			<div>
				{notifications == null || notifications?.length < 1 ? (
					<div className="flex w-full h-hull items-center justify-center py-16 lg:py-20 bg-zinc-300 rounded-lg">
						<p>You have no notifications</p>
					</div>
				) : null}
			</div>
		</section>
	);
};
