import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DDICodeInput } from "./expense/DDICodeInput";
import { CostCenterSelect } from "./expense/CostCenterSelect";
import { ExpenseFormActions } from "./ExpenseFormActions";
import { useExpenseForm } from "./expense/hooks/useExpenseForm";

export const ExpenseForm = () => {
  const {
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
  } = useExpenseForm();

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