'use client';

import MainHeader from '@/components/Headers/MainHeader';
import React, { ReactNode } from 'react';
import Script from 'next/script';
import StyledDiv from '@/components/styles/Gradient';
// Added this main layout for all marketing so they all have the header

const MarketingLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <div className="pointer-events-none absolute inset-x-0 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <StyledDiv />
            </div>
            <MainHeader />

            {children}
        </div>
    );
};

export default MarketingLayout;
