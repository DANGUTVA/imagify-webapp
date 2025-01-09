export interface Expense {
  id: number;
  date: string;
  description: string;
  costCenter: string;
  amount: number;
  ddiCode: string;
}

export interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: number) => void;
  editExpense: (expense: Expense) => void;
}