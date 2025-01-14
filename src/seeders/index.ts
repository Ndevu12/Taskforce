import mongoose from 'mongoose';
import connectDB from '../mongooseConfig';
import { seedCategories } from './categorySeeder';
import { seedSubCategories } from './subCategorySeeder';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Database connected');

    await seedCategories();
    console.log('Categories seeded');

    await seedSubCategories();
    console.log('SubCategories seeded');

    mongoose.disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
  }
};

seedDatabase();