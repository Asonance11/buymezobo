import { generateMetadata } from '@/app/[username]/layout';
import { getCurrentUser } from '@/lib/authentication';
import React from 'react';

export default async function page() {
	const profile = await getCurrentUser();
	return <main className="w-full h-full bg-purple-700"></main>;
}
