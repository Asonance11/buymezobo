import React from 'react';
import AdminMenuContent from '../AdminMenuContent';

export default function Sidebar() {
	return (
		<section className="min-h-dvh w-0 md:w-[13rem] lg:w-[15rem]  transition-all duration-300  bg-black">
			<AdminMenuContent />
		</section>
	);
}
