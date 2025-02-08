import { hashedPassword } from '../helpers/bycrptHashingManager';
import User from '../models/User';
import { UserRole } from '../types/enums/UserRole';
import { seedDefaultAccounts } from './accountSeeder';

const defaultUsers = [
  {
    email: 'admin@walletapp.com',
    password: 'Admin123!',
    name: 'Admin User',
    role: UserRole.ADMIN
  },
  {
    email: 'user@walletapp.com',
    password: 'User123!',
    name: 'Regular User',
    role: UserRole.USER
  },
  {
    email: 'ndevulion@gmail.com',
    password: 'Ndevu@12',
    name: 'Devulion User',
    role: UserRole.USER
  }
];

export const seedUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('Cleared existing users from the database.');

    console.log('Seeding default users...');

    // Create users one by one
    for (const userData of defaultUsers) {
      try {
        // Hash password before saving
        const hashed = await hashedPassword(userData.password);
        
        const savedUser = await User.create({
            email: userData.email,
            password: hashed,
            name: userData.name,
            role: userData.role
        }) as unknown as { _id: string, name: string, email: string };
        console.log(`Created user: ${savedUser.name}`);
        
        // Create default accounts for this user
        await seedDefaultAccounts(savedUser._id.toString());
        console.log(`Created default accounts for user: ${savedUser.name}`);
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in seedUsers:', error);
    throw error;
  }
};
