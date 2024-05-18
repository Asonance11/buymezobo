import React, { HTMLAttributes } from 'react';
import { DancingScript, shadowLight } from '@/utility/fonts';
import { cn } from '@/utility/style';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const Logo = ({ className }: Props) => {
	return (
		<a href="/">
			<div className={cn(` flex items-center justify-center gap-0.5`, className)}>
				<p className={`text-2xl lg:text-3xl tracking-tighter font-extrabold ${shadowLight.className}`}>
					Buy me Zobo &copy;
				</p>
			</div>
		</a>
	);
};
