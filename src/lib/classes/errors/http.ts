export class HttpError extends Error {
  status: number;
  success: boolean;
  message: string;
  errors: (Record<string, never> | object)[];

  constructor(status: number, message: string, errors?: (Record<string, never> | object)[]) {
    super(message);

    this.success = false;
    this.status = status;
    this.message = message;
    this.errors = <(Record<string, never> | object)[]>errors;
  }
}
