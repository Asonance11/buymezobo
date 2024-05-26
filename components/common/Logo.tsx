import React, { HTMLAttributes } from 'react';
import { DancingScript, shadowLight } from '@/utility/fonts';
import { cn } from '@/utility/style';
import Link from 'next/link';

interface Props extends HTMLAttributes<HTMLDivElement> {
	textClassName?: string;
}

export const Logo = ({ className, textClassName }: Props) => {
	return (
		<Link href="/">
			<div className={cn(` flex items-center justify-center gap-0.5`, className)}>
				<p
					className={cn(
						`text-xl lg:text-2xl tracking-tighter font-extrabold ${shadowLight.className}`,
						textClassName,
					)}
				>
					Buy me Zobo &copy;
				</p>
			</div>
		</Link>
	);
};
