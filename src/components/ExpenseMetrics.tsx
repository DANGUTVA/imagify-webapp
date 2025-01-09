import { Card } from "@/components/ui/card";
import { DollarSign, ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useExpenses } from "@/context/ExpenseContext";
import { useMonthlyBudget } from "./expense/hooks/useMonthlyBudget";
import { Button } from "./ui/button";
import { SetBudgetDialog } from "./expense/SetBudgetDialog";
import { useState } from "react";

export const ExpenseMetrics = () => {
  const { expenses } = useExpenses();
  const { budget, formattedMonth, navigateMonth, saveBudget, isLoading } = useMonthlyBudget();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const available = budget ? budget - spent : 0;
  const spentPercentage = budget ? ((spent / budget) * 100).toFixed(1) : "0.0";

  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (!budget) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold">No hay presupuesto establecido para {formattedMonth}</h2>
        <p className="text-gray-600">
          Para comenzar a registrar gastos, primero debes establecer un presupuesto para este mes.
        </p>
        <Button onClick={() => setIsDialogOpen(true)}>
          Establecer Presupuesto
        </Button>
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <SetBudgetDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={saveBudget}
          month={formattedMonth}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold">{formattedMonth}</h2>
        <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Presupuesto</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-blue-600">
            ₡{budget.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <ArrowUp className="w-4 h-4 text-green-600" />
            <span>Disponible</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            ₡{available.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
          </div>
        </Card>

        <Card className="p-4 md:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <ArrowDown className="w-4 h-4 text-red-600" />
            <span>Gastado</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-red-600">
            ₡{spent.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {spentPercentage}% del presupuesto
          </div>
        </Card>
      </div>

      <SetBudgetDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={saveBudget}
        month={formattedMonth}
      />
    </>
  );
};