'use client';

import { getCreatorSupports } from '@/actions/support';
import { useAuth as Auth } from '@/actions/use-auth';
import PaginationRouter from '@/components/AdminComponents/PaginationRouter';
import SupportCard from '@/components/AdminComponents/SupportCard';
import queryKeys from '@/query-key-factory';
import { LoadingOutlined } from '@ant-design/icons';
import { Support } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucia';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Page() {
	const [supports, setSupports] = useState<Support[]>([]);
	const [profile, setProfile] = useState<User | null>(null);
	const [page, setPage] = useState(1);
	const searchParams = useSearchParams();

	const {
		data: creatorSupports,
		fetchStatus,
		status,
	} = useQuery({
		queryKey: queryKeys.support.many(),
		queryFn: () => getCreatorSupports(profile!.id, page),
		enabled: !!profile,
	});

	useEffect(() => {
		let pageNumber: number = Number(searchParams.get('page')) ?? 1;
		if (isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
		setPage(pageNumber);

		const fetchUser = async () => {
			const { user } = await Auth();
			setProfile(user);
		};

		fetchUser();
	}, []);

	useEffect(() => {
		if (fetchStatus === 'idle' && status === 'success') {
			setSupports(creatorSupports.data);
			console.log(creatorSupports);
		}
		if (fetchStatus === 'idle' && status === 'error') toast.error('An error occurred');
	}, [fetchStatus, status]);

	if (fetchStatus === 'fetching')
		return (
			<div className=" w-full h-full flex items-center justify-center">
				<LoadingOutlined />
			</div>
		);

	if (supports.length < 1)
		return (
			<section className=" w-full h-[90vh] flex justify-center items-center">
				<p>No data available</p>
			</section>
		);

	return (
		<section className=" flex flex-col items-center relative w-full h-full py-[5%]">
			<div className="space-y-4 w-2/3 bg-white min-w-[300px] rounded-sm p-4">
				{supports.map((support) => (
					<SupportCard key={support.id} support={support} className=" p-4 hover:bg-slate-100 box-border rounded-sm" />
				))}
			</div>
			<PaginationRouter meta={creatorSupports?.meta!} />
		</section>
	);
}
