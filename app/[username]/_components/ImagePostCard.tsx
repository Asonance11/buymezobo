import { SocialMediaIcon } from '@/components/Profile/SocialMediaLinkComponent';
import { Button } from '@/components/ui/button';
import { getCreatorByName } from '@/lib/creator';
import queryKeys from '@/query-key-factory';
import { useInterface } from '@/store/InterfaceStore';
import { useUser } from '@/store/UserDataStore';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { ProfileTagsOptions } from '@/lib/tagsOptions';
import { FiEdit } from 'react-icons/fi';
import PostImageComponent from '@/components/Posts/Post';
import Link from 'next/link';

interface Props {
    creatorname: string;
}

export const ImagePostCard = ({ creatorname }: Props) => {
    const { onOpen } = useInterface();
    const [isTheSameUser, setIsTheSameUser] = useState(false);

    const { loggedInUser } = useUser();

    useEffect(() => {
        if (creator?.id == loggedInUser?.id) {
            setIsTheSameUser(true);
        }
    }, [loggedInUser?.id]);

    const { data: creator, isLoading } = useQuery({
        queryKey: queryKeys.user.getByName(creatorname),
        queryFn: () => getCreatorByName(creatorname),
        enabled: !!creatorname,
        refetchOnWindowFocus:false
    });

    if (isLoading || !creator || creator.posts.length == 0) {
        return null;
    }

    return (
        <div className="transition-all duration-300 p-5 md:p-7 lg:p-8 w-screen md:w-[32rem] lg:w-[33rem] rounded-none md:rounded-2xl bg-white flex flex-col gap-3 items-start h-fit ">
            {creator.posts.length > 0 ? (
                <>
                    {' '}
                    <p className="tracking-tight font-semibold text-gray-900">Gallery</p>
                    <PostImageComponent post={creator.posts[0]} />{' '}
                </>
            ) : null}
            {creator.posts.length > 1 ? (
                <Link className="w-full" href={`/${creator.userName}/gallery`}>
                    <Button className="w-full" variant={'ghost'}>
                        See more photos
                    </Button>
                </Link>
            ) : (
                <div></div>
            )}
        </div>
    );
};
