/* eslint-disable react-hooks/rules-of-hooks */
'use server';
import { Profile } from '@prisma/client';
import { db } from './database';
import { useAuth } from '../actions/use-auth';
import { User } from 'lucia';

//------------------------------------------------------------------------------------------------

//INFO: if someone is signed in and the profile has not been created in the db, create it.
export async function createInitialProfile(): Promise<Profile | null> {
	// const user = await currentUser();
	// if (user == null) {
	// 	return null; //INFO: means user needs to sign in
	// }
	// let profile = await getUserbyId(user?.id);
	// if (profile) {
	// 	return profile; //INFO: return the profile don't worry
	// }
	// try {
	// 	const newProfile = await db.profile.create({
	// 		data: {
	// 			userId: user.id,
	// 			firstName: user.firstName!,
	// 			lastName: user.lastName!,
	// 			passwordHash: '',
	// 			imageUrl: user.imageUrl,
	// 			email: user.emailAddresses[0].emailAddress,
	// 		},
	// 	});
	// 	return newProfile; // done
	// } catch (error) {
	// 	console.log('ERROR AT CREATEINITIALPROFILE', error);
	return null;
	// }
}

//INFO: tell us if the user has a set username or not
export async function hasUserName(): Promise<boolean> {
	const { user: profile } = await useAuth();

	if (!profile) {
		return false;
	}

	if (!profile.userName) {
		return false;
	}

	if (profile.userName?.length < 3) {
		return false;
	}

	return true;
}

//INFO: get the user currently signed in from database, if return null, no user is signed in
export async function getCurrentUser(): Promise<User | null> {
	const { user } = await useAuth();

	return user;
}

//INFO: foundation function to get user by id
export async function getUserbyId(userId: string | undefined): Promise<Profile | null> {
	if (!userId) {
		return null;
	}

	let profile: Profile | null = null;

	try {
		profile = await db.profile.findUnique({
			where: {
				userId,
			},
		});
	} catch (error) {
		console.error('Error in Get Profile by ID Function! : ', error);
	}

	return profile;
}
