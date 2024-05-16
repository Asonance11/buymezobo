import { Profile } from '@prisma/client';
import React, { HTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { useInterface } from '@/store/InterfaceStore';
import { truncateText } from '@/utility/text';
import { User } from 'lucia';

interface Props extends HTMLAttributes<HTMLDivElement> {
	profile: User;
}

export default function CreatorSearchButton({ profile, ...props }: Props) {
	const router = useRouter();
	const { onClose } = useInterface();

	const selectCreactor = () => {
		onClose();
		router.push(`/${profile.userName}`);
	};

	return (
		<div
			{...props}
			onClick={selectCreactor}
			onSelect={selectCreactor}
			className="p-3 flex items-center gap-2.5 cursor-pointer px-4 hover:bg-zinc-100 transition-colors duration-200"
		>
			<div
				className="cursor-pointer rounded-full w-7 h-7 bg-center bg-cover bg-no-repeat"
				style={{ backgroundImage: `url(${profile?.imageUrl})` }}
			></div>
			<div className="flex-col gap-1 items-center justify-start">
				<p className="text-xs font-semibold">{profile.userName}</p>
				<p className="text-xs">{truncateText(profile.bio ? profile.bio : '', 50)}</p>
			</div>
		</div>
	);
}
