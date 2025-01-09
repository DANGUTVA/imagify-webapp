import { ExpenseTable } from "./expense/ExpenseTable";
import { ImagePreviewDialog } from "./expense/ImagePreviewDialog";
import { EditExpenseDialog } from "./expense/EditExpenseDialog";
import { useExpenseList } from "./expense/hooks/useExpenseList";

export const ExpenseList = () => {
  const {
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
  } = useExpenseList();

  const costCenters = ["600-500-140", "600-600-300"];

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