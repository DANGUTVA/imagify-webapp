import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";

export const useMonthlyBudget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [budget, setBudget] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchBudget = async (date: Date) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('monthly_budgets')
        .select('amount')
        .eq('year', date.getFullYear())
        .eq('month', date.getMonth() + 1)
        .single();

      if (error) throw error;
      setBudget(data?.amount || null);
    } catch (error) {
      console.error('Error fetching budget:', error);
      setBudget(null);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBudget = async (amount: number) => {
    try {
      const { error } = await supabase
        .from('monthly_budgets')
        .upsert({
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
          amount
        });

      if (error) throw error;

      setBudget(amount);
      toast({
        title: "Presupuesto guardado",
        description: "El presupuesto mensual ha sido actualizado exitosamente."
      });
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el presupuesto mensual.",
        variant: "destructive"
      });
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = addMonths(currentDate, direction === 'next' ? 1 : -1);
    setCurrentDate(newDate);
  };

  const formattedMonth = format(currentDate, 'MMMM yyyy', { locale: es });

  useEffect(() => {
    fetchBudget(currentDate);
  }, [currentDate]);

  return {
    currentDate,
    budget,
    isLoading,
    formattedMonth,
    navigateMonth,
    saveBudget
  };
};