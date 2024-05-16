import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { db } from './database';

const adapter = new PrismaAdapter(db.session, db.profile);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		// this sets cookies with super long expiration
		// since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
		expires: false,
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === 'production',
		},
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			email: attributes.email,
			firstName: attributes.firstName,
			lastName: attributes.lastName,
			id: attributes.id,
			userName: attributes.userName,
			imageUrl: attributes.imageUrl,
			bio: attributes.bio,
			headerImageUrl: attributes.headerImageUrl,
			balance: attributes.balance,
			transferRecipientCode: attributes.transferRecipientCode,
			bankCode: attributes.bankCode,
			bankAccountName: attributes.bankAccountName,
			accountNumber: attributes.accountNumber,
		};
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
	firstName?: string;
	lastName?: string;
	id: string;
	userName?: string;
	imageUrl: string;
	headerImageUrl?: string;
	bio?: string;
	balance: number;
	transferRecipientCode?: string;
	bankCode?: string;
	bankAccountName?: string;
	accountNumber?: string;
}
