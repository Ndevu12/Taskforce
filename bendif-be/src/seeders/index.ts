import mongoose from 'mongoose';
import connectDB from '../mongooseConfig';
import { seedCategories } from './categorySeeder';
import { seedSubCategories } from './subCategorySeeder';
import { seedUsers } from './userSeeder';

const seedDatabase = async () => {
  try {
    // Connect to the database once at the beginning
    await connectDB();
    console.log('Database connected');

    // Seed categories
    await seedCategories();
    console.log('Categories seeded');

    // Seed subcategories
    await seedSubCategories();
    console.log('SubCategories seeded');

    // Seed users (which will also seed their accounts)
    await seedUsers();
    console.log('Default users seeded');

    // Only disconnect after all seeding operations are complete
    await mongoose.disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error seeding database:', error);
    // Make sure to disconnect even if there's an error
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

// Execute the seeding function
seedDatabase();