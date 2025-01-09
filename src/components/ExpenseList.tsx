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
import { Eye, Pencil, Trash2, Filter } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ExpenseList = () => {
  const { expenses, deleteExpense } = useExpenses();
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>("all");

  const costCenters = ["600-500-140", "600-600-300"];

  const filteredExpenses = selectedCostCenter === "all" 
    ? expenses 
    : expenses.filter((expense) => expense.costCenter === selectedCostCenter);

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">Lista de Gastos</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select
            value={selectedCostCenter}
            onValueChange={setSelectedCostCenter}
          >
            <SelectTrigger className="w-full sm:w-[240px] border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Todos los centros de costo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos los centros de costo</SelectItem>
                {costCenters.map((costCenter) => (
                  <SelectItem key={costCenter} value={costCenter}>
                    {costCenter}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>FECHA</TableHead>
              <TableHead>DESCRIPCIÓN</TableHead>
              <TableHead className="hidden md:table-cell">CENTRO DE COSTO</TableHead>
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
                <TableCell className="hidden md:table-cell">{expense.costCenter}</TableCell>
                <TableCell className="text-right">
                  ₡
                  {expense.amount.toLocaleString("es-CR", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 md:gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExpense(expense.id)}
                      className="h-8 w-8"
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