"use client"
import React from 'react'
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/authentication";
import { Profile } from "@prisma/client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';
import { truncateText } from '@/utility/text';


export default function UserButton() {
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await getCurrentUser()
            setProfile(profile)
        }
        fetchProfile()
    }, [])

    if (!profile) {
        return null
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${profile?.imageUrl})` }}></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className='p-4 flex flex-col items-center justify-center'>
                    <p className='text-sm'>My Account</p>
                    <p className='text-xs'>{truncateText(profile.email, 23)}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem className='lg:hidden'>Edit my page</DropdownMenuItem>
                <DropdownMenuItem>View my page</DropdownMenuItem>
                <DropdownMenuItem>My account</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

