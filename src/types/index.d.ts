declare namespace Express {
  export interface Request {
    session: {
      loggedIn: boolean;
    };
  }

  export interface Response {
    dataPaginated: {
      data: any[];
      meta: { current_page: number; total_pages: number; hash: string };
      links: {};
    };
  }
}
