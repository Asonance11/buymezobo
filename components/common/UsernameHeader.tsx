import { useInterface } from "@/store/InterfaceStore"
import React, { HTMLAttributes } from 'react'
import { SlOptions } from "react-icons/sl";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/authentication";
import { Profile } from "@prisma/client";
import { cn } from "@/utility/style";
import UserButton from "./UserButton";

interface Props extends HTMLAttributes<HTMLDivElement> {
    user: Profile
}

//WARN: visitedUser is the page we are visiting, loggedInUser is the loggedin user
//TODO: make better naming conventions

export default function UserNameHeader({ user: visitedUser, className, ...props }: Props) {
    const { onOpen } = useInterface()
    const [loggedInUser, setLoggedInUser] = useState<Profile | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const loggedInUser = await getCurrentUser()
            setLoggedInUser(loggedInUser)
        }
        fetchProfile()
    }, [])

    const openMenu = () => {
        onOpen("searchCreators")
    }


    return (
        <div {...props} className={cn("w-full bg-white", className)}>
            <div className="navbar bg-white  lg:max-w-[95%] mx-auto">
                <div className="navbar-start lg:flex items-center gap-3">
                    <div className="cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${visitedUser?.imageUrl})` }}></div>
                    <div className='flex-col gap-1 items-center justify-start'>
                        <p className='text-xs font-semibold'>{visitedUser.userName}</p>
                        <p className='text-xs'>{visitedUser.email}</p>
                    </div>
                </div>
                <div className="navbar-end flex gap-2">
                    <div className="flex items-center gap-5">
                        <SlOptions />
                        {
                            loggedInUser?.id == visitedUser.id ? (
                                <Button className="hidden lg:block" onClick={() => onOpen("editUsernamePage", { creator: loggedInUser })} >Edit page</Button>
                            ) : (null)
                        }
                    </div>
                    {
                        loggedInUser ? (
                            <UserButton />
                        ) : (
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
        </div>
    )

}
