'use client';
import { getCreatorSupports } from '@/actions/support';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utility/style';
import { Profile, Support } from '@prisma/client';
import { User } from 'lucia';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

interface Props extends HTMLAttributes<HTMLDivElement> {
	creator: User | null;
}

export default function SupportHistoryPage({ creator, className }: Props) {
	const [supports, setSupports] = useState<Support[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getSupports = async () => {
			setLoading(true);
			const [supports, _count, error] = await getCreatorSupports(creator!.id, 5);
			if (error != null) {
				console.error(error);
				//TODO: handle error
				setLoading(false);
				return;
			}
			setSupports(supports);
			setLoading(false);
		};
		if (creator) {
			getSupports();
		}
	}, [creator?.id, creator]);

	return (
		<div>
			{!creator && (
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
			)}
			{creator && (
				<div
					className={cn(
						`transition-all max-h-[40rem] overflow-y-auto duration-300 p-2 md:px-5 md:py-4 w-full rounded-2xl bg-white flex flex-col gap-3 items-start h-fit`,
						className,
					)}
				>
					<div className="spce-y-4 w-full">
						{supports.map((support) => (
							<div key={support.id} className="w-full my-1 md:my-3">
								<div className="flex items-center gap-1.5 md:gap-3 ">
									<div className="cursor-pointer rounded-lg w-6 h-6 lg:w-10 lg:h-10 bg-center bg-cover bg-no-repeat bg-black "></div>
									<div className="flex-col space-y-1 items-center justify-start w-full">
										<div>
											<p className="text-xs md:text-xs">
												<span className="font-semibold">{support.name}</span> bought{' '}
												{support.numberOfZobo} {support.numberOfZobo > 1 ? 'zobos' : 'zobo'}
											</p>
										</div>
										{support.content ? (
											<div className="p-2 bg-slate-200 w-fit rounded-lg flex items-center justify-start">
												<p className="text-xs md:text-sm">{support.content}</p>
											</div>
										) : null}
									</div>
								</div>
							</div>
						))}
					</div>
					<Button className="w-full" variant={'secondary'}>
						See all supporters
					</Button>
				</div>
			)}
		</div>
	);
}
