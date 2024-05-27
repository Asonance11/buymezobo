'use client';
import { cn } from '@/utility/style';
import { Profile } from '@prisma/client';
import React, { HTMLAttributes } from 'react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { formatNumberWithCommas } from '@/utility/text';
import { useInterface } from '@/store/InterfaceStore';
import { useUser } from '@/store/UserDataStore';
import { Skeleton } from '../ui/skeleton';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function PayoutEarningPage({ className }: Props) {
	const nairaSymbol = '₦';

	const { onOpen } = useInterface();
	const { loggedInUser } = useUser();
	console.log(loggedInUser);
	return (
		<div className={cn(`py-6 px-5 rounded-lg bg-white`, className)}>
			{!loggedInUser ? (
				<Skeleton className="w-full h-full min-h-[200px]" />
			) : (
				<>
					{!loggedInUser.transferRecipientCode ? (
						<>
							<div className="flex flex-col items-start gap-4 p-4 bg-red-100 rounded-lg">
								<p className="font-semibold text-base lg:text-xl tracking-tight">
									Enter your payout info to start accepting payments{' '}
								</p>
								<p className="font-light text-zinc-700 text-xs md:text-sm tracking-tight">
									To enable payouts, you will need to provide your bank details to our payment
									partner. Rest assured, your information is secure and will be encrypted on our
									servers.{' '}
								</p>
								<div className="flex items-center gap-4">
									<Button
										onClick={() => {
											onOpen('payoutInfoModal', { creator: loggedInUser });
										}}
										className="bg-zinc-950 text-sm"
									>
										Update your payout info
									</Button>
									<p className="hidden md:block text-sm font-light text-zinc-700">
										It takes less than 3 minutes
									</p>
								</div>
							</div>
							<Separator className="my-6" />
						</>
					) : null}
					<div className="flex items-start justify-between">
						<div className="flex flex-col justify-center items-start gap-2">
							<div className="flex items-center justify-start gap-3">
								<p className="-tracking-wide text-xs md:text-sm text-zinc-600 font-light">
									CURRENT BALANCE
								</p>
							</div>
							<p className="text-xl lg:text-5xl font-bold">
								{nairaSymbol}
								{formatNumberWithCommas(loggedInUser.balance)}
							</p>
						</div>
						<Button
							onClick={() => {
								onOpen('withdrawPayoutModal');
							}}
							className="bg-zinc-950 disabled:bg-zinc-500 text-xs md:text-sm"
							disabled={!loggedInUser.transferRecipientCode}
						>
							Withdraw
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
