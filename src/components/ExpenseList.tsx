import { useExpenses } from "@/context/ExpenseContext";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export const ExpenseList = () => {
  const { expenses, deleteExpense } = useExpenses();
  const [selectedCostCenters, setSelectedCostCenters] = useState<string[]>([
    "600-500-140",
    "600-600-300",
  ]);

  const costCenters = ["600-500-140", "600-600-300"];

  const filteredExpenses = expenses.filter((expense) =>
    selectedCostCenters.includes(expense.costCenter)
  );

  const handleCostCenterChange = (costCenter: string) => {
    setSelectedCostCenters((prev) =>
      prev.includes(costCenter)
        ? prev.filter((cc) => cc !== costCenter)
        : [...prev, costCenter]
    );
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Lista de Gastos</h2>
        <div className="flex gap-4">
          {costCenters.map((costCenter) => (
            <div key={costCenter} className="flex items-center space-x-2">
              <Checkbox
                id={costCenter}
                checked={selectedCostCenters.includes(costCenter)}
                onCheckedChange={() => handleCostCenterChange(costCenter)}
              />
              <label
                htmlFor={costCenter}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {costCenter}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>FECHA</TableHead>
              <TableHead>DESCRIPCIÓN</TableHead>
              <TableHead>CENTRO DE COSTO</TableHead>
              <TableHead className="text-right">MONTO</TableHead>
              <TableHead className="text-right">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense, index) => (
              <TableRow key={expense.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString("es-CR")}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.costCenter}</TableCell>
                <TableCell className="text-right">
                  ₡
                  {expense.amount.toLocaleString("es-CR", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};