import "express-session"; // don't forget to import the original module

declare module "express-session" {
  interface SessionData {
    // userToken: string;
    loggedIn: boolean;
  }
}
