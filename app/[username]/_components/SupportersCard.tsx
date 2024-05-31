import { getCreatorSupports } from '@/actions/support';
import PostImageComponent from '@/components/Posts/Post';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/store/UserDataStore';
import { cn } from '@/utility/style';
import { Post } from '@prisma/client';
import { User } from 'lucia';
import Link from 'next/link';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { SlOptions } from 'react-icons/sl';

import { useEventListener } from 'usehooks-ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { avatarImageUrl } from '@/utility/avatar';
import { toast } from 'sonner';

interface Props extends HTMLAttributes<HTMLDivElement> {
    post: Post | null;
    creator: User;
    reload: boolean;
}

type GetCreatorSupportsReturn = Awaited<ReturnType<typeof getCreatorSupports>>;
type FirstElementOfGetCreatorSupports = GetCreatorSupportsReturn[0];
type SupportAndComment = Exclude<FirstElementOfGetCreatorSupports, never[] | Error | null | number>;

export default function SupportersCard({ post, creator, reload, className }: Props) {
    const [supports, setSupports] = useState<SupportAndComment>([]); // this is just criminal tbh
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [profile, setProfile] = useState<User | null>(null);
    const [isTheSameUser, setIsTheSameUser] = useState(false);

    const [activeComment, setActiveComment] = useState<string | null>(null);
    const [commentText, setCommentText] = useState<string>('');

    const { loggedInUser } = useUser();

    useEffect(() => {
        if (creator?.id == loggedInUser?.id) {
            setIsTheSameUser(true);
        }
    }, [loggedInUser?.id]);

    useEffect(() => {
        const getSupports = async () => {
            setLoading(true);
            const [supports, count, error] = await getCreatorSupports(creator.id, 5);
            if (error != null) {
                console.error(error);
                //TODO: handle error
                setLoading(false);
                return;
            }
            setCount(count as number);
            setSupports(supports as SupportAndComment);
            setLoading(false);
        };
        getSupports();
    }, [creator.id, reload]);

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setActiveComment(null);
            setCommentText('');
        }
    };

    useEventListener('keydown', onKeyDown);

    const handleCommentClick = (supportId: string) => {
        setActiveComment(activeComment === supportId ? null : supportId);
        setCommentText(''); // Reset comment text when opening a new comment box
    };

    const handleCommentSubmit = async (supportId: string) => {
        // Handle comment submission logic here
        console.log(`Comment for support ID ${supportId}: ${commentText}`);

        const data = {
            userId: loggedInUser?.id,
            commentText,
            supportId,
        };

        const response = await axios.post('api/support/comment', data);
        setSupports(response.data[0]);

        // Reset comment state
        setActiveComment(null);
        setCommentText('');
    };

    const deleteSupport = async (supportId: string) => {
        try {
            const url = `api/support/${supportId}`;
            const response = await axios.delete(url);
            setSupports(response.data[0]);
            toast.message('Support deleted successfully');
        } catch (error) {
            toast.error('Failed to delete support');
            console.error(error);
        }
    };

    return (
        <div
            className={cn(
                `transition-all duration-300 p-5 md:p-7 lg:p-8 w-screen md:w-[32rem] lg:w-[33rem] rounded-none md:rounded-2xl bg-white flex flex-col gap-3 items-start h-fit `,
                className,
            )}
        >
            <div className="space-y-1 md:space-y-3">
                <p className="text-sm md:text-lg font-bold -tracking-wide">About {creator.userName}</p>
                <p className="text-xs md:text-sm font-semibold text-zinc-500">{creator.bio}</p>
            </div>
            {post ? <PostImageComponent post={post} /> : null}
            {count > 1 ? (
                <Link className="w-full" href={`/${creator.userName}/gallery`}>
                    <Button className="w-full" variant={'ghost'}>
                        See more photos
                    </Button>
                </Link>
            ) : null}
            <Separator className="my-1 md:my-2" />
            <div className="space-y-2 md:spce-y-4 w-full">
                {supports?.map((support) => (
                    <div key={support.id} className=" w-full ">
                        <div className="md:flex items-center gap-2 ">
                            <div className="hidden md:flex cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat bg-black "></div>
                            <div className="flex-col space-y-0.5 md:space-y-1.5 items-center justify-start flex-1">
                                <div>
                                    <p className="text-xs lg:text-sm ">
                                        <span className="font-semibold">{support.name}</span> bought{' '}
                                        {support.numberOfZobo} {support.numberOfZobo > 1 ? 'zobos' : 'zobo'}
                                    </p>
                                </div>
                                {support.content ? (
                                    <div className="p-2 w-fit bg-purple-200 rounded-sm flex items-center justify-start">
                                        <p className="text-xs md:text-sm">{support.content}</p>
                                    </div>
                                ) : null}
                            </div>

                            <>
                                {/* Dropdown for comment options */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5">
                                            <SlOptions />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Share</DropdownMenuItem>
                                        {isTheSameUser ? (
                                            <>
                                                <DropdownMenuItem onClick={() => handleCommentClick(support.id)}>
                                                    Comment
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => deleteSupport(support.id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </>
                                        ) : null}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        </div>
                        <div className="w-full flex flex-col pl-6 lgpl-16">
                            {support.comments?.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="p-2 w-fit bg-red-400 rounded-sm flex items-center justify-start my-0.5 md:my-1 gap-2"
                                >
                                    <img
                                        className="cursor-pointer rounded-lg w-6 h-8 lg:w-8 lg:h-8 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
                                        src={loggedInUser?.imageUrl || avatarImageUrl(loggedInUser?.userName!)}
                                        alt="avatar"
                                    />

                                    <p className="text-xs md:text-sm">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                        {activeComment === support.id && (
                            <div className="mt-2 flex items-center gap-2">
                                <Input
                                    type="text"
                                    className="flex-1 border rounded p-2 text-sm"
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <Button className="rounded-sm" onClick={() => handleCommentSubmit(support.id)}>
                                    Submit
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Button variant={'secondary'} className="w-full font-semibold ">
                See all aupporters
            </Button>
        </div>
    );
}
