import { useInterface } from '@/store/InterfaceStore';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Optional } from '@prisma/client/runtime/library';
import { updateProfile } from '@/actions/profile';
import { Button } from '@/components/ui/button';
import { User } from 'lucia';
import { toast } from 'sonner';
import FileUploader from '@/lib/fileUploader';

export default function EditHeaderImageModal() {
	const { isOpen, type, data, onClose } = useInterface();
	const open = isOpen && type === 'editHeaderImageMModal';
	const { creator } = data;

	const [headerImage, setHeaderImage] = useState('');
	const [loading, setLoading] = useState(false);

	const updateHeaderImage = (image: string) => {
		setHeaderImage(image);
	};

	function onSubmit() {
		const data: Optional<User> = {
			id: creator?.id,
			headerImageUrl: headerImage,
		};
		onSubmitFinally(data);
	}

	const onSubmitFinally = async (data: Partial<User>) => {
		const updateProfilePromise = new Promise(async (resolve, reject) => {
			try {
				const [profile, error] = await updateProfile(data);
				if (error) {
					reject(error);
				} else {
					resolve(profile);
				}
			} catch (err) {
				reject(err);
			}
		});

		toast.promise(updateProfilePromise, {
			loading: 'Updating Cover Image...',
			success: 'Image uploaded successfully!',
			error: 'An error occurred while updating the profile.',
		});

		try {
			setLoading(true);
			await updateProfilePromise;
			onClose();
		} catch (error) {
			console.error('Error updating cover image:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogDescription className="handle">
					<p>Change cover image</p>
				</DialogDescription>
				<div className="flex items-center justify-around">
					{headerImage ? (
						<img src={headerImage} className="w-56 h-56 rounded-sm object-cover" />
					) : (
						<FileUploader
							hidden
							storageRefDir="images"
							onUploadSuccess={updateHeaderImage}
							prompt="Uploader header image"
						/>
					)}
				</div>

				<div className="w-full flex items-center justify-end gap-2">
					<Button disabled={loading} variant={'secondary'} onClick={onClose} type="button">
						Cancel
					</Button>

					<Button disabled={loading} type="submit" onClick={onSubmit}>
						Update cover image
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
