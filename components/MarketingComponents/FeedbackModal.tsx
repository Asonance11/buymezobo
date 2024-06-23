import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import { ProfileTagsOptions } from '@/lib/tagsOptions';
import { toast } from 'sonner';
import { useInterface } from '@/store/InterfaceStore';
import { useUser } from '@/store/UserDataStore';
import { Feedback } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import axios from 'axios';

export default function FeedbackFormModal() {
	const { isOpen, onClose, type } = useInterface();
	const [loading, setLoading] = useState(false);
	const { loggedInUser } = useUser();
	const [anonymous, setAnonymous] = useState(false);

	const isModalOpen = isOpen && type == 'feedbackFormModal';

	const onModalClose = () => {
		form.reset();
		onClose();
	};

	const formSchema = z.object({
		name: z.string().min(2).max(50).optional(),
		email: z.string().email().optional(),
		content: z.string().min(10).max(500),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	if (loggedInUser) {
		form.setValue('name', loggedInUser.userName!);
		form.setValue('email', loggedInUser.email!);
	}

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		const data: Optional<Feedback> = {
			name: values?.name || null,
			email: values?.email || null,
			content: values.content,
			userId: loggedInUser?.id || null,
		};

		try {
			console.log(data);
			await axios.post('/api/feedback', data);
			toast.success('Thank you for the feedback!');
			onModalClose();
		} catch (error) {
			console.error('Error submitting feedback:', error);
			toast.error('Failed to submit feedback. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const toggleAnonymous = () => {
		setAnonymous(!anonymous);
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onModalClose}>
			<DialogContent>
				<DialogDescription className="handle">
					<p>Give Us Your Feedback</p>
				</DialogDescription>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
						{!anonymous && (
							<>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1">
											<FormLabel>Name</FormLabel>
											<FormControl>
												<input
													{...field}
													type="text"
													className="input"
													disabled={loggedInUser ? true : false}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1">
											<FormLabel>Email</FormLabel>
											<FormControl>
												<input
													{...field}
													type="email"
													className="input"
													disabled={loggedInUser ? true : false}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Feedback</FormLabel>
									<FormControl>
										<Textarea className="resize-none" {...field} />
									</FormControl>
									<FormDescription>
										We appreciate your thoughts. Please provide constructive feedback.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{loggedInUser && (
							<div className="flex items-center justify-between">
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										className="form-checkbox"
										checked={anonymous}
										onChange={toggleAnonymous}
									/>
									<span className="text-sm">Submit anonymously</span>
								</label>
							</div>
						)}
						<div className="w-full flex items-center justify-end gap-2">
							<Button variant={'secondary'} onClick={onClose} type="button">
								Cancel
							</Button>
							<Button disabled={loading} type="submit">
								Submit Feedback
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
