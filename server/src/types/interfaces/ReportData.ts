import mongoose from "mongoose";
import { ITransaction } from "./ITransaction";

export interface ReportData {
    user: mongoose.Schema.Types.ObjectId;
    totalIncome: number;
    totalExpense: number;
    transactions: ITransaction[];
  }
