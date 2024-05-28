import { useInterface } from '@/store/InterfaceStore';
import React from 'react';
import { IoMdSearch } from 'react-icons/io';
import { Button } from '../ui/button';
import useIsMobile from '@/hooks/useIsMobile';
import { HiMenu } from 'react-icons/hi';
import { FaQuoteLeft } from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../lib/authentication';
import Link from 'next/link';
import UserButton from './UserButton';
import { User } from 'lucia';
import { Skeleton } from '../ui/skeleton';
import { useUser } from '@/store/UserDataStore';
import { Profile } from '@prisma/client';
import { useAuth as Auth } from '@/actions/use-auth';
import axios from 'axios';

export default function MainHeader() {
    const { onOpen } = useInterface();
    const isMobile = useIsMobile();
    const [loading, setLoading] = useState(true);
    const { loggedInUser, updateUser } = useUser();
    //console.log('checking: ', loggedInUser);
    useEffect(() => {
        const fetchProfile = async () => {
            if (!loggedInUser) {
                setLoading(true);
                const { user } = await Auth();
                updateUser(user);
            }
            setLoading(false);
        };
        fetchProfile();
        //console.log('FROM HEADER: ', profile);
    }, []);

    const openMenu = () => {
        onOpen('searchCreators');
    };

    const openSide = () => {
        onOpen('sideMenuNavigation', { creator: loggedInUser as User });
    };

    const onNotifTry = async () => {
        await axios.post('api/notification');
    };

    return (
        <div className="navbar bg-white  lg:max-w-[95%] mx-auto">
            <div className="navbar-start ">
                {isMobile ? (
                    <HiMenu className="text-2xl" onClick={openSide} />
                ) : (
                    <div className="flex items-center gap-5">
                        <div className="flex items-center justify-center w-fit gap-1">
                            <FaQuoteLeft className="text-sm" />
                            <Link href="/faq" className="text-base font-light tracking-tight">
                                faq
                            </Link>
                        </div>

                        <div className="flex items-center justify-center w-fit gap-1">
                            <IoInformationCircle className="text-base" />
                            <Link href="/about" className="text-base font-light tracking-tight">
                                about
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            <div className="navbar-center flex">
                <Logo textClassName="text-lg" />
            </div>
            <div className="navbar-end flex gap-3">
                <div
                    onClick={openMenu}
                    className="hidden xl:flex gap-1 items-center justify-start p-2 rounded-lg bg-zinc-100 "
                >
                    <IoMdSearch className="text-xl" />
                    <input
                        onClick={openMenu}
                        type="text"
                        placeholder="Search Creators"
                        className="focus:outline-none flex-1 bg-transparent text-sm font-semibold placeholder-zinc-700"
                    />
                </div>
                <Button className="my-2" onClick={onNotifTry}>
                    Test notification
                </Button>
                {loading ? (
                    <div className="flex gap-3">
                        <Skeleton className="lg:block bg-purple-300 w-[100px] p-2" />

                        <Skeleton className="lg:block bg-purple-300 w-[100px] p-2" />

                        <Skeleton className="rounded-full w-[50px] h-[50px] p-2 bg-sky-200" />
                    </div>
                ) : loggedInUser ? (
                    <>
                        <Link className="hidden lg:block" href={`/${loggedInUser.userName}`}>
                            <Button variant={'secondary'}>View page</Button>
                        </Link>

                        <Link className="hidden lg:block" href={`/dashboard`}>
                            <Button className="font-bold">Dashboard</Button>
                        </Link>

                        <UserButton />
                    </>
                ) : (
                    <>
                        <Button
                            variant={'secondary'}
                            className="hidden lg:block text-sm lg:text-base font-semibold tracking-tight"
                        >
                            <a href="/signin">Login</a>
                        </Button>
                        <Button className=" hidden lg:block rounded-lg text-sm lg:text-base font-semibold tracking-tight">
                            <a href="/signup">Sign up</a>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

