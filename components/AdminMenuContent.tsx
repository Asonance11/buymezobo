"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getCurrentUser } from '@/lib/authentication'
import { Profile } from '@prisma/client'
import Link from 'next/link'
import { RiHomeSmileLine } from "react-icons/ri";
import { MdOutlineExplore } from "react-icons/md";
import { PiLayout } from "react-icons/pi";
import { PiArrowSquareOutLight } from "react-icons/pi";
import { Logo } from './common/Logo'

export default function AdminMenuContent() {
    const pathname = usePathname()

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


    const RedirectIcon = PiArrowSquareOutLight

    const mainOptions = [
        { name: 'Home', route: '/dashboard', icon: RiHomeSmileLine },
        { name: 'Explore Creators', route: '/explore', icon: MdOutlineExplore },
        { name: 'View page', route: `/${profile?.userName}`, icon: PiLayout, newTab: true },
    ];

    return (
        <main className='w-full h-full bg-white flex flex-col'>
            <div className='h-[3rem] lg:h-[4rem] flex items-center justify-evenly'>
                <Logo />
            </div>
            <section className='flex-1 p-3 '>
                {mainOptions.map(option => (
                    <Link href={option.route} target={option.newTab ? '_blank' : '_self'} rel={option.newTab ? 'noopener noreferrer' : ''}
                        className={``}
                    >
                        <div className={`mb-2 flex gap-1.5 items-center justify-around transition-all duration-300 py-2.5 px-3.5 rounded-lg ${pathname === option.route ? 'bg-zinc-100' : 'hover:bg-zinc-100'}`}>
                            <option.icon className={` ${pathname === option.route ? "text-red-500 " : null} text-2xl `} />
                            <p className='flex-1 text-zinc-800 text-sm font-normal'>{option.name}</p>
                            {
                                option.newTab ? <RedirectIcon className={` text-lg text-zinc-600`} /> : null
                            }
                        </div>

                    </Link>
                ))}
            </section>
        </main>
    )
}

