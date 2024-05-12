import Loader from '@/components/common/Loader';
import React from 'react';

function Loading() {
	return (
		<div className='relative top-0 left-0 w-full h-full flex justify-center items-center'>
  <Loader className="block w-[50px] h-[50px] md:w-[100px] md:h-[100px]" />
</div>
	);
}

export default Loading;
