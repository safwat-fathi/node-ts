import { TUnknownObject } from "@/types/utils";

import HttpError from "./http";
import { HttpStatusCode } from "@/types/http";

class NotFoundError extends HttpError {
  constructor(message: string, errors?: TUnknownObject[]) {
    super("NOT FOUND", HttpStatusCode.NOT_FOUND, message, errors);
  }
}

class ValidationError extends HttpError {
  constructor(message: string, errors?: TUnknownObject[]) {
    super("VALIDATION FAILED", HttpStatusCode.BAD_REQUEST, message, errors);
  }
}

export { NotFoundError, ValidationError };
