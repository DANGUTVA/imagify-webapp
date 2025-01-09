import { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DDICodeInput } from "./expense/DDICodeInput";
import { CostCenterSelect } from "./expense/CostCenterSelect";
import { ExpenseFormActions } from "./expense/ExpenseFormActions";
import { supabase } from "@/integrations/supabase/client";

export const ExpenseForm = () => {
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
      // Add to local state through context
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

  return (
    <Card className="p-4 md:p-6 mb-6 md:mb-8">
      <h2 className="text-lg font-semibold mb-4">Agregar Gasto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <CostCenterSelect 
            costCenter={costCenter}
            costCenters={costCenters}
            onValueChange={handleCostCenterChange}
          />
        </div>

        <div>
          <Input
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <DDICodeInput 
          ddiCode={ddiCode}
          onDDIChange={handleDDIInputChange}
        />

        <div>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <ExpenseFormActions onSubmit={handleSubmit} />
      </form>
    </Card>
  );
};
