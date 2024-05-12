export interface ZoboAMountsInterface {
	amount: number;
	selected: boolean;
}

export const ZoboAmounts: ZoboAMountsInterface[] = [
	{
		amount: 1,
		selected: true,
	},
	{
		amount: 3,
		selected: false,
	},
	{
		amount: 5,
		selected: false,
	},
];

export const ZoboPrice = 1000;
