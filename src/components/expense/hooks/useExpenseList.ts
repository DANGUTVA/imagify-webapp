import { useState } from "react";
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

  const [selectedCostCenter, setSelectedCostCenter] = useState<string>("all");

  const filteredExpenses = selectedCostCenter === "all"
    ? expenses
    : expenses.filter(expense => expense.costCenter === selectedCostCenter);

  const uniqueCostCenters = Array.from(new Set(expenses.map(expense => expense.costCenter)));

  return {
    expenses: filteredExpenses,
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
    handleViewImage,
    costCenters: uniqueCostCenters,
    selectedCostCenter,
    setSelectedCostCenter
  };
};