import { useExpenses } from "@/context/ExpenseContext";
import { Card } from "@/components/ui/card";
import { DollarSign, ArrowDown, ArrowUp } from "lucide-react";

export const ExpenseMetrics = () => {
  const { expenses } = useExpenses();
  const budget = 250000.00;
  const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const available = budget - spent;
  const spentPercentage = ((spent / budget) * 100).toFixed(1);

  return (
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
  );
};