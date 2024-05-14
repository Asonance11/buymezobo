export interface TransferResponse {
	status: boolean;
	message: string;
	data: {
		integration: number;
		domain: string;
		status: string;
		gateway_response: string | null;
		message: string;
		send_at: string;
		created_at: string;
		updated_at: string;
		id: number;
		amount: number;
		currency: string;
		fees: number;
		fees_split: null;
		transfer_code: string;
		titan_code: null;
		reference: string;
		destination: string;
		source: string;
		source_details: {
			type: string;
			id: number;
			details: {
				account_name: string;
				account_number: string;
				bank_code: string;
			};
		};
		recipient: string;
		reason: string;
		remarks: null;
		complete: boolean;
		require_approval: boolean;
		pa_request_id: null;
	};
}
