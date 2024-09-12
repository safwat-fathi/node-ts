import { TUnknownObject } from "@/types/utils";
import BaseError from "./base";

class HttpError extends BaseError {
  status: number;

  constructor(name: string, status: number, message: string, errors?: TUnknownObject[]) {
    super(name, message, errors);

    this.status = status;
  }
}

export default HttpError;
