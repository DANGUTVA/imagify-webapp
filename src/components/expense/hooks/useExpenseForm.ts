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

  const uploadImage = async (imageData: string, expenseId: string): Promise<boolean> => {
    try {
      console.log('Starting image upload for expense:', expenseId);
      
      // Convertir el base64 a un Blob
      const base64Data = imageData.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const fileName = `receipt-${expenseId}.jpg`;

      console.log('Uploading file:', fileName);

      const { error: uploadError, data } = await supabase.storage
        .from('receipts')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);
      return true;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
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
      // Obtener la imagen del contexto global
      const capturedImage = (window as any).capturedImage;
      console.log('Captured image exists:', !!capturedImage);

      const { data: expenseData, error: expenseError } = await supabase
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

      if (expenseError) throw expenseError;

      if (expenseData) {
        if (capturedImage) {
          try {
            await uploadImage(capturedImage, expenseData.id);
            console.log('Image uploaded successfully');
          } catch (imageError) {
            console.error('Error uploading image:', imageError);
            toast({
              title: "Advertencia",
              description: "El gasto se guardó pero hubo un error al subir la imagen",
              variant: "destructive",
            });
          }
        }

        const { data: allExpenses } = await supabase
          .from('expenses')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (allExpenses) {
          setExpenses(allExpenses);
        }

        // Limpiar el formulario
        setDescription("");
        setCostCenter("");
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]);
        setDdiCode({ part1: "", part2: "", part3: "" });
        // Limpiar la imagen capturada del contexto global
        (window as any).capturedImage = null;

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