'use client';

import MainHeader from '@/components/common/MainHeader';
import React, { ReactNode } from 'react';
	return (
		<section className="min-h-dvh bg-black flex">
			<Sidebar />
			<main className="flex-1 min-h-dvh bg-zinc-100 flex flex-col">
				<AdminHeader />
				<section className="flex-1">{children}</section>
			</main>
		</section>
	    </div>
    );
};

export default MarketingLayout;
