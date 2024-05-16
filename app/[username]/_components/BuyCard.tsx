import { PaystackButton, usePaystackPayment } from 'react-paystack';
import { PaymentStatus, Profile, Support } from '@prisma/client';
import React, { HTMLAttributes, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import ZoboAmountPicker from '@/components/tools/ZoboAmountPicker';
import { ZoboPrice } from '@/lib/zobo';
import { CONFIG } from '@/utility/config';
import { HookConfig } from 'react-paystack/dist/types';
import { cn } from '@/utility/style';
import { Optional } from '@prisma/client/runtime/library';
import axios from 'axios';
import SuccessFeedback from './SuccessFeedback';
import { toast } from 'sonner';
import { User } from 'lucia';

interface Props extends HTMLAttributes<HTMLDivElement> {
	creator: User;
	setReload: () => void;
}
export default function BuyCard({ creator, className, setReload }: Props) {
	const [loading, setLoading] = useState(false);
	const [amountToPay, setAmountToPay] = useState(0);
	const [success, setSuccess] = useState(false);
	const [finalAmount, setFinalAmount] = useState(amountToPay * ZoboPrice);

	const setFinalAmountFunction = (amount: number) => {
		setFinalAmount(amount * ZoboPrice);
		setAmountToPay(amount);
	};

	const formSchema = z.object({
		name: z.string(),
		content: z.string(),
		privateMessage: z.boolean().default(false),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { content: '', name: '', privateMessage: false },
	});
	const preHandleSuccessAction = (reference: any) => {
		handleSuccessAction(reference);
	};

	const handleSuccessAction = async (reference: any) => {
		let data: Optional<Support>;

		data = {
			profileId: creator.id,
			name: form.getValues('name'),
			anonymous: form.getValues().privateMessage,
			content: form.getValues('content'),
			amount: finalAmount, //TODO: we need to create a monetisation model, how will we make money ourselves
			numberOfZobo: amountToPay,
			paymentStatus: PaymentStatus.COMPLETED,
			paymentRef: reference.reference,
		};

		try {
			const response = await axios.post('/api/support', data);
			//TODO: add after support action like thank the user, show some more content, etc
			setSuccess(true);
			setReload();
			//TODO: sonner over here
			console.table(response.data);
			form.reset({ content: '', name: '', privateMessage: false });
		} catch (error) {
			toast.error('An error occured');
		}
	};

	const handlePaystackCloseAction = () => {
		console.log('closed');
	};

	const config: HookConfig = {
		email: creator.email,
		amount: finalAmount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
		publicKey: CONFIG.paystack_public_key!,
	};

	const initializePayment = usePaystackPayment(config);

	function onSubmit(values: z.infer<typeof formSchema>) {
		initializePayment({ onSuccess: preHandleSuccessAction, onClose: handlePaystackCloseAction });
	}

	const nairaSymbol = '₦';

	return (
		<div
			className={cn(
				`transition-all duration-300 p-7 md:p-10 w-[27rem] md:w-[33rem] rounded-2xl bg-white flex flex-col gap-3 items-start h-fit`,
				className,
			)}
		>
			<div>
				<p className="font-bold text-xl -tracking-wide">Buy {creator.userName} Zobo</p>
			</div>
			<ZoboAmountPicker setAmount={setFinalAmountFunction} amount={amountToPay} creator={creator} />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input className="w-full resize-none" {...field} placeholder="Name or alias" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										className="w-full resize-none"
										{...field}
										placeholder="Say something nice"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="privateMessage"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
								<FormControl>
									<Checkbox checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>Make this message a private message</FormLabel>
									<FormDescription>
										The message will be visible to you and the creator only
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>
					<Button disabled={loading} className="w-full font-semibold " type="submit">
						Support {nairaSymbol + finalAmount}
					</Button>
				</form>
			</Form>
			<SuccessFeedback open={success} onClose={() => setSuccess(false)} />
		</div>
	);
}
