import { UserRole } from './User';

export interface DecodedUser {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}
