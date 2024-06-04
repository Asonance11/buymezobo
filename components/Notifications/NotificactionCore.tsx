import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Notification } from '@prisma/client';
import { SlOptions } from 'react-icons/sl';
import { IoMailOutline, IoMailOpenOutline } from 'react-icons/io5';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/store/UserDataStore';
import axios from 'axios';
import { truncateText } from '@/utility/text';
import { toast } from 'sonner';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import Loader from '../common/Loader';

interface Props {
	open: boolean;
}

export const NotificactionCore = ({ open }: Props) => {
	const [loading, setLoading] = useState(false);

	const [unread, setUnread] = useState(false);

	const { loggedInUser } = useUser();

	const MAX_NOTIFICATION_PAGE = 10;

	const fetchNotifications = async ({ pageParam = 1 }: { pageParam?: number }) => {
		const response = await axios.get(
			`/api/notification/${loggedInUser?.id}?page=${pageParam}&limit=${MAX_NOTIFICATION_PAGE}${unread ? '&unread=true' : ''}`,
		);
		return response.data as Notification[];
	};

	const observer = useRef<IntersectionObserver>();

	const queryClient = useQueryClient();

	const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
		queryKey: queryKeys.notification.many(),
		initialPageParam: 1,
		queryFn: ({ pageParam }) => fetchNotifications({ pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === MAX_NOTIFICATION_PAGE ? allPages.length + 1 : undefined;
		},
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
	});

	const lastElementRef = useCallback(
		(node: HTMLDivElement) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetching) {
					fetchNextPage();
				}
			});

			if (node) observer.current.observe(node);
		},
		[fetchNextPage, hasNextPage, isFetching, isLoading],
	);

	const notifications = useMemo(() => {
		return data?.pages.flat();
	}, [data]);

	if (isLoading) return <h1>Loading...</h1>;
	if (error) return <h1>Error fetching data...</h1>;

	const MarkAllasRead = async () => {
		try {
			setLoading(true);
			await axios.put(`/api/notification/${loggedInUser?.id}/markallasread`);
			queryClient.invalidateQueries({ queryKey: [...queryKeys.notification.many()] });
			toast.success('All notifications marked as read');
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const deleteAllNotifications = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/notification/${loggedInUser?.id}/deleteall`);
			queryClient.invalidateQueries({ queryKey: [...queryKeys.notification.many()] });
			toast.success('All notifications deleted');
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const NotificationOptions = () => (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5">
					<SlOptions />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={MarkAllasRead}>Mark all as read</DropdownMenuItem>
				<DropdownMenuItem onClick={deleteAllNotifications}>Delete all notifications</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	const toggleOnRead = () => {
		setUnread(!unread);
		queryClient.invalidateQueries({ queryKey: [...queryKeys.notification.many()] });
	};

	return (
		<section className="w-full h-full p-1 space-y-2">
			<div className="flex items-center justify-between">
				<p className="font-semibold lg:text-xl tracking-tight">Notifications</p>
				<NotificationOptions />
			</div>
			<div className="flex items-center justify-between">
				<div className="space-x-2">
					<Button variant="secondary" className="py-0.5">
						View all
					</Button>
					<Button variant={unread ? 'default' : 'secondary'} className="py-0.5" onClick={toggleOnRead}>
						Unread
					</Button>
				</div>
				<Button disabled={loading} onClick={MarkAllasRead} variant="ghost">
					Mark all as read
				</Button>
			</div>
			<div className="overflow-y-auto max-h-72">
				{notifications == null || notifications.length < 1 ? (
					<div className="flex w-full h-full items-center justify-center py-16 lg:py-20 bg-zinc-300 rounded-lg">
						<p>You have no notifications</p>
					</div>
				) : (
					<>
						{notifications.map((notification, index) => {
							const IsReadIcon = notification.isRead ? IoMailOpenOutline : IoMailOutline;
							const refProp = index === notifications.length - 1 ? { ref: lastElementRef } : {};
							return (
								<div
									{...refProp}
									key={notification.id}
									className={`flex my-1 border border-gray-200 rounded-xl p-2 items-center w-full gap-2 ${
										notification.isRead ? 'bg-gray-100' : ''
									}`}
								>
									<div className="p-1">
										<IsReadIcon className="text-lg" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-semibold">Someone bought you zobo</p>
										<p className="text-xs">{truncateText(notification.content!, 40)}</p>
									</div>
									<div>
										<SlOptions />
									</div>
								</div>
							);
						})}
						{isFetching && (
							<div className='w-full flex items-center justify-center p-3'>
								<Loader />
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
};
