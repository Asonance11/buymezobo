import { useInterface } from "@/store/InterfaceStore"
import React from 'react'
import { IoMdSearch } from "react-icons/io";
import { Button } from "../ui/button";
import useIsMobile from "@/hooks/useIsMobile";
import { HiMenu } from "react-icons/hi";
import { FaQuoteLeft } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/authentication";
import { Profile } from "@prisma/client";

export default function MainHeader() {
    const { onOpen } = useInterface()
    const isMobile = useIsMobile()
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await getCurrentUser()
            setProfile(profile)
        }
        fetchProfile()
    }, [])


    const openMenu = () => {
        onOpen("searchCreators")
    }

    const openSide = () => {
        onOpen("sideMenuNavigation")
    }

    return (
        <div className="navbar bg-white  lg:max-w-[95%] mx-auto">
            <div className="navbar-start ">
                {
                    isMobile ? (
                        <HiMenu className="text-2xl" onClick={openSide} />
                    ) : (
                        <div className="flex items-center gap-8">
                            <div className="flex items-center justify-center w-fit gap-1.5">
                                <FaQuoteLeft />
                                <a className="text-base font-semibold tracking-tight" >FAQ</a>
                            </div>

                            <div className="flex items-center justify-center w-fit gap-1">
                                <IoInformationCircle className="text-lg" />
                                <a className="text-base font-semibold tracking-tight" >About</a>
                            </div>
                            <a className="text-base font-semibold tracking-tight" >Resources</a>
                        </div>
                    )
                }
            </div>
            <div className="navbar-center hidden lg:flex">
                <Logo />
            </div>
            <div className="navbar-end flex gap-3">
                <div onClick={openMenu} className='hidden xl:flex gap-1 items-center justify-start p-2 rounded-lg bg-zinc-100 '>
                    <IoMdSearch className="text-xl" />
                    <input onClick={openMenu} type='text' placeholder='Search Creators' className='focus:outline-none flex-1 bg-transparent text-sm font-semibold placeholder-zinc-700' />
                </div>
                {
                    profile ? (null) : (
                        <>

                            <Button variant={"secondary"} className="text-sm lg:text-base font-semibold tracking-tight" >
                                <a href="/signin">
                                    Login
                                </a>
                            </Button>
                            <Button className="rounded-lg text-sm lg:text-base font-semibold tracking-tight">
                                <a href="/signup">
                                    Sign up
                                </a>
                            </Button>
                        </>
                    )
                }
            </div>
        </div>
    )

}
