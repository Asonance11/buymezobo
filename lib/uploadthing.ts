import { generateUploadButton, generateUploadDropzone } from '@uploadthing/react';
import { UTApi } from 'uploadthing/server';

import axios from 'axios';
import { OurFileRouter } from '@/app/api/uploadthing/core';

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export async function DeleteFileFromUploadthing(imageUrl: string | undefined | null): Promise<string | void> {
	if (imageUrl === undefined || imageUrl === null) {
		return;
	}
	try {
		const url = '/api/uploadthing?imageUrl=' + imageUrl;
		//return await axios.delete(url);
		const deleteValue = await axios.delete('/api/uploadthing', {
			data: {
				url: imageUrl,
			},
		});

		console.log('IMAGE HAS BEEN DELETETED');
		return deleteValue.data;
	} catch (error) {
		console.log(error as any); //NOTE:we can do something here, like store the url, and use to workers to keep deleting unused files
		return;
	}
}
