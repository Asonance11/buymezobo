import { getCreatorSupports } from '@/actions/support';
import PostImageComponent from '@/components/Posts/Post';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/store/UserDataStore';
import { cn } from '@/utility/style';
import { Post, Support as SupportType, Comment } from '@prisma/client';
import { User } from 'lucia';
import Link from 'next/link';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { SlOptions } from 'react-icons/sl';

import { useEventListener } from 'usehooks-ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { avatarImageUrl } from '@/utility/avatar';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';

interface Props extends HTMLAttributes<HTMLDivElement> {
    post: Post | null;
    creator: User;
    reload: boolean;
}

interface Support extends SupportType {
    comments?: Comment[];
}

// TODO: Migrate file to react query

export default function SupportersCard({ post, creator, reload, className }: Props) {
    const [supports, setSupports] = useState<Support[]>([]); // this is just criminal tbh
    const [count, setCount] = useState(0);
    const [isTheSameUser, setIsTheSameUser] = useState(false);
    const queryClient = useQueryClient();

    const [activeComment, setActiveComment] = useState<string | null>(null);
    const [commentText, setCommentText] = useState<string>('');

    const { loggedInUser } = useUser();

    const {
        data: creatorSupports,
        fetchStatus,
        status,
    } = useQuery({
        queryKey: queryKeys.support.many(),
        queryFn: () => getCreatorSupports(creator!.id),
        enabled: !!creator,
    });

    const postCommentMutation = useMutation({
        mutationFn: async (data: { userId: string | undefined; commentText: string; supportId: string }) => {
            const response = await fetch('api/support/comment', { body: JSON.stringify(data), method: 'POST' });
            if (response.status > 299) throw new Error(response.statusText);
            const result = await response.json();
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.support.all] });
            toast.message('Comment sent');
        },
        onError(error) {
            toast.error(error.message);
            throw error;
        },
    });

    const deleteSupportMutation = useMutation({
        mutationFn: async (supportId: string) => {
            const response = await fetch(`api/support/${supportId}`, { method: 'DELETE' });
            if (response.status > 299) throw new Error(response.statusText);
            const result = await response.json();
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.support.all] });
            toast.message('Support deleted successfully');
        },
        onError(error) {
            toast.error(error.message);
            throw error;
        },
    });

    useEffect(() => {
        if (creator?.id == loggedInUser?.id) {
            setIsTheSameUser(true);
        }
    }, [loggedInUser?.id]);

    useEffect(() => {
        if (fetchStatus === 'idle' && status === 'success') setSupports(creatorSupports.data);
        if (fetchStatus === 'idle' && status === 'error') toast.error('An error occurred');
    }, [fetchStatus, status]);

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
        const data = {
            userId: loggedInUser?.id,
            commentText,
            supportId,
        };
        postCommentMutation.mutate(data);
        setSupports(postCommentMutation.data);
        // Reset comment state
        setActiveComment(null);
        setCommentText('');
    };

    const deleteSupport = async (supportId: string) => {
        deleteSupportMutation.mutate(supportId);
        setSupports(deleteSupportMutation.data);
    };

    return (
        <div
            className={cn(
                `transition-all duration-300 p-5 md:p-7 lg:p-8 w-screen md:w-[32rem] lg:w-[33rem] rounded-none md:rounded-2xl bg-white flex flex-col gap-3 items-start h-fit `,
                className,
            )}
        >
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
                                    <DropdownMenuTrigger className="outline-none">
                                        <div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5">
                                            <SlOptions />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
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
            <Button className="w-full font-semibold" variant={'secondary'}>
                <Link href="/dashboard/support-history?page=1" className=" w-full h-full">
                    See all supporters
                </Link>
            </Button>
        </div>
    );
}
