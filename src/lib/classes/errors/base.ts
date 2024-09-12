import { TUnknownObject } from "@/types/utils";

class BaseError extends Error {
  name: string;
  success: boolean;
  message: string;
  isOperational = true;
  errors: TUnknownObject[];

  constructor(name: string, message: string, errors?: TUnknownObject[]) {
    super(message);

    // this will set the prototype of the error object to the BaseError class and all its subclasses that extend it
    Object.setPrototypeOf(this, new.target.prototype);

    this.success = false;
    this.name = name;
    this.message = message;
    this.errors = <TUnknownObject[]>errors;

    Error.captureStackTrace(this);
  }
}

export default BaseError;
