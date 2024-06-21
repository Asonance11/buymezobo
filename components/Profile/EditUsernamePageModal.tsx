import { useInterface } from '@/store/InterfaceStore';
import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { MultiValue} from 'react-select';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Optional } from '@prisma/client/runtime/library';
import { updateProfile } from '@/actions/profile';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button} from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import { User } from 'lucia';
import { ProfileTagsOptions } from '@/lib/tagsOptions';
import { toast } from 'sonner';
import { getCreatorTags } from '@/actions/tags';

export default function EditUsernamePageModal() {
	const { isOpen, type, data, onClose } = useInterface();
	const open = isOpen && type === 'editUsernamePage';
	const { creator } = data;

	const [loading, setLoading] = useState(false);
	const [tags, setTags] = useState<MultiValue<{ label: string; value: string }>>([]);

	const formSchema = z.object({
		bio: z.string().optional(),
		tags: z.array(z.string()).optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	useEffect(() => {
		const addBioFirst = async () => {
			setLoading(true);
			form.setValue('bio', creator?.bio ?? creator?.bio!);

			if (!creator) {
				return null;
			}

			const fetchedTags = await getCreatorTags(creator?.id);
			const formattedTags = fetchedTags.map((tag: string) => {
				const foundTag = ProfileTagsOptions.find((option) => option.value === tag);
				return foundTag ? { label: foundTag.label, value: foundTag.value } : { label: tag, value: tag };
			});

			setTags(formattedTags);
			setLoading(false);
			// try {
			// } catch (error) {
			// } finally {
			// }
		};
		if (open) {
			addBioFirst();
		}
	}, [open]);

	const handleChange = (e: MultiValue<{ label: string; value: string }>) => {
		setTags(e);
	};

	function onSubmit(values: z.infer<typeof formSchema>) {
		const data: Optional<User> = {
			id: creator?.id,
			tags: tags.map((tag) => tag.value),
			...values,
		};
		onSubmitFinally(data);
	}

	const onSubmitFinally = async (data: Partial<User>) => {
		setLoading(true);

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
			loading: 'Updating profile...',
			success: 'Profile updated successfully!',
			error: 'An error occurred while updating the profile.',
		});

		try {
			await updateProfilePromise;
			onClose();
		} catch (error) {
			console.error('Error updating profile:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogDescription className="handle">
					<p>Edit {creator?.userName} page</p>
				</DialogDescription>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
						<div className="space-y-1.5">
							<FormLabel>Tags</FormLabel>
							<CreatableSelect
								isDisabled={loading}
								className="bg-purple-500"
								isMulti
								options={ProfileTagsOptions as any}
								value={tags}
								onChange={(e) => handleChange(e)}
							/>
							<FormDescription>
								if a tag you resonate with is missing, create it or contact support to add it to the
								options for you and others.
							</FormDescription>
						</div>
						<div className="w-full flex items-center justify-end gap-2">
							<Button variant={'secondary'} onClick={onClose} type="button">
								Cancel
							</Button>

							<Button disabled={loading} type="submit">
								Update Profile Info
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
