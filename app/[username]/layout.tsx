import { getCreatorByName } from '@/lib/creator';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
	params: { username: string };
	//searchParams: { [key: string]: string | string[] | undefined }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const slug = params.username;
	const creator = await getCreatorByName(slug);

	if (!creator) {
		return {};
	}

	return {
		title: 'Buy ' + creator?.userName + ' zobo',
		description: 'from my website shelf',
		openGraph: {
			title: creator?.userName!,
			description: `Support ${creator.userName} by buying him zobo`,
			images: creator?.headerImageUrl!,
		},
	};
}

export default async function UserNameLayout({ children, params }: { children: React.ReactNode; params: any }) {
	const slug = params.username;
	const creator = await getCreatorByName(slug);

	if (!creator) {
		notFound();
	}

	return children;
}
