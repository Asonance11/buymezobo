'use client';

import React, { useState } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { HiMenu } from 'react-icons/hi';
import { useInterface } from '@/store/InterfaceStore';
import { User } from 'lucia';
import { Button } from '../ui/button';
import axios from 'axios';
import UserButton from '../Profile/UserButton';

export default function AdminHeader() {
    const { onOpen } = useInterface();
    const isMobile = useIsMobile();
    const openSide = () => {
        onOpen('adminSideMenuNavigation');
    };

    const onClick = async () => {
        await axios.post('/api/notification');
    };

    return (
        <div className="w-full bg-red-50 h-[3rem] lg:h-[4rem] lg:px-12 shadow-sm flex items-center justify-end">
            {isMobile ? (
                <div className="navbar px-4">
                    <div className="navbar-start ">
                        <HiMenu className="text-2xl" onClick={openSide} />
                    </div>
                    <div className="navbar-end flex">
                        <UserButton />
                    </div>
                </div>
            ) : (
                <div className="navbar-end flex md:mr-2 gap-2">
                    {/*INFO: This is a test*/}
                    <Button onClick={onClick}>Test Notification</Button>
                    <UserButton />
                </div>
            )}
        </div>
    );
}
