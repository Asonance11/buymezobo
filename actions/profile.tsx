import { Profile } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import axios from 'axios';

export async function updateProfile(profile: Optional<Profile>): Promise<[Profile | null, Error | null]> {
	try {
		const response = await axios.put('api/profile', profile);
		return [response.data.profile, null];
	} catch (error) {
		return [null, error as Error];
	}
}
