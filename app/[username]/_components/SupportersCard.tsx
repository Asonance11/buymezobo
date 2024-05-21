import { getCreatorSupports } from '@/actions/support';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utility/style';
import { Post, Profile, Support } from '@prisma/client';
import { User } from 'lucia';
import React, { HTMLAttributes, useEffect, useState } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
	post: Post | null;
	creator: User;
	reload: boolean;
}

export default function SupportersCard({ post, creator, reload, className }: Props) {
	const [supports, setSupports] = useState<Support[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getSupports = async () => {
			setLoading(true);
			const [supports, _count, error] = await getCreatorSupports(creator.id, 5);
			if (error != null) {
				console.error(error);
				//TODO: handle error
				setLoading(false);
				return;
			}
			setSupports(supports);
			setLoading(false);
		};
		getSupports();
	}, [creator.id, reload]);

	console.log('POST:     ', post);

	return (
		<div
			className={cn(
				`transition-all duration-300 p-5 md:p-7 lg:p-8 w-screen md:w-[32rem] lg:w-[33rem] rounded-none md:rounded-2xl bg-white flex flex-col gap-3 items-start h-fit `,
				className,
			)}
		>
			<div className="space-y-1 md:space-y-3">
				<p className="text-sm md:text-lg font-bold -tracking-wide">About {creator.userName}</p>
				<p className="text-xs md:text-sm font-semibold text-zinc-500">{creator.bio}</p>
			</div>
			{post ? (
				<div className="bg-red-700 w-full h-[15rem] overflow-hidden rounded-lg flex flex-col items-center">
					<img
						src={post?.imageUrl}
						alt={post?.title}
						className="w-full object-cover flex-1 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
					/>
					<div className="p-2">
						<p>{post.title}</p>
						<p>{post.caption}</p>
					</div>
				</div>
			) : null}
			<Separator className="my-1 md:my-2" />
			<div className="space-y-2 md:spce-y-4 w-full">
				{supports.map((support) => (
					<div key={support.id} className=" w-full ">
						<div className="lg:flex items-center gap-3 ">
							<div className="hidden md:block cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat bg-black "></div>
							<div className="flex-col space-y-0.5 md:space-y-1.5 items-center justify-start">
								<div>
									<p className="text-xs lg:text-sm ">
										<span className="font-semibold">{support.name}</span> bought{' '}
										{support.numberOfZobo} {support.numberOfZobo > 1 ? 'zobos' : 'zobo'}
									</p>
								</div>
								{support.content ? (
									<div className="p-2 w-fit bg-slate-200 rounded-sm flex items-center justify-start">
										<p className="text-xs md:text-sm">{support.content}</p>
									</div>
								) : null}
							</div>
						</div>
					</div>
				))}
			</div>
			<Button variant={'secondary'} className="w-full font-semibold ">
				See all aupporters
			</Button>
		</div>
	);
}
