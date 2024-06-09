import { useInterface } from '@/store/InterfaceStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Button, buttonVariants } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import FileUploader from '@/lib/fileUploader';
import { Label } from '../ui/label';

export default function MakeImagePostModal() {
	const { isOpen, data, onClose, type } = useInterface();
	const open = isOpen && type == 'makeImagePostModal';
	const [loading, setLoading] = useState(false);
	const { creator } = data;
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const formSchema = z.object({
		title: z.string(),
		caption: z.string(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const postImageMutation = useMutation({
		mutationFn: async (data: { title: string; caption: string; imageUrl: string | null }) => {
			const response = await fetch('/api/posts', { body: JSON.stringify(data), method: 'POST' });
			if (response.status > 299) throw new Error(response.statusText);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.post.all });
			form.reset();
			close();
			toast.success('Post was successfully uploaded');
		},
		onError: (error) => {
			toast.error('Failed to upload post');
			throw error;
		},
	});

	const updateImage = (image: string) => {
		setImageUrl(image);
		setLoading(false);
	};

	const onProgess = () => {
		setLoading(true);
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const data = { imageUrl, ...values };
		postImageMutation.mutate(data);
	}

	const close = () => {
		setImageUrl(null);
		onClose();
	};

	return (
		<Dialog open={open} onOpenChange={close}>
			<DialogContent>
				<DialogDescription>
					<p>Add image</p>
				</DialogDescription>
				<div className="flex items-center justify-center ">
					<FileUploader storageRefDir="images" onUploadSuccess={updateImage} onProgress={onProgess} />
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className='hidden'>Title</FormLabel>
									<FormControl>
										<Input {...field} placeholder='Title' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="caption"
							render={({ field }) => (
								<FormItem>
									<FormLabel className='hidden'>Caption</FormLabel>
									<FormControl>
										<Textarea className="resize-none" {...field} placeholder='Description' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button disabled={loading || postImageMutation.isPending} type="submit" className='w-full'>
                        Publish 
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
