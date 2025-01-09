import { useState, useEffect } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "@/types/expense";

export const useExpenseList = () => {
  const { expenses, deleteExpense, editExpense } = useExpenses();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      data?.forEach(expense => {
        const completeExpense: Expense = {
          id: expense.id,
          description: expense.description || '',
          costCenter: expense.costCenter,
          amount: expense.amount || 0,
          date: expense.date || '',
          ddiCode: expense.ddiCode || 'DDI-000-000-000',
          created_at: expense.created_at || new Date().toISOString()
        };
        editExpense(completeExpense);
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los gastos",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.storage
        .from('receipts')
        .remove([`receipt-${id}.jpg`]);

      await deleteExpense(id);
      
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

  const handleViewImage = async (expenseId: string) => {
    try {
      setIsLoadingImage(true);
      setIsImageDialogOpen(true);
      setSelectedImage(null);

      // Primero verificamos si el archivo existe
      const { data: files, error: listError } = await supabase.storage
        .from('receipts')
        .list('', {
          search: `receipt-${expenseId}`
        });

      if (listError) throw new Error('Error al buscar la imagen');
      
      if (!files || files.length === 0) {
        throw new Error('No se encontró la imagen para este gasto');
      }

      // Encontramos el archivo correcto (puede ser .jpg, .jpeg, o .png)
      const receiptFile = files.find(file => 
        file.name.startsWith(`receipt-${expenseId}`) && 
        (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png'))
      );

      if (!receiptFile) {
        throw new Error('No se encontró la imagen para este gasto');
      }

      const { data: publicUrl } = supabase.storage
        .from('receipts')
        .getPublicUrl(receiptFile.name);

      if (!publicUrl.publicUrl) {
        throw new Error('Error al obtener la URL de la imagen');
      }

      setSelectedImage(publicUrl.publicUrl);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar la imagen",
        variant: "destructive",
      });
      setIsImageDialogOpen(false);
    } finally {
      setIsLoadingImage(false);
    }
  };

  return {
    expenses,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingExpense,
    isImageDialogOpen,
    setIsImageDialogOpen,
    selectedImage,
    isLoadingImage,
    handleDelete,
    handleEdit,
    handleSaveEdit,
    handleViewImage
  };
};