import React, { useEffect, useState } from 'react';
import BuyCard from '../_components/BuyCard';
import SupportersCard from '../_components/SupportersCard';
import Loading from '../../loading';
import { ImagePostCard } from '../_components/ImagePostCard';
import { AboutCard } from '../_components/AboutCard';
import { User } from 'lucia';
import { Profile } from '@prisma/client';

interface AboutTab {
	creatorname: string;
	tabIndex: number;
	creator: Profile;
}

export default function AboutTab({ creatorname, creator, tabIndex }: AboutTab) {
	const [reloadSupporters, setReloadSupporters] = useState(false);

	useEffect(() => {
		console.log(creatorname);
	}, [creatorname]);

	return (
		<div className="w-full flex flex-col-reverse lg:flex-row justify-start md:gap-3 items-center lg:items-start ">
			<section className="flex-col flex gap-2 ">
				<AboutCard creatorname={creatorname} />
				<ImagePostCard creatorname={creatorname} />
			</section>
			<section className="flex-col flex gap-3 lg:sticky top-2">
				<BuyCard
					className=""
					creator={creator as User}
					//setReload={() => setReloadSupporters(!reloadSupporters)}
				/>
			</section>
		</div>
	);
}

/*

 <SupportersCard
                                    post={latestPost ? latestPost : null}
                                    creator={creator as User}
                                    reload={reloadSupporters}
                                />

    */
