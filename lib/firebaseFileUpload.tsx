import { ref, uploadBytesResumable, getDownloadURL, getStorage } from '@firebase/storage';

type ProgressCallback = (progress: number) => void;
type SuccessCallback = (downloadURL: string) => void;
type ErrorCallback = (error: Error) => void;

export function uploadImage(
	file: File,
	onProgress: ProgressCallback,
	onSuccess: SuccessCallback,
	onError: ErrorCallback,
): void {
	const storage = getStorage();

	const metadata = {
		contentType: file.type,
	};

	const storageRef = ref(storage, 'images/' + file.name);
	const uploadTask = uploadBytesResumable(storageRef, file, metadata);

	uploadTask.on(
		'state_changed',
		(snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			onProgress(progress);
		},
		(error) => {
			onError(error);
		},
		() => {
			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				onSuccess(downloadURL);
			});
		},
	);
}
