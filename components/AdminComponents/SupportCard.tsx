import { SupportPrimitive } from '@/types/primitives';
import { cn } from '@/utility/style';
import { Support } from '@prisma/client';
import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
	support: SupportPrimitive;
}

export default function SupportCard({ support, className }: Props) {
	return (
		<div key={support.id} className={cn('w-full my-1 md:my-3', className)}>
			<div className="flex items-center gap-1.5 md:gap-3 ">
				<div className="cursor-pointer rounded-lg w-6 h-6 lg:w-10 lg:h-10 bg-center bg-cover bg-no-repeat bg-black "></div>
				<div className="flex-col space-y-1 items-center justify-start w-full">
					<div>
						<p className="text-xs md:text-xs">
							<span className="font-semibold">{support.name}</span> bought {support.numberOfZobo}{' '}
							{support.numberOfZobo > 1 ? 'zobos' : 'zobo'}
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
	);
}
