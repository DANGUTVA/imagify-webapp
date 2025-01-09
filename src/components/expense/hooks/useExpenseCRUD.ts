import { useState, useEffect } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "@/types/expense";

export const useExpenseCRUD = () => {
  const { expenses, setExpenses, deleteExpense, editExpense } = useExpenses();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        setExpenses(data as Expense[]);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los gastos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [setExpenses, toast]);

  const handleDelete = async (id: string) => {
    try {
      await supabase.storage
        .from('receipts')
        .remove([`receipt-${id}.jpg`]);

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      deleteExpense(id);
      
      toast({
        title: "Gasto eliminado",
        description: "El gasto ha sido eliminado exitosamente",
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el gasto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (updatedExpense: Expense) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          description: updatedExpense.description,
          costCenter: updatedExpense.costCenter,
          amount: updatedExpense.amount,
          date: updatedExpense.date,
          ddiCode: updatedExpense.ddiCode
        })
        .eq('id', updatedExpense.id);

      if (error) throw error;

      editExpense(updatedExpense);
      setIsEditDialogOpen(false);
      setEditingExpense(null);
      
      toast({
        title: "Gasto actualizado",
        description: "El gasto ha sido actualizado exitosamente.",
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el gasto",
        variant: "destructive",
      });
    }
  };

  return {
    expenses,
    isLoading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingExpense,
    handleDelete,
    handleEdit,
    handleSaveEdit
  };
};