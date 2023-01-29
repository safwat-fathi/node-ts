declare namespace Express {
  export interface Request {
    session: {
      loggedIn: boolean;
    };
  }
}
