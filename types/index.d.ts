import { User as SchemaUser } from '../shared/schema';

declare global {
  namespace Express {
    interface User extends SchemaUser {}
  }
}

declare module 'express-session' {
  interface SessionData {
    passport: { user: number };
  }
}

declare module 'passport' {
  interface Authenticator {
    serializeUser<TUser, TID>(fn: (user: TUser, done: (err: any, id?: TID) => void) => void): void;
    deserializeUser<TID, TUser>(fn: (id: TID, done: (err: any, user?: TUser) => void) => void): void;
    authenticate(strategy: string, callback?: Function): any;
  }
}

// Using installed @types/bcrypt