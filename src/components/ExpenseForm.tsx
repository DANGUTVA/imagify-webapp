import { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ExpenseForm = () => {
  const { addExpense } = useExpenses();
  const [description, setDescription] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !costCenter || !amount) return;

    addExpense({
      description,
      costCenter,
      amount: parseFloat(amount),
      date,
    });

    setDescription("");
    setCostCenter("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <Card className="p-6 mb-8">
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
          <Select value={costCenter} onValueChange={setCostCenter}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un centro de costo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="600-500-140">600-500-140</SelectItem>
              <SelectItem value="600-600-300">600-600-300</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
            Agregar Gasto
          </Button>
          <Button type="button" variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
            <Camera className="w-4 h-4 mr-2" />
            Escanear Factura
          </Button>
        </div>
      </form>
    </Card>
  );
};