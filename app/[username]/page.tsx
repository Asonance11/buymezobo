'use client';
import UserNameHeader from '@/components/common/UsernameHeader';
import { getCreatorByName } from '@/lib/creator';
import { Profile } from '@prisma/client';
import { useEffect, useState } from 'react';
import BuyCard from './_components/BuyCard';
import SupportersCard from './_components/SupportersCard';
import { ThreeCircles } from 'react-loader-spinner';

export default function Username(props: any) {
	const creatorname = props.params.username;
	const [creator, setCreator] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const getUser = async () => {
			const creator = await getCreatorByName(creatorname);
			setCreator(creator);
			setLoading(false);
		};
		getUser();
	}, []);

	if (!creator) {
		return null;
	}

	return (
		<main className="min-h-screen bg-red-700 flex flex-col ">
			{loading ? (
				<ThreeCircles
					visible={true}
					height="100"
					width="100"
					color="#DC2626"
					ariaLabel="three-circles-loading"
					wrapperStyle={{}}
					wrapperClass="mx-auto block"
				/>
			) : (
				<>
					<UserNameHeader className="" user={creator} />
					<section className="flex-1 bg-blue-700 w-full flex flex-col ">
						<div
							className="w-full h-72 bg-pink-500 bg-center bg-cover bg-no-repeat"
							style={{ backgroundImage: `url(${creator?.headerImageUrl})` }}
						></div>
						<div className="flex-1 flex flex-col-reverse lg:flex-row justify-center gap-3 relative items-center py-5 lg:py-3 lg:items-start bg-gray-300">
							<SupportersCard className="lg:-mt-32" creator={creator} />
							<BuyCard className="-mt-32" creator={creator} />
						</div>
					</section>
				</>
			)}
		</main>
	);
}
