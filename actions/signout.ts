'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { lucia } from '@/lib/auth';
import { useAuth } from './use-auth';
import { ActionResult } from 'next/dist/server/app-render/types';

export const signOut = async (): Promise<ActionResult> => {
	'use server';
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { session } = await useAuth();
	if (!session) {
		return {
			error: 'Unauthorized',
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect('/');
};
