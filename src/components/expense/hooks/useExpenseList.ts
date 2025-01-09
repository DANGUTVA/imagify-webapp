import { useExpenseCRUD } from "./useExpenseCRUD";
import { useExpenseStorage } from "./useExpenseStorage";

export const useExpenseList = () => {
  const {
    expenses,
    isLoading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingExpense,
    handleDelete,
    handleEdit,
    handleSaveEdit
  } = useExpenseCRUD();

  const {
    isImageDialogOpen,
    setIsImageDialogOpen,
    selectedImage,
    isLoadingImage,
    handleViewImage
  } = useExpenseStorage();

  return {
    expenses,
    isLoading,
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