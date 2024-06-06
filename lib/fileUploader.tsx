import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, StorageReference } from 'firebase/storage';
import { firebaseStorage } from './firebaseConfig';

type FileUploaderProps = {
	hidden?: boolean;
	accept?: string;
	storageRefDir: string;
	onUploadStart?: () => void;
	onUploadError?: (error: Error) => void;
	onUploadSuccess?: (downloadURL: string) => void;
	onProgress?: (progress: number) => void;
};

const FileUploader: React.FC<FileUploaderProps> = function ({
	hidden = false,
	accept = 'image/*',
	storageRefDir,
	onUploadStart,
	onUploadError,
	onUploadSuccess,
	onProgress,
}) {
	const [uploading, setUploading] = useState<boolean>(false);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const file = event.target.files?.[0];
		if (file) {
			uploadFile(file);
		}
	}

	function uploadFile(file: File): void {
		if (onUploadStart) {
			onUploadStart();
		}
		setUploading(true);

        const storageRef = ref(firebaseStorage, `${storageRefDir}/${file.name}`)


		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			function (snapshot) {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				if (onProgress) {
					onProgress(progress);
				}
			},
			function (error) {
				setUploading(false);
				if (onUploadError) {
					onUploadError(error);
				}
			},
			function () {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setUploading(false);
					if (onUploadSuccess) {
						onUploadSuccess(downloadURL);
					}
				});
			},
		);
	}

	return <input type="file" hidden={hidden} accept={accept} onChange={handleFileChange} />;
};

export default FileUploader;
