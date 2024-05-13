export interface Bank {
	name: string;
	slug: string;
	code: string;
	longcode: string;
	gateway: any; // You might want to specify the type of gateway if it's not always null
	pay_with_bank: boolean;
	active: boolean;
	is_deleted: boolean;
	country: string;
	currency: string;
	type: string;
	id: number;
	createdAt: string; // You might want to use Date type instead of string
	updatedAt: string; // You might want to use Date type instead of string
}

export interface BankResponse {
	status: boolean;
	message: string;
	data: Bank[];
	meta: {
		next: string | null;
		previous: string | null;
		perPage: number;
	};
}
