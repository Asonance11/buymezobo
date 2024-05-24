import { useInterface } from '@/store/InterfaceStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import { HeaderImageUpload } from '../tools/HeaderUploadButton';
import { TextInput } from '../ui/TextInput';
import { Input } from '../ui/input';
import { Toaster, toast } from 'sonner';
import axios from 'axios';

export const MakeImagePostModal = () => {
	const { isOpen, data, onClose, type } = useInterface();
	const open = isOpen && type == 'makeImagePostModal';
	const [loading, setLoading] = useState(false);
	const { creator } = data;
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const formSchema = z.object({
		title: z.string(),
		caption: z.string(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const updateImage = (image: string) => {
		setImageUrl(image);
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const data = { imageUrl, ...values };
		try {
			setLoading(true);
			await axios.post('/api/posts', data);
			toast.success('Post was successfully uploaded');
			form.reset();
			onClose();
		} catch (error) {
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogDescription>
					<p>Edit {creator?.userName} page</p>
				</DialogDescription>
				<div className="flex ">
					<HeaderImageUpload
						setLoading={setLoading}
						value={creator?.headerImageUrl!}
						onChange={updateImage}
						endpoint="Image"
					/>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field} />
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
									<FormLabel>Caption</FormLabel>
									<FormControl>
										<Textarea className="resize-none" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button disabled={loading} type="submit">
							Upload Post
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
