'use client';
import { getCreatorPosts } from '@/actions/posts';
import PostImageComponent from '@/components/Posts/Post';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/authentication';
import { useInterface } from '@/store/InterfaceStore';
import { Post } from '@prisma/client';
import { User } from 'lucia';
import React, { useEffect, useState } from 'react';
import GallerySection from '@/components/AdminComponents/GallerySection';

export default function Page() {
    const { onOpen } = useInterface();
    const [creator, setCreator] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [latestPost, setLatestPost] = useState<Post[] | null>(null);

    useEffect(() => {
        const getPost = async () => {
            setLoading(true);
            const post = await getCreatorPosts(creator?.id!, 0);
            setLatestPost(post);
            setLoading(false);
        };
        if (creator) {
            getPost();
        }
    }, [creator?.id, creator]);

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            const creator = await getCurrentUser();
            setCreator(creator);
            setLoading(false);
        };
        getUser();
    }, []);

    if (!creator) {
        return null;
    }

    return (
        <div className="w-11/12 lg:3/4 xl:w-2/3 mx-auto m-3 lg:my-8">
            <section className="w-full flex items-center justify-end mb-2 md:mb-3 lg:mb-5 px-2">
                <Button
                    onClick={() => onOpen('makeImagePostModal')}
                    className="-tracking-wide text-xs md:text-sm font-bold bg-purple-800 hidden"
                >
                    Make New Post
                </Button>
            </section>
            <GallerySection posts={latestPost} isImageOnly={false} />
        </div>
    );
}
