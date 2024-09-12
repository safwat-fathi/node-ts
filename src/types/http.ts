import { TUnknownObject } from "./utils";

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export type THttpError = {
  status: HttpStatusCode;
  success: false;
  message: string;
  errors: TUnknownObject[];
};

export type THttpSuccess<T = TUnknownObject> = {
  success: true;
  message: string;
  data?: T;
};

export type THttp<T> = THttpError | THttpSuccess<T>;
