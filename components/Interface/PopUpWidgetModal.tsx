import { useInterface } from '@/store/InterfaceStore';
import { FaRegCopy } from 'react-icons/fa6';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import React, { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PopUpWidgetCodeProps, generatePopUpWidgetCode } from '@/lib/popup';
import { getCurrentUser } from '@/lib/authentication';
import { Button } from '../ui/button';

export default function PopUpWidgetModal() {
	const { isOpen, onClose, type, data } = useInterface();
	const [widgetCode, setWidgetCode] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	const open = isOpen && type == 'popupWidgetModal';

	const formSchema = z.object({
		message: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		const user = await getCurrentUser();
		if (!user || !user.userName) {
			return;
		}
		const data: PopUpWidgetCodeProps = { username: user.userName, ...values };
		const code = generatePopUpWidgetCode(data);
		setWidgetCode(code);
		setLoading(false);
	}

	const onCopy = () => {
		navigator.clipboard.writeText(widgetCode ? widgetCode : '');
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	const close = () => {
		form.reset();
		setWidgetCode(null);
		onClose();
	};

	return (
		<Dialog open={open} onOpenChange={close}>
			<DialogContent className="flex flex-col items-center justify-center  ">
				{!widgetCode ? (
					<section className="w-full space-y-2">
						<p className="tracking-tight font-semibold">Widget message</p>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
								<FormField
									control={form.control}
									name="message"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Textarea className="resize-none" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full" disabled={loading}>
									Generate widget
								</Button>
							</form>
						</Form>
					</section>
				) : (
					<section className="space-y-3 p-3">
						<div className="bg-zinc-900 p-4 rounded-lg">
							<code className="text-xs text-white">{widgetCode}</code>
						</div>
						<Button className="flex items-center gap-1 w-full" onClick={onCopy}>
							<FaRegCopy />
							{copied ? 'Copied' : 'Copy code'}
						</Button>
					</section>
				)}
			</DialogContent>
		</Dialog>
	);
}
