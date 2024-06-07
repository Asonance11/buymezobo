import Loader from '@/components/common/Loader';
import React from 'react';

function Loading() {
	return (
		<div className="md:min-h-screen md:w-full flex justify-center items-center">
			<Loader className="md:w-[50px] md:min-h-[50px] w-[30px] h-[30px] mx-auto block" />
		</div>
	);
}

export default Loading;
