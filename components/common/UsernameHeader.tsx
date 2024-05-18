import { useInterface } from '@/store/InterfaceStore';
import React, { HTMLAttributes } from 'react';
import { SlOptions } from 'react-icons/sl';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/authentication';
import { Profile } from '@prisma/client';
import { cn } from '@/utility/style';
import UserButton from './UserButton';
import { truncateText } from '@/utility/text';
import { Logo } from './Logo';
import Link from 'next/link';
import { User } from 'lucia';

interface Props extends HTMLAttributes<HTMLDivElement> {
    user: User;
}

//WARN: visitedUser is the page we are visiting, loggedInUser is the loggedin user
//TODO: make better naming conventions

export default function UserNameHeader({ user: visitedUser, className, ...props }: Props) {
    const { onOpen } = useInterface();
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const loggedInUser = await getCurrentUser();
            setLoggedInUser(loggedInUser);
        };
        fetchProfile();
    }, []);

    const openMenu = () => {
        onOpen('searchCreators');
    };

    return (
        <div {...props} className={cn('w-full bg-white', className)}>
            <div className="navbar bg-white  lg:max-w-[95%] mx-auto">
                <div className="navbar-start lg:flex items-center gap-3">
                    <div
                        className="cursor-pointer hidden lg:block rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat border border-purple-500"
                        style={{ backgroundImage: `url(${visitedUser?.imageUrl})` }}
                    ></div>
                    <div className="flex-col gap-1  hidden lg:block items-center justify-start">
                        <p className="text-xs font-semibold">{visitedUser.userName}</p>
                        <p className="text-xs">{truncateText(visitedUser?.bio || visitedUser.email, 35)}</p>
                    </div>
                </div>
                <div className="navbar-center flex">
                    <Logo className=' hidden lg:block ' />
                </div>
                <div className="navbar-end flex gap-2">
                    <div className="flex items-center gap-5">
                        <SlOptions />
                        {loggedInUser?.id == visitedUser.id ? (
                            <Button
                                className="hidden lg:block"
                                onClick={() => onOpen('editUsernamePage', { creator: loggedInUser })}
                            >
                                Edit page
                            </Button>
                        ) : null}
                    </div>
                    {loggedInUser ? (
                        <UserButton />
                    ) : (
                        <>
                            <Button variant={'secondary'} className="text-sm lg:text-base font-semibold tracking-tight">
                                <a href="/signin">Login</a>
                            </Button>
                            <Button className="rounded-lg text-sm lg:text-base font-semibold tracking-tight">
                                <a href="/signup">Create Account</a>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
