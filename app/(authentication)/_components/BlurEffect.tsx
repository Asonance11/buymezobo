import StyledDiv, { StyledDiv2 } from '@/components/styles/Gradient';
import React from 'react';

export default function BlurEffect() {
	return (
		<div className="pointer-events-none absolute inset-x-0 transform-gpu overflow-hidden blur-3xl sm:-top-80">
			<StyledDiv />
			<StyledDiv2 />
		</div>
	);
}
