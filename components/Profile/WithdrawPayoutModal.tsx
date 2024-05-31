import { useInterface } from '@/store/InterfaceStore';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Loader from '../common/Loader';
import { toast } from 'sonner';
import { User } from 'lucia';
import { useUser } from '@/store/UserDataStore';
export default function WithdrawPayoutModal() {
	const { type, isOpen, onClose } = useInterface();
	const open = isOpen && type == 'withdrawPayoutModal';
	const [loading, setLoading] = useState(false);
	const { loggedInUser } = useUser();

	const formSchema = z.object({
		Amount: z.string(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			Amount: String(loggedInUser?.balance || ''),
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const amount = Number(values.Amount);

		if (isNaN(amount) || amount <= 0) {
			toast('Please enter a valid amount');
			return;
		}

		if (amount > loggedInUser?.balance!) {
			toast("You don't have enough balance to withdraw");
			return;
		}

		const data = {
			amount: amount * 100,
			id: loggedInUser?.id,
		};

		console.table(data);

		try {
			setLoading(true);
			const response = await axios.post('/api/support/withdraw', data);

			const responseData = response.data;

			if (!responseData.status) {
				throw new Error('Failed to transfer money');
			}
			toast.success('Withdraw successful');
		} catch (err) {
			console.error('Error with payout:', err);
			toast.error(`Error with payout: ${err}`);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="space-y-4">
				{loading ? (
					<Loader className="w-[30px] h-[30px] mx-auto block" />
				) : (
					<>
						<DialogHeader>
							<DialogTitle>Payout for {loggedInUser?.firstName}?</DialogTitle>
							<DialogDescription>
								how much do you want to withdraw from a balance of {loggedInUser?.balance}{' '}
							</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
								<FormField
									control={form.control}
									name="Amount"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input type="number" className="" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button disabled={loading} type="submit" className="bg-purple-900">
									Checkout
								</Button>
							</form>
						</Form>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
