'use client';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Editor from '@/components/Editor/Editor';
import ProfileCardComponent from '@/components/Profile/ComponentCard';
import Loader from '@/components/common/Loader';
import { ArticlePrimitive, CommentPrimitive } from '@/types/primitives';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import moment from 'moment';
import { useState } from 'react';
import { truncateText } from '@/utility/text';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { User } from 'lucia';
import Link from 'next/link';
import { useUser } from '@/store/UserDataStore';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { EmojiClickData } from 'emoji-picker-react';
import Emoji from '@/components/tools/EmojiPicker';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { avatarImageUrl } from '@/utility/avatar';
import { Profile } from '@prisma/client';
import { SendIcon } from 'lucide-react';
import queryKeys from '@/query-key-factory';

export default function Page(props: any) {
    const articleId = props.params.articleId;

    const { loggedInUser } = useUser();
    const queryClient = useQueryClient();

    const [commentInput, setCommentInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isEmojiOpen, setIsEmojiOpen] = useState(true);

    const fetchArticle = async (id: string): Promise<ArticlePrimitive> => {
        const response = await axios.get(`/api/articles/${id}`);
        return response.data.article;
    };

    const fetchComments = async (articleId: string): Promise<CommentPrimitive[]> => {
        const response = await axios.get(`/api/comments/${articleId}`);
        return response.data.comments;
    };

    const {
        data: article,
        isLoading: articleLoading,
        refetch,
    } = useQuery({
        queryKey: queryKeys.article.one(articleId),
        queryFn: () => fetchArticle(articleId),
    });

    const {
        data: comments,
        refetch: refetchComments,
        isLoading: commentsLoading,
    } = useQuery({
        queryKey: queryKeys.comments.byArticle(articleId),
        queryFn: () => fetchComments(articleId),
    });

    const mutation = useMutation({
        mutationFn: (newComment: any) =>
            axios.post(`/api/comments/`, {
                content: newComment.content,
                author: loggedInUser,
                parentId: articleId, // Use articleId directly
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.comments.byArticle(articleId)] });
            toast.success('Comment submitted');
            setCommentInput('');
            refetchComments();
            setLoading(false); // Ensure loading state is reset after successful submission
        },
        onError: () => {
            toast.error('Failed to submit your comment');
            setLoading(false); // Ensure loading state is reset after error
        },
    });

    const allLoad = articleLoading || commentsLoading || loading;

    // Ensure to use the correct loading state
    const onCommentSubmit = () => {
        setLoading(true);
        if (commentInput.length < 1) {
            toast.info('Comment cannot be empty');
            setLoading(false); // Reset loading state
            return;
        }
        if (allLoad) {
            setLoading(false); // Reset loading state
            return;
        }
        mutation.mutate({ content: commentInput });
    };
    const date = article ? moment(article.createdAt).fromNow() : '';

    const onEmojiClick = (emojiObject: EmojiClickData) => {
        const content = commentInput + emojiObject.emoji;
        setCommentInput(content);
    };

    if (articleLoading || !article) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <main className="bg-gray-100">
            <UserNameHeader user={article.profile as User} />
            <main className="w-full lg:w-2/4 mx-auto flex flex-col p-2 md:py-6 md:px-16 h-full gap-4 ">
                <section className="space-y-2">
                    <div className="mx-auto p-4">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/${article.profile.userName}`}>
                                        {article.profile.userName}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/${article.profile.userName}/articles`}>
                                        Articles
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{truncateText(article.title, 30)}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="p-4 space-y-3">
                        <p className="text-3xl font-bold -tracking-wide">{article.title}</p>
                        <div className="flex items-center justify-start gap-1.5">
                            <div
                                className="cursor-pointer rounded-lg w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
                                style={{ backgroundImage: `url(${article.profile.imageUrl})` }}
                            ></div>
                            <div>
                                <Link href={`/${article.profile.userName}`}>
                                    <p className="hover:underline font-semibold text-gray-800 cursor-pointer">
                                        @{article.profile.userName}
                                    </p>
                                </Link>
                                <p className="font-extralight text-sm text-gray-600">created at {date}</p>
                            </div>
                        </div>
                    </div>
                    {article.image && (
                        <div
                            className="flex gap-3 bg-red-400 h-40 lg:h-56 bg-center bg-cover bg-no-repeat rounded-lg"
                            style={{ backgroundImage: `url(${article.image})` }}
                        ></div>
                    )}
                    <div className="py-6 bg-white rounded-lg">
                        <Editor readOnly initialValues={article.content} previewMode />
                    </div>
                </section>
                <div className="max-w-[30rem]">
                    <ProfileCardComponent profile={article.profile} className="sticky top-2 hidden" />
                </div>
                {!loggedInUser ? (
                    <div className="w-full h-40">
                        <Button>Sign in to comment</Button>
                    </div>
                ) : (
                    <section className="p-4 flex gap-2">
                        <div
                            className="cursor-pointer rounded-lg w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
                            style={{ backgroundImage: `url(${avatarImageUrl(loggedInUser as Profile)})` }}
                        ></div>
                        <div className="border-gray-200 border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white flex-1">
                            <Textarea
                                className="resize-none border-none focus:border-none focus-visible:ring-offset-0 focus-visible:ring-0"
                                placeholder="Say something nice about this"
                                value={commentInput}
                                disabled={allLoad}
                                onChange={(e) => setCommentInput(e.target.value)}
                            />
                            <div className="w-full p-2.5 flex items-center justify-end gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="outline-none">
                                        <HiOutlineEmojiHappy className="text-xl md:text-2xl text-gray-500 focus:text-purple-700" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <Emoji open={isEmojiOpen} onEmojiClick={onEmojiClick} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    variant={'ghost'}
                                    disabled={allLoad}
                                    className="p-1.5 hover:bg-gray-100 transition-all duration-300 rounded-lg"
                                >
                                    <SendIcon
                                        onClick={onCommentSubmit}
                                        className="text-xl md:text-2xl text-gray-500 cursor-pointer"
                                    />
                                </Button>
                            </div>
                        </div>
                    </section>
                )}
                {comments && comments.length === 0 && (
                    <div className="w-full h-40">
                        <p className="text-center text-gray-600">No comments yet</p>
                    </div>
                )}
                {comments && comments.length > 0 && (
                    <section className="w-full bg-white p-4 rounded-t-lg">
                        {comments.map((comment) => (
                            <div key={comment.id} className="p-2 flex items-start gap-2 ">
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <div
                                            className="cursor-pointer rounded-full min-w-10 lg:min-w-10 min-h-10 lg:min-h-10 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
                                            style={{ backgroundImage: `url(${comment.profile.imageUrl})` }}
                                        ></div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="p-0">
                                        <ProfileCardComponent profile={comment.profile} />
                                    </HoverCardContent>
                                </HoverCard>

                                <div className="space-y-1 w-full max-w-full">
                                    <div className="flex items-center justify-start gap-2">
                                        <Link href={`/${comment.profile.userName}`}>
                                            <div className="font-semibold">@{comment.profile.userName}</div>
                                        </Link>
                                        <div className="text-xs text-gray-600">
                                            {moment(comment.createdAt).fromNow()}
                                        </div>
                                    </div>
                                    <div className="text-gray-800 text-sm max-w-full w-full overflow-hidden break-words my-2">
                                        <p>{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </main>
    );
}
