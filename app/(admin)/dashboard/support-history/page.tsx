'use client';

import { Toggle } from '@/components/ui/toggle';

import SupportCard from '@/components/AdminComponents/SupportCard';
import queryKeys from '@/query-key-factory';
import { LoadingOutlined } from '@ant-design/icons';
import { Support } from '@prisma/client';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { User } from 'lucia';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useAuth as Auth } from '@/actions/use-auth';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function Page() {
	const [profile, setProfile] = useState<User | null>(null);
	const [showDeleted, setShowDeleted] = useState(false);
	const queryClient = useQueryClient();
	const observer = useRef<IntersectionObserver | null>(null);

	const MAX_SUPPORT_PAGE = 10;

	const fetchSupports = async ({ pageParam = 1 }: { pageParam?: number }) => {
		const response = await axios.get(
			`/api/support/${profile!.id}?page=${pageParam}&limit=${MAX_SUPPORT_PAGE}${showDeleted ? '&deleted=true' : ''}`,
		);
		return response.data.supporters as Support[] | [];
	};

	const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
		queryKey: [queryKeys.support.many(), showDeleted],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => fetchSupports({ pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === 10 ? allPages.length + 1 : undefined;
		},
		enabled: !!profile,
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

	const supports = useMemo(() => {
		return data?.pages.flat();
	}, [data]);

	useEffect(() => {
		const fetchUser = async () => {
			const { user } = await Auth();
			setProfile(user);
		};

		fetchUser();
	}, []);

	if (isLoading) return <h1>Loading...</h1>;
	if (error) return <h1>Error fetching data...</h1>;

	const toggleShowDeleted = () => {
		setShowDeleted(!showDeleted);
		queryClient.invalidateQueries({ queryKey: [queryKeys.support.many(), showDeleted] });
	};

	return (
		<section className="flex flex-col items-center relative w-full h-full py-[3%] gap-2">
			<div className="flex items-center justify-end w-5/6 lg:w-2/3 ">
				<Button onClick={toggleShowDeleted} className='text-xs lg:text-sm' variant={'outline'}>
					{showDeleted ? <AiOutlineEyeInvisible className="mr-2" /> : <AiOutlineEye className="mr-2" />}
					{showDeleted ? 'Hide Deleted Supports' : 'Show Deleted Supports'}
				</Button>{' '}
			</div>
			<div className="space-y-2.5 w-5/6 lg:w-2/3 bg-white min-w-[300px] rounded-sm p-4">
				{supports?.length === 0 ? (
					<p>No data available</p>
				) : (
					supports?.map((support, index) => {
						const refProp = index === supports.length - 1 ? { ref: lastElementRef } : {};
						return (
							<SupportCard
								key={support.id}
								support={support}
								comments={true}
								className="p-4 hover:bg-slate-100 box-border rounded-sm"
								{...refProp}
							/>
						);
					})
				)}
				{isFetching && (
					<div className="w-full flex items-center justify-center p-3">
						<LoadingOutlined />
					</div>
				)}
			</div>
		</section>
	);
}
