import React from 'react';
import UserButton from './UserButton';

export default function AdminHeader() {
	return (
		<div className="w-full bg-red-50 h-[3rem] lg:h-[4rem] px-4 lg:px-12 shadow-sm flex items-center justify-end">
			<UserButton />
		</div>
	);
}
