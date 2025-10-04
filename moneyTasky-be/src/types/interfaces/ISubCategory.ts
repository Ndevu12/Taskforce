import mongoose from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  category: mongoose.Schema.Types.ObjectId;
  otherCategories: string[];
}
