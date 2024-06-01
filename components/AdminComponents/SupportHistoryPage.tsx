'use client';
import { getCreatorSupports } from '@/actions/support';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utility/style';
import { Support } from '@prisma/client';
import { User } from 'lucia';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import Link from 'next/link';
import SupportCard from './SupportCard';

interface Props extends HTMLAttributes<HTMLDivElement> {
	creator: User | null;
}

export default function SupportHistory({ creator, className }: Props) {
	const [supports, setSupports] = useState<Support[]>([]);

	const {
		data: creatorSupports,
		fetchStatus,
		status,
	} = useQuery({
		queryKey: queryKeys.support.many(),
		queryFn: () => getCreatorSupports(creator!.id),
		enabled: !!creator,
	});

	useEffect(() => {
		if (fetchStatus === 'idle' && status === 'success') setSupports(creatorSupports.data);
		if (fetchStatus === 'idle' && status === 'error') toast.error('An error occurred');
	}, [fetchStatus, status]);

	if (fetchStatus === 'fetching')
		return (
			<div
				className={cn(
					`transition-all max-h-[40rem] overflow-y-auto duration-300 p-7 md:p-10 w-[27rem] md:w-full rounded-2xl bg-white flex flex-col gap-3 items-start h-fit`,
					className,
				)}
			>
				<Separator className="my-2" />
				<div className="spce-y-4 w-full">
					{[1, 2, 3, 4, 5].map((index) => (
						<Skeleton key={index} className="py-3 w-full "></Skeleton>
					))}
				</div>
			</div>
		);

	return (
		<div>
			<div
				className={cn(
					`transition-all max-h-[40rem] overflow-y-auto duration-300 p-2 md:px-5 md:py-4 w-full rounded-2xl bg-white flex flex-col gap-3 items-start h-fit`,
					className,
				)}
			>
				<div className="space-y-4 w-full">
					{supports.map((support) => (
						<SupportCard support={support} />
					))}
				</div>
				<Button className="w-full" variant={'secondary'}>
					<Link href="/dashboard/support-history?page=1" className=" w-full h-full">
						See all supporters
					</Link>
				</Button>
			</div>
		</div>
	);
}
