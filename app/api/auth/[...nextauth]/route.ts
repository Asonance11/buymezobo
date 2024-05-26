import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/database';
import { redirect } from 'next/navigation';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { signOut } from '@/actions/signout';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, account }) {
			// Persist the OAuth access_token to the token right after signin
			if (account) {
				token.accessToken = account.accessToken;
			}
			return token;
		},
		async session({ session, token }) {
			// Send properties to the client, like an access_token from a provider.
			session.accessToken = token.accessToken as string;
			return session;
		},
		async signIn({ user, account, profile }) {
			// Custom logic before sign in
			// Ensure that Lucia and NextAuth are in sync
			const userProfile = await db.profile.findUnique({
				where: { email: user.email! },
			});
			const userId = userProfile?.userId ?? crypto.randomUUID();
			if (!userProfile) {
				const names = user.name?.split(' ');
				const firstName = names![0];
				const lastName = names![1] ?? '';
				await db.profile.create({
					data: {
						userId,
						email: user.email!,
						firstName,
						lastName,
						imageUrl: profile?.image,
					},
				});
			}

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

			return true;
		},
	},
	secret: process.env.NEXTAUTH_SECRET!,
});

export { handler as GET, handler as POST };
