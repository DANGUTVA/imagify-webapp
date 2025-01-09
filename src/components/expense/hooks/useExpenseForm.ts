import { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useExpenseForm = () => {
  const { setExpenses } = useExpenses();
  const { toast } = useToast();
  
  const [description, setDescription] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [ddiCode, setDdiCode] = useState({
    part1: "",
    part2: "",
    part3: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [costCenters] = useState<string[]>(["600-500-140", "600-600-300"]);

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
    setCostCenter(value);
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
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          description,
          costCenter,
          amount: parseFloat(amount),
          date,
          ddiCode: formattedDdiCode,
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const { data: allExpenses } = await supabase
          .from('expenses')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (allExpenses) {
          setExpenses(allExpenses);
        }

        setDescription("");
        setCostCenter("");
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]);
        setDdiCode({ part1: "", part2: "", part3: "" });

        toast({
          title: "Gasto agregado",
          description: "El gasto ha sido guardado exitosamente",
        });
      }
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
    ddiCode,
    isSubmitting,
    costCenters,
    handleDDIInputChange,
    handleCostCenterChange,
    handleSubmit
  };
};