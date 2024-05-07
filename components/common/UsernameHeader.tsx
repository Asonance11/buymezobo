import { useInterface } from "@/store/InterfaceStore"
import React from 'react'
import { SlOptions } from "react-icons/sl";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/authentication";
import { Profile } from "@prisma/client";

interface Props {
    user: Profile
}

export default function UserNameHeader({ user }: Props) {
    const { onOpen } = useInterface()
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


    return (
        <div className="navbar bg-white  lg:max-w-[95%] mx-auto">
            <div className="navbar-start hidden lg:flex items-center gap-3">
                <div className="cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${user?.imageUrl})` }}></div>
                <div className='flex-col gap-1 items-center justify-start'>
                    <p className='text-xs font-semibold'>{user.userName}</p>
                    <p className='text-xs'>{user.email}</p>
                </div>
            </div>
            <div className="navbar-end flex gap-2">
                <div>
                    <SlOptions />
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
                                    Create Account
                                </a>
                            </Button>
                        </>
                    )
                }
            </div>
        </div>
    )

}

