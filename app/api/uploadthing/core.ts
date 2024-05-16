import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getCurrentUser } from '@/lib/authentication';

const f = createUploadthing();

const handleAuth = () => {
	const user = getCurrentUser();
	if (!user) throw new Error('Unauthorized');
	return { user };
};

export const ourFileRouter = {
	Image: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
