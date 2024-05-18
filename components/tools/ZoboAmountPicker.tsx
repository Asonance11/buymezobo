import { ZoboAMountsInterface, ZoboAmounts } from '@/lib/zobo';
import { Profile } from '@prisma/client';
import { toString } from 'lodash';
import { User } from 'lucia';
import React, { useEffect, useState } from 'react';

interface Props {
	amount: number;
	setAmount: (amount: number) => void;
	creator: User;
}

export default function ZoboAmountPicker({ amount, creator, setAmount }: Props) {
	const [zoboAmounts, setZoboAmounts] = useState(ZoboAmounts);

	useEffect(() => {
		const doStuff = () => {
			setAmount(1);
		};
		doStuff();
	}, []);

	const setSeclected = (selectedAmount: number) => {
		const updatedAmounts = zoboAmounts.map((amount) => ({
			...amount,
			selected: amount.amount === selectedAmount,
		}));
		setZoboAmounts(updatedAmounts);
		setAmount(selectedAmount);
	};

	const onInputChange = (event: any) => {
		const amount = parseInt(event.target.value);
		if (event.target.value === '') {
			//setInputAmounts(null)
			const filteredAmount = zoboAmounts.filter((zobo) => {
				return zobo.selected == true;
			});
			setAmount(filteredAmount[0].amount);
			return;
		}

		if (amount > 200) {
			return;
		}
		setAmount(amount);
	};

	return (
		<div className="flex justify-center gap-4 lg:justify-around items-center p-2 lg:p-4 w-full h-28 rounded-2xl border border-zinc-300 ">
			<div className="w-8 lg:w-10 h-9 bg-purple-900"></div>

			{zoboAmounts.map((amount, index) => {
				return (
					<div
						key={index}
						onClick={() => {
							setSeclected(amount.amount);
						}}
						className={`w-12 h-12 lg:w-16 lg:h-16 transition-colors duration-300 cursor-pointer rounded-full flex items-center border-2 border-purple-900 justify-center ${amount.selected ? 'bg-purple-900' : 'bg-white'}`}
					>
						<span
							className={`text-md lg:text-xl transition-colors duration-300 font-bold ${amount.selected ? 'text-white' : 'text-purple-900'}`}
						>
							{amount.amount}
						</span>
					</div>
				);
			})}
			<div className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center p-1 bg-white border-lg border border-zinc-300 rounded-xl ">
				<input
					value={amount}
					onChange={onInputChange}
					className="w-full h-full flex items-center justify-center text-center bg-transparent focus:outline-none outline-none"
					placeholder={toString(amount)}
				/>
			</div>
		</div>
	);
}
