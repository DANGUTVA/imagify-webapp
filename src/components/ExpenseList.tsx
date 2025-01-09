import { useState } from "react";
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

  const handleDelete = async (id: number) => {
    try {
      await supabase.storage
        .from('receipts')
        .remove([`receipt-${id}.jpg`]);
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    }

    deleteExpense(id);
    toast({
      title: "Gasto eliminado",
      description: "El gasto ha sido eliminado exitosamente",
    });
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedExpense: Expense) => {
    editExpense(updatedExpense);
    setIsEditDialogOpen(false);
    setEditingExpense(null);
    toast({
      title: "Gasto actualizado",
      description: "El gasto ha sido actualizado exitosamente",
    });
  };

  const handleViewImage = async (expenseId: number) => {
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