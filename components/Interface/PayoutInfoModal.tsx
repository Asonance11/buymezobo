import { useInterface } from '@/store/InterfaceStore';
import React, { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bank } from '@/types/bank';
import axios from 'axios';
import { CONFIG } from '@/utility/config';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
	creator: User;
}

export default function SupportHistoryPage({ creator, className }: Props) {
	const [supports, setSupports] = useState<Support[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getSupports = async () => {
			setLoading(true);
			const [supports, error] = await getCreatorSupports(creator.id);
			if (error != null) {
				console.error(error);
				//TODO: handle error
				setLoading(false);
				return;
			}
			setSupports(supports);
			setLoading(false);
		};
		getSupports();
	}, [creator.id]);

	return (
		<div
			className={cn(
				`transition-all max-h-[40rem] overflow-y-auto duration-300 p-7 md:p-10 w-[27rem] md:w-full rounded-2xl bg-white flex flex-col gap-3 items-start h-fit`,
				className,
			)}
		>
			<Separator className="my-2" />
			<div className="spce-y-4 w-full">
				{supports.map((support) => (
					<div key={support.id} className="py-3 w-full ">
						<div className="lg:flex items-center gap-3 ">
							<div className="cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat bg-black "></div>
							<div className="flex-col space-y-1.5 items-center justify-start">
								<div>
									<p className="text-sm ">
										<span className="font-semibold">{support.name}</span> bought{' '}
										{support.numberOfZobo} {support.numberOfZobo > 1 ? 'zobos' : 'zobo'}
									</p>
								</div>
								{support.content ? (
									<div className="p-2 bg-slate-200 rounded-lg flex items-center justify-start">
										<p className="text-sm">{support.content}</p>
									</div>
								) : null}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	        banckCode: '',
        },
    });
    const handleBankSelect = (bank: any) => {
        form.setValue('banckCode', bank);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setPersonData(null);
        const data = {
            accountNumber: values.accountNumber,
            bankCode: values.banckCode,
            bankAccountName: '',
        };

        try {
            setLoading(true);
            const response = await axios.get(
                `https://api.paystack.co/bank/resolve?account_number=${values.accountNumber}&bank_code=${values.banckCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${CONFIG.paystack_key}`,
                    },
                },
            );

            const responseData = response.data;

            if (!responseData.status) {
                throw new Error('Failed to resolve bank info');
            }

            data.bankAccountName = responseData.data.account_name;
            setPersonData(data);
            console.table(data);

            console.log('Bank account resolved successfully.');
            try {
                const postResponse = await axios.post('/api/profile/payoutInfo', personData);
                console.log('POST request sent to /api/auth/aftersignup:', postResponse.data);
                if (postResponse.status === 200) {
                    onClose();
                }
            } catch (error) {
                toast.error('An error occurred');
                console.error('Error sending POST request to /api/auth/aftersignup:', error);
            }
        } catch (err) {
            toast.error('Error getting details');
            console.error('Error resolving bank account:', err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-4">
                <DialogHeader>
                    <DialogTitle>Payout info for {data.creator?.userName}?</DialogTitle>
                    <DialogDescription>
                        To enable payouts, you will need to provide your bank details to our payment partner.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account number</FormLabel>
                                    <FormControl>
                                        <Input className="" placeholder="Enter your account number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="banckCode"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Bank Account</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger onClick={() => setReadyToLoadBanks(true)} className="w-[full]">
                                            <SelectValue placeholder="Select Bank" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loading ? (
                                                <Loader />
                                            ) : (
                                                banks.map((bank) => (
                                                    <SelectItem
                                                        key={bank.code}
                                                        value={bank.code}
                                                        onSelect={handleBankSelect}
                                                    >
                                                        {bank.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {!personData && <FormDescription>choose your bank for the payout</FormDescription>}
                                    {loading ? (
                                        <Loader className="mx-auto" />
                                    ) : (
                                        <p className="text-green-700 font-bold bg-green-100 p-1">
                                            {personData ? personData.bankAccountName : ''}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={loading} type="submit">
                            {data.creator?.transferRecipientCode ? 'Update Bank Info' : 'Save Bank Info'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
