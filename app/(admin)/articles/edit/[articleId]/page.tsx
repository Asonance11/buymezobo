'use client';

import Editor from '@/components/Editor/Editor';
import ProfileCardComponent from '@/components/Profile/ComponentCard';
import UserButton from '@/components/Profile/UserButton';
import Loader from '@/components/common/Loader';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import useIsMobile from '@/hooks/useIsMobile';
import FileUploader from '@/lib/fileUploader';
import { ArticlePrimitive } from '@/types/primitives';
import { Block } from '@blocknote/core';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { SlOptionsVertical } from 'react-icons/sl';
import { toast } from 'sonner';

export default function Page(props: any) {
	const isMobile = useIsMobile();

	const articleId = props.params.articleId;

	const [article, setArticle] = useState<ArticlePrimitive | null>(null);
	const [title, setTitle] = useState('Untitled');
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [headerImage, setHeaderImage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchArticle = async (id: string) => {
			const response = await axios.get(`/api/articles/${id}`);
			console.log(response.data.article);
			setArticle(response.data.article);
			setHeaderImage(response.data.article.image);
			setTitle(response.data.article.title);
		};
		if (articleId) {
			fetchArticle(articleId);
		}
	}, [articleId]);

	const route = useRouter();

	if (!article) {
		return <Loader />;
	}

	const onChangeBlocks = (value: any) => {
		setBlocks(value);
	};

	const onChangeTitle = (e: any) => {
		setTitle(e.target.value);
	};

	const saveArticle = async (type: any) => {
		try {
			const respose = await axios.put(`/api/articles/edit/${article?.id}`, {
				title: title,
				content: blocks,
				headerImage: headerImage,
				type,
			});
		} catch (e) {}
	};

	const onSaveDraft = async () => {
		console.log(title, blocks);
		await saveArticle('DRAFT');
		toast.success('Article added to draft');
		route.push('/articles');
	};
	const onPublishArticle = async () => {
		await saveArticle('PUBLISHED');
		toast.success('Article Published successfully');
		route.push('/articles');
	};

	const updateImage = (image: string) => {
		setHeaderImage(image);
		setLoading(false);
	};

	//const date = moment(article.createdAt).format('MMMM Do YYYY, h:mm:ss a'); // June 10th 2024, 6:43:57 pm

	const removeImage = () => {
		setHeaderImage(null);
	};

	return (
		<main className="p-5">
			<section className="w-5/6 lg:w-2/3 mx-auto space-y-5">
				<section className="space-y-3 w-full">
					<div className="flex items-center justify-between">
						<FileUploader simple={!isMobile} storageRefDir="images" onUploadSuccess={updateImage} />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5">
									<SlOptionsVertical />
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={onSaveDraft}>Save draft</DropdownMenuItem>
								<DropdownMenuItem onClick={onPublishArticle}>Publish Article</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					{headerImage ? (
						<div
							className="flex gap-3  bg-red-400 h-40 lg:h-56 bg-center bg-cover bg-no-repeat relative"
							style={{ backgroundImage: `url(${headerImage})` }}
						>
							<button
								className="absolute w-10 h-10 top-2 right-2 bg-white rounded-full p-1 flex items-center justify-center"
								onClick={removeImage}
							>
								<HiX className="w-6 h-6 text-black" />
							</button>
						</div>
					) : null}

					<div className="flex items-center justify-start w-full">
						<Input
							className="ring-none focus:ring-none w-full lg:w-fit"
							value={title}
							onChange={onChangeTitle}
						/>
					</div>
				</section>
				<div className="py-2 rounded-lg bg-white min-h-96">
					<Editor readOnly={false} initialValues={article.content} onEditorChange={onChangeBlocks} />
				</div>
			</section>
		</main>
	);
}
//<Editor readOnly={false} onEditorChange={onChangeBlocks} />
