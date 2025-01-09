import { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/hooks/use-toast";

export const useExpenseForm = () => {
  const { addExpense } = useExpenses();
  const { toast } = useToast();
  
  const [description, setDescription] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCostCenter, setNewCostCenter] = useState("");
  const [ddiCode, setDdiCode] = useState({
    part1: "",
    part2: "",
    part3: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [costCenters, setCostCenters] = useState<string[]>(["600-500-140", "600-600-300"]);

  const handleAddNewCostCenter = () => {
    if (newCostCenter.trim()) {
      if (costCenters.includes(newCostCenter.trim())) {
        toast({
          title: "Error",
          description: "Este centro de costo ya existe",
          variant: "destructive",
        });
        return;
      }
      
      setCostCenters([...costCenters, newCostCenter.trim()]);
      setCostCenter(newCostCenter.trim());
      setNewCostCenter("");
      setIsAddingNew(false);
      
      toast({
        title: "Centro de costo agregado",
        description: "El nuevo centro de costo ha sido agregado exitosamente",
      });
    }
  };

  const handleDDIInputChange = (
    part: 'part1' | 'part2' | 'part3',
    value: string,
    maxLength: number,
    nextRef?: React.RefObject<HTMLInputElement>
  ) => {
    const numericValue = value.replace(/\D/g, '');
    
    setDdiCode(prev => ({
      ...prev,
      [part]: numericValue
    }));

    if (numericValue.length >= maxLength && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const handleCostCenterChange = (value: string) => {
    if (value === "new") {
      setIsAddingNew(true);
    } else {
      setCostCenter(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !costCenter || !amount) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const formattedDdiCode = `DDI-${ddiCode.part1}-${ddiCode.part2}-${ddiCode.part3}`;

    try {
      await addExpense({
        description,
        costCenter,
        amount: parseFloat(amount),
        date,
        ddiCode: formattedDdiCode,
      });

      // Reset form
      setDescription("");
      setCostCenter("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setDdiCode({ part1: "", part2: "", part3: "" });

      toast({
        title: "Gasto agregado",
        description: "El gasto ha sido guardado exitosamente",
      });
    } catch (error) {
      console.error('Error al guardar el gasto:', error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar el gasto",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    description,
    setDescription,
    costCenter,
    amount,
    setAmount,
    date,
    setDate,
    isAddingNew,
    newCostCenter,
    setNewCostCenter,
    ddiCode,
    isSubmitting,
    costCenters,
    handleAddNewCostCenter,
    handleDDIInputChange,
    handleCostCenterChange,
    handleSubmit
  };
};