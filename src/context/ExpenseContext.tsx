import React, { createContext, useContext, useState } from "react";
import { Expense, ExpenseContextType } from "../types/expense";
import { useToast } from "@/hooks/use-toast";

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      date: "2024-01-07",
      description: "Parqueo Mtto Correctivo Halcyon",
      costCenter: "600-500-140",
      amount: 6750.00,
      ddiCode: "DDI-1020-01-25"
    },
    {
      id: 2,
      date: "2024-01-09",
      description: "Parqueo mtto preventivo AMX240 Max Peralta",
      costCenter: "600-600-300",
      amount: 5000.00,
      ddiCode: "DDI-1020-01-26"
    }
  ]);
  const { toast } = useToast();

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Math.max(0, ...expenses.map(e => e.id)) + 1
    };
    setExpenses([...expenses, newExpense]);
    toast({
      title: "Gasto agregado",
      description: "El gasto ha sido agregado exitosamente."
    });
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast({
      title: "Gasto eliminado",
      description: "El gasto ha sido eliminado exitosamente."
    });
  };

  const editExpense = (expense: Expense) => {
    setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
    toast({
      title: "Gasto actualizado",
      description: "El gasto ha sido actualizado exitosamente."
    });
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, editExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};