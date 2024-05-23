'use client';

import MainHeader from '@/components/common/MainHeader';
import React, { ReactNode } from 'react';
import Script from 'next/script';
// Added this main layout for all marketing so they all have the header

const MarketingLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <MainHeader />
            {children}
            <script
                src="https://sijirama.github.io/static/js/widget.done.js"
                data-name="BMC-Widget"
                data-cfasync="false"
                data-id="buymezobo"
                data-description="buy me some fucking zobo!"
                data-message=""
                data-color="#7C3BED"
                data-position="Right"
                data-x_margin="18"
                data-y_margin="18"
                onLoad={() => console.log(`script loaded correctly, window.FB has been populated`)}
            />
        </div>
    );
};

export default MarketingLayout;
