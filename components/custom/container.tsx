import { cn } from '@/utility/style';
import React, { HTMLAttributes, ReactNode } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const CustomContainer = ({ children, className, ...opts }: ContainerProps) => {
	return (
		<section {...opts} className={cn('', className)}>
			{children}
		</section>
	);
};
