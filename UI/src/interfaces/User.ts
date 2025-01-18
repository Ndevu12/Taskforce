export enum UserRole {
    ADMIN = 'admin', 
    USER = 'user'
};

export interface User {
  email: string;
  name: string;
  role: UserRole;
  profilePhoto?: string; 
}
