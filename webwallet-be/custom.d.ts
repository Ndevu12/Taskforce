import { IUser } from './src/types/interfaces/IUser';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
    userId?: string;
  }
}