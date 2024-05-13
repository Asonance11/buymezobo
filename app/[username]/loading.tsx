import Loader from '@/components/common/Loader';
import React from 'react';

function Loading() {
	return (
		<div className="md:min-h-screen md:w-full flex justify-center items-center">
	<Loader className="md:w-[100px] md:min-h-[100px] w-[50px] h-[50px] mx-auto block" />
		</div>
	);
}

export default Loading;
