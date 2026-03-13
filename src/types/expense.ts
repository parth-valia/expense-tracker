export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string; // ISO string
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Education',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
