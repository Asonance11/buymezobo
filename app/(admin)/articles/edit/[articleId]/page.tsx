'use client';

import Editor from '@/components/Editor/Editor';
import ProfileCardComponent from '@/components/Profile/ComponentCard';
import UserButton from '@/components/Profile/UserButton';
import Loader from '@/components/common/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FileUploader from '@/lib/fileUploader';
import { ArticlePrimitive } from '@/types/primitives';
import { Block } from '@blocknote/core';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Page(props: any) {
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
        console.log(title, blocks)
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

	const date = moment(article.createdAt).format('MMMM Do YYYY, h:mm:ss a'); // June 10th 2024, 6:43:57 pm

	return (
		<main className="p-5">
			<section className="w-5/6 lg:w-2/3 mx-auto space-y-5">
				<section className="space-y-3">
					<div className="flex justify-end items-center gap-2">
						<FileUploader simple={true} storageRefDir="images" onUploadSuccess={updateImage} />
						<Button disabled={loading} onClick={onSaveDraft} variant={'outline'}>
							Save draft
						</Button>
						<Button disabled={loading} onClick={onPublishArticle} variant={'default'}>
							Publish Article
						</Button>
					</div>
					{headerImage ? (
						<div
							className="flex gap-3  bg-red-400 h-40 lg:h-56 bg-center bg-cover bg-no-repeat "
							style={{ backgroundImage: `url(${headerImage})` }}
						></div>
					) : null}

					<div className="flex items-center justify-center">
						<Input className="ring-none focus:ring-none w-fit" value={title} onChange={onChangeTitle} />
					</div>
				</section>
				<div className="py-2 rounded-lg bg-white">
					<Editor readOnly={false} initialValues={article.content} onEditorChange={onChangeBlocks} />
				</div>
			</section>
		</main>
	);
}
//<Editor readOnly={false} onEditorChange={onChangeBlocks} />
