import { Profile } from '@prisma/client';

export function avatarImageUrl(profile: Profile): string {
	if (!profile) {
		return `https://api.dicebear.com/8.x/lorelei/svg?seed=${"moji"}`;
	}
	if (profile.imageUrl) {
		return profile.imageUrl;
	}

	return `https://api.dicebear.com/8.x/lorelei/svg?seed=${profile.userName}`;
}
