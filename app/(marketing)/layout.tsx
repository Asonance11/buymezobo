'use client';

import MainHeader from '@/components/common/MainHeader';
import React, { ReactNode } from 'react';

// Added this main layout for all marketing so they all have the header

const MarketingLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<MainHeader />
			{children}
		</div>
	);
};

export default MarketingLayout;
