'use client';
import { Button } from '@/components/ui/button';
import { useInterface } from '@/store/InterfaceStore';
import React from 'react';

export default function page() {
	const { onOpen } = useInterface();
	return (
		<div>
			<section>
				<Button onClick={() => onOpen('makeImagePostModal')}>Make New Post</Button>
			</section>
			<section></section>
		</div>
	);
}
