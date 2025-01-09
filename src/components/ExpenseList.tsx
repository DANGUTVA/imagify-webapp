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
import { Eye, Pencil, Trash2, Filter, Plus } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const ExpenseList = () => {
  const { expenses, deleteExpense } = useExpenses();
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>("all");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCostCenter, setNewCostCenter] = useState("");
  const { toast } = useToast();
  
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
      setSelectedCostCenter(newCostCenter.trim());
      setNewCostCenter("");
      setIsAddingNew(false);
      
      toast({
        title: "Centro de costo agregado",
        description: "El nuevo centro de costo ha sido agregado exitosamente",
      });
    }
  };

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
            onValueChange={(value) => {
              if (value === "new") {
                setIsAddingNew(true);
              } else {
                setSelectedCostCenter(value);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-[240px] border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Seleccione un centro de costo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos los centros de costo</SelectItem>
                {costCenters.map((costCenter) => (
                  <SelectItem key={costCenter} value={costCenter}>
                    {costCenter}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value="new" className="text-blue-600">
                  <Plus className="w-4 h-4 mr-2 inline-block" />
                  Agregar nuevo centro de costo
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isAddingNew && (
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Ingrese el nuevo centro de costo"
            value={newCostCenter}
            onChange={(e) => setNewCostCenter(e.target.value)}
            className="w-full sm:w-[240px]"
          />
          <Button onClick={handleAddNewCostCenter} className="bg-blue-600 hover:bg-blue-700">
            Agregar
          </Button>
          <Button variant="outline" onClick={() => setIsAddingNew(false)}>
            Cancelar
          </Button>
        </div>
      )}

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