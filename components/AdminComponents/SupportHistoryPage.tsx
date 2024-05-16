'use client';
import { getCreatorSupports } from '@/actions/support';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utility/style';
import { Profile, Support } from '@prisma/client';
import { User } from 'lucia';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

interface Props extends HTMLAttributes<HTMLDivElement> {
	creator: User | null;
}

export default function SupportHistoryPage({ creator, className }: Props) {
	const [supports, setSupports] = useState<Support[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getSupports = async () => {
			setLoading(true);
			const [supports, error] = await getCreatorSupports(creator!.id);
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
						`transition-all max-h-[40rem] overflow-y-auto duration-300 p-7 md:p-10 w-[27rem] md:w-full rounded-2xl bg-white flex flex-col gap-3 items-start h-fit`,
						className,
					)}
				>
					<Separator className="my-2" />
					<div className="spce-y-4 w-full">
						{supports.map((support) => (
							<div key={support.id} className="py-3 w-full ">
								<div className="lg:flex items-center gap-3 ">
									<div className="cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat bg-black "></div>
									<div className="flex-col space-y-1.5 items-center justify-start w-full">
										<div>
											<p className="text-sm ">
												<span className="font-semibold">{support.name}</span> bought{' '}
												{support.numberOfZobo} {support.numberOfZobo > 1 ? 'zobos' : 'zobo'}
											</p>
										</div>
										{support.content ? (
											<div className="p-2 bg-slate-200 rounded-lg flex items-center justify-start">
												<p className="text-sm">{support.content}</p>
											</div>
										) : null}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
