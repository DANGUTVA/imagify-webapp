import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Expense } from "@/types/expense";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onViewImage: (id: string) => void;
}

export const ExpenseTable = ({ expenses, onEdit, onDelete, onViewImage }: ExpenseTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">#</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Centro de Costo</TableHead>
          <TableHead>Código DDI</TableHead>
          <TableHead className="text-right">Monto</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense, index) => (
          <TableRow key={expense.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{formatDate(expense.date)}</TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell>{expense.costCenter}</TableCell>
            <TableCell>{expense.ddiCode}</TableCell>
            <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewImage(expense.id)}
                >
                  <Eye className="h-4 w-4 text-[#8E9196]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(expense)}
                >
                  <Pencil className="h-4 w-4 text-[#0FA0CE]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(expense.id)}
                >
                  <Trash className="h-4 w-4 text-[#ea384c]" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};