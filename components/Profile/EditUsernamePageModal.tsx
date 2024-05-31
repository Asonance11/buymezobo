import { useInterface } from '@/store/InterfaceStore';
import React, { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { ImageUpload } from '../tools/ImageUploadButton';
import { Profile } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import { updateProfile } from '@/actions/profile';
import { z } from 'zod';
import { HeaderImageUpload } from '../tools/HeaderUploadButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import { User } from 'lucia';

export default function EditUsernamePageModal() {
	const { isOpen, type, data, onClose } = useInterface();
	const open = isOpen && type === 'editUsernamePage';
	const { creator } = data;

	const [profileImage, setProfileImage] = useState(creator?.imageUrl);
	const [headerImage, setHeaderImage] = useState(creator?.headerImageUrl);
	const [loading, setLoading] = useState(false);

	const formSchema = z.object({
		bio: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	useEffect(() => {
		const addBioFirst = () => {
			form.setValue('bio', creator?.bio ?? creator?.bio!);
		};
		addBioFirst();
	}, [open]);

	const updateProfileImage = (image: string) => {
		setProfileImage(image);
	};

	const updateHeaderImage = (image: string) => {
		setHeaderImage(image);
	};

	function onSubmit(values: z.infer<typeof formSchema>) {
		const data: Optional<User> = {
			id: creator?.id,
			imageUrl: profileImage,
			headerImageUrl: headerImage,
			...values,
		};
		onSubmitFinally(data);
	}

	const onSubmitFinally = async (data: Optional<User>) => {
		// await DeleteFileFromUploadthing(creator?.imageUrl)
		// await DeleteFileFromUploadthing(creator?.headerImageUrl)

		const [profile, error] = await updateProfile(data);

		if (error) {
			return;
		}
		onClose();
	};
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogDescription>
					<p>Edit {creator?.userName} page</p>
				</DialogDescription>
				<div className="flex ">
					<ImageUpload
						setLoading={setLoading}
						value={creator?.imageUrl}
						onChange={updateProfileImage}
						endpoint="Image"
					/>
					<HeaderImageUpload
						setLoading={setLoading}
						value={creator?.headerImageUrl!}
						onChange={updateHeaderImage}
						endpoint="Image"
					/>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea className="resize-none" {...field} />
									</FormControl>
									<FormDescription>
										What do you want your supporters to know about you
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button disabled={loading} type="submit">
							Save
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
