import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { getCreatorByName } from '@/lib/creator';
import { db } from '@/lib/database';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
	params: { articleId: string };
	//searchParams: { [key: string]: string | string[] | undefined }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const slug = params.articleId;

	const article = await db.article.findFirst({
		where: {
			id: slug,
		},
		include: {
			profile: true,
		},
	});

	return {
		title: article?.title,
		description: `${article?.profile?.userName} has something you should read`,
		openGraph: {
			title: article?.title,
			description: `${article?.profile?.userName} has something you should read`,
			images: article?.image
				? article?.image
				: 'https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
	};
}

export default async function ArticleLayout({ children, params }: { children: React.ReactNode; params: any }) {
	return <main>{children}</main>;
}
