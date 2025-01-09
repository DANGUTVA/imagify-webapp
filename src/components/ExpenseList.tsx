import { useState, useEffect } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExpenseTable } from "./expense/ExpenseTable";
import { ImagePreviewDialog } from "./expense/ImagePreviewDialog";
import { EditExpenseDialog } from "./expense/EditExpenseDialog";
import { Expense } from "@/types/expense";

export const ExpenseList = () => {
  const { expenses, deleteExpense, editExpense } = useExpenses();
  const costCenters = ["600-500-140", "600-600-300"];
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

      if (error) {
        throw error;
      }

      // Update the context with the fetched expenses
      data?.forEach(expense => {
        // Create a complete expense object with all required fields
        const completeExpense: Expense = {
          id: expense.id,
          description: expense.description || '',
          costCenter: expense.costCenter,
          amount: expense.amount || 0,
          date: expense.date || '',
          ddiCode: 'DDI-000-000-000', // Default DDI code
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
      // Delete associated image if exists
      try {
        await supabase.storage
          .from('receipts')
          .remove([`receipt-${id}.jpg`]);
      } catch (error) {
        console.error('Error al eliminar la imagen:', error);
      }

      // Delete from local state and database
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
      // Update in Supabase
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

      if (error) {
        throw error;
      }

      // Update local state
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
      setSelectedImage(null);

      const { data: existsData, error: existsError } = await supabase.storage
        .from('receipts')
        .list('', {
          search: `receipt-${expenseId}.jpg`
        });

      if (existsError) {
        throw new Error('Error al verificar la imagen');
      }

      if (!existsData || existsData.length === 0) {
        throw new Error('No se encontró la imagen');
      }

      const { data: urlData, error: urlError } = await supabase.storage
        .from('receipts')
        .createSignedUrl(`receipt-${expenseId}.jpg`, 60);

      if (urlError || !urlData?.signedUrl) {
        throw new Error('Error al obtener la URL de la imagen');
      }

      const response = await fetch(urlData.signedUrl);
      if (!response.ok) {
        throw new Error('Error al acceder a la imagen');
      }

      setSelectedImage(urlData.signedUrl);
      setIsImageDialogOpen(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar la imagen",
        variant: "destructive",
      });
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Lista de Gastos</h2>
      
      <ExpenseTable
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewImage={handleViewImage}
      />

      <EditExpenseDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        expense={editingExpense}
        onSave={handleSaveEdit}
        costCenters={costCenters}
      />

      <ImagePreviewDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        imageUrl={selectedImage}
        isLoading={isLoadingImage}
      />
    </div>
  );
};