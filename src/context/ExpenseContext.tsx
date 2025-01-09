import React, { createContext, useContext, useState } from "react";
import { Expense, ExpenseContextType } from "../types/expense";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { toast } = useToast();

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select()
        .single();

      if (error) throw error;

      const newExpense = data as Expense;
      setExpenses(prev => [...prev, newExpense]);
      
      toast({
        title: "Gasto agregado",
        description: "El gasto ha sido agregado exitosamente."
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el gasto.",
        variant: "destructive"
      });
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(expenses.filter(e => e.id !== id));
      toast({
        title: "Gasto eliminado",
        description: "El gasto ha sido eliminado exitosamente."
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el gasto.",
        variant: "destructive"
      });
    }
  };

  const editExpense = async (expense: Expense) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update(expense)
        .eq('id', expense.id);

      if (error) throw error;

      setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
      toast({
        title: "Gasto actualizado",
        description: "El gasto ha sido actualizado exitosamente."
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el gasto.",
        variant: "destructive"
      });
    }
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