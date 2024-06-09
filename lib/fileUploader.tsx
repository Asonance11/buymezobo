import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, StorageReference } from 'firebase/storage';
import { firebaseStorage } from './firebaseConfig';
import { Progress } from 'antd';
import { toast } from 'sonner';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

type FileUploaderProps = {
	value?: string | null;
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
	value,
}) {
	const [uploading, setUploading] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	const [imageUrl, setImageUrl] = useState<string | null>(value || null);

	function uploadFile(file: File): void {
		if (onUploadStart) {
			onUploadStart();
		}
		setUploading(true);

		const storageRef = ref(firebaseStorage, `${storageRefDir}/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			function (snapshot) {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setProgress(progress);
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
					setImageUrl(downloadURL);
					if (onUploadSuccess) {
						onUploadSuccess(downloadURL);
					}
				});
			},
		);
	}

	const beforeUpload = (file: File) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			toast.error('You can only upload JPG/PNG file!');
			return false;
		}
		const isLt4M = file.size / 1024 / 1024 < 4;
		if (!isLt4M) {
			toast.error('Image must smaller than 4MB!');
			return false;
		}
		return true;
	};

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const file = event.target.files?.[0];
		if (file && beforeUpload(file)) {
			uploadFile(file);
		}
	}

	const uploadButton = (
		<label className="">
			<div className="flex flex-col items-center bg-gray-500 rounded-lg p-7 border border-gray-200">
				{uploading ? <LoadingOutlined /> : <PlusOutlined />}
				<div className="mt-2 text-gray-800">Upload image</div>
				<input hidden type="file" accept={accept} onChange={handleFileChange} />
			</div>
		</label>
	);

	return (
		<div className='bg-blue-600'>
			<div className="bg-red-900 w-20 h-20">
				{imageUrl ? <img src={imageUrl} alt="avatar" className="w-full h-full max-h-20 rounded-lg" /> : uploadButton}
			</div>
			{uploading && <Progress percent={Math.round(progress)} />}
		</div>
	);
};
export default FileUploader;
