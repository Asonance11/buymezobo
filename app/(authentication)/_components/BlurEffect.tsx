import StyledDiv, { StyledDiv2 } from '@/components/styles/Gradient';
import React from 'react';

interface Props {
	className?: string;
}

export default function BlurEffect({ className }: Props) {
	return (
		<div
			className={`pointer-events-none absolute inset-x-0 transform-gpu overflow-hidden blur-3xl sm:-top-80 ${className}`}
		>
			<StyledDiv />
			<StyledDiv2 />
		</div>
	);
}
