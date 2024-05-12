import React from 'react';
import { DancingScript, shadowLight } from '@/utility/fonts';

export const Logo = ({ }) => {
    return (
        <a href="/">
            <div className="flex items-center justify-center gap-0.5">
                <p className={`text-2xl lg:text-3xl tracking-tighter font-extrabold ${shadowLight.className}`}>
                    Buy me Zobo &copy;
                </p>
            </div>
        </a>
    );
};
