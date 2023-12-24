"use client"
import { FaArrowRight } from "react-icons/fa6";
import React from 'react';
import { update } from '@/lib/update';
//import { useRouter } from "next/navigation";

export const LatestUpdateComponent = () => {
    //const router = useRouter()

    const handleClick = () => {
        //router.push(update.link)
    }

    if (!update.show) {
        return null; // Don't render the component if show is set to false
    }


    return (
        <div className='flex items-center justify-center gap-3 h-12 w-full bg-black text-white text-sm'>
            <div className="p-1 rounded-lg bg-gray-900 shadow-yellow-300 shadow-7xl">
                <p className="text-xs font-semibold text-myYellow">{update.type}</p>
            </div>
            <div className="flex items-center justify-center gap-1">
                <p className="font-semibold">{update.category}</p>
                <p>{update.message}</p>
            </div>
            {update.showLink ? (
                <div onClick={handleClick}>
                    <FaArrowRight size={17} id="lifeupdatearrow" />
                </div>
            ) : (null)}
        </div>
    );
};

export default LatestUpdateComponent;
