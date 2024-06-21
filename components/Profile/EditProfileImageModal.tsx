import { useInterface } from '@/store/InterfaceStore';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Optional } from '@prisma/client/runtime/library';
import { updateProfile } from '@/actions/profile';
import { Button } from '@/components/ui/button';
import { User } from 'lucia';
import { toast } from 'sonner';
import FileUploader from '@/lib/fileUploader';

export default function EditProfileImageModal() {
	const { isOpen, type, data, onClose } = useInterface();
	const open = isOpen && type === 'editProfileImageMModal';
	const { creator } = data;

	const [profileImage, setprofileImage] = useState('');
	const [loading, setLoading] = useState(false);

	const updateprofileImage = (image: string) => {
		setprofileImage(image);
	};

	function onSubmit() {
		const data: Optional<User> = {
			id: creator?.id,
			imageUrl: profileImage,
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

    const onCloseclose = () => {
        setprofileImage("")
        onClose()
    }

	return (
		<Dialog open={open} onOpenChange={onCloseclose}>
			<DialogContent className="space-y-5">
				<DialogDescription className="handle">
					<p>Change profile image</p>
				</DialogDescription>
				<div className="flex items-center justify-around">
					{profileImage ? (
						<img src={profileImage} className="w-56 h-56 rounded-sm object-cover" />
					) : (
						<FileUploader
							hidden
							storageRefDir="images"
							onUploadSuccess={updateprofileImage}
							prompt="Uploade profile image"
						/>
					)}
				</div>

				<div className="w-full flex items-center justify-end gap-2">
					<Button disabled={loading} variant={'secondary'} onClick={onClose} type="button" className="hidden">
						Cancel
					</Button>

					<Button disabled={loading} type="submit" onClick={onSubmit}>
						Update profile image
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
