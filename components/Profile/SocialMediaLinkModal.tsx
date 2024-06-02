import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { MdDeleteOutline } from 'react-icons/md';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { SocialMediaType } from '@prisma/client';
import { useInterface } from '@/store/InterfaceStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const socialMediaLinkSchema = z.object({
	type: z.nativeEnum(SocialMediaType),
	url: z.string().url(),
});

const formSchema = z.object({
	links: z.array(socialMediaLinkSchema),
});

type FormValues = z.infer<typeof formSchema>;

export default function SocialMediaLinksModal() {
	const { type, isOpen, onClose } = useInterface();
	const open = isOpen && type === 'socialMediaLinksModal';

	const { control, handleSubmit, setValue } = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { links: [] },
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'links',
	});

	useEffect(() => {
		if (open) {
			// Fetch existing links when the modal opens
			axios.get('/api/profile/socialMediaLinks').then((response) => {
				console.log(response.data.socialMediaLinks);
				if (response.data.socialMediaLinks.length > 0) {
					setValue('links', response.data.socialMediaLinks);
				} else {
					setValue('links', []);
				}
			});
		}
	}, [isOpen, type, open]);

	//const queryClient = useQueryClient();

	const linksPostMutation = useMutation({
		mutationFn: async (data: FormValues) => {
			const response = await axios.post('/api/profile/socialMediaLinks', data);
			setValue('links', response.data.links);
			if (response.status > 299) throw new Error(response.statusText);
			return;
		},
		onError(error) {
			throw error;
		},
		onSuccess: () => {
			//onClose();
			//queryClient.invalidateQueries({ queryKey: queryKeys.post.all });
		},
	});

	const { isPending, isPaused } = linksPostMutation;
	const loading = isPaused || isPending;

	const onSubmit = async (data: FormValues) => {
		console.log(data.links);
		const linkPostPromise = new Promise((resolve, reject) => {
			linksPostMutation.mutate(data, {
				onSuccess: resolve,
				onError: reject,
			});
		});

		toast.promise(linkPostPromise, {
			loading: 'Saving social media links...',
			success: 'Social media links saved successfully!',
			error: 'Failed to save social media links',
		});
	};
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="space-y-4">
				<DialogHeader>
					<DialogTitle>Social Media Links</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{fields.map((oneField, index) => (
						<div key={oneField.id} className="flex space-x-2 items-center">
							<Controller
								control={control}
								name={`links.${index}.type`}
								render={({ field }) => (
									<Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
										<SelectTrigger className="w-fit">
											<SelectValue placeholder="Select Social Media" />
										</SelectTrigger>
										<SelectContent>
											{Object.values(SocialMediaType).map((type, index) => (
												<SelectItem key={index} value={type}>{type.toLowerCase()}</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							<Controller
								control={control}
								name={`links.${index}.url`}
								render={({ field }) => <Input {...field} placeholder="Enter URL" />}
							/>
							<Button
								type="button"
								variant={'secondary'}
								className="p-1 px-2"
								onClick={() => remove(index)}
							>
								<MdDeleteOutline className="text-lg" />
							</Button>
						</div>
					))}
					<div className="space-x-3">
						<Button
							type="button"
							variant={'secondary'}
							onClick={() => append({ type: SocialMediaType.OTHER, url: '' })}
						>
							Add New Link
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
