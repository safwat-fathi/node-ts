export class HttpError extends Error {
	status: number;
	success: boolean;
	message: string;
	errors: any[];

	constructor(status: number, message: string, errors?: any[]) {
		super(message);

		this.success = false;
		this.status = status;
		this.message = message;
		this.errors = <any[]>errors;
	}
}
