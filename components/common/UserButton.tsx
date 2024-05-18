'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/authentication';
import { Profile } from '@prisma/client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { truncateText } from '@/utility/text';
import Link from 'next/link';
import { useAuth } from '@/actions/use-auth';
import { User } from 'lucia';
import { signOut } from '@/actions/signout';
import SharePage from './SharePage';

export default function UserButton() {
    const [profile, setProfile] = useState<User | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { user: profile } = await useAuth();
            setProfile(profile);
        };
        fetchProfile();
    }, []);

    if (!profile) {
        return null;
    }

    const OnSignOut = async () => {
        signOut();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border-none outline-none">
                {profile.imageUrl ? (
                    <div
                        className="cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat border-2 border-purple-500"
                        style={{ backgroundImage: `url(${profile?.imageUrl})` }}
                    ></div>
                ) : (
                    <div className="text-xl font-extrabold text-purple-900 bg-purple-100 cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat border border-purple-500 flex justify-center items-center">
                        <p className="text-center">{(profile?.firstName as string)[0]}</p>
                    </div>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm">My Account</p>
                    <p className="text-xs">{truncateText(profile.email, 23)}</p>
                </div>
                <DropdownMenuSeparator />
                <Link href={'/dashboard'}>
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="lg:hidden">Edit my page</DropdownMenuItem>
                <Link href={`/${profile.userName}`}>
                    <DropdownMenuItem>View my page</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <SharePage className="text-xs hidden" profile={profile} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={OnSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
