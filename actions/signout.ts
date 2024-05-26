'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { lucia } from '@/lib/auth';
import { useAuth } from './use-auth';
import { ActionResult } from 'next/dist/server/app-render/types';
import { useUser as updateState } from '@/store/UserDataStore';

export const signOut = async (): Promise<ActionResult> => {
	'use server';
	const { logOut } = updateState();
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { session } = await useAuth();
	if (!session) {
		return {
			error: 'Unauthorized',
		};
	}
	logOut();
	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect('/');
};
