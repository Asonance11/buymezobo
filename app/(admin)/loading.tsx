import Loader from '@/components/common/Loader';
import React from 'react';

function Loading() {
    return (
        <div className="relative top-0 left-0 w-full h-full flex justify-center items-center">
            <Loader className="block w-[30px] h-[30px] md:w-[60px] md:h-[60px]" />
        </div>
    );
}

export default Loading;
