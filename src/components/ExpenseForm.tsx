import { useState, useRef } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";

export const ExpenseForm = () => {
  const { addExpense } = useExpenses();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCostCenter, setNewCostCenter] = useState("");
  const [ddiCode, setDdiCode] = useState({
    part1: "",
    part2: "",
    part3: "",
  });

  // Referencias para los campos de DDI
  const ddiPart1Ref = useRef<HTMLInputElement>(null);
  const ddiPart2Ref = useRef<HTMLInputElement>(null);
  const ddiPart3Ref = useRef<HTMLInputElement>(null);

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
      setCostCenter(newCostCenter.trim());
      setNewCostCenter("");
      setIsAddingNew(false);
      
      toast({
        title: "Centro de costo agregado",
        description: "El nuevo centro de costo ha sido agregado exitosamente",
      });
    }
  };

  const handleDDIInputChange = (
    part: 'part1' | 'part2' | 'part3',
    value: string,
    maxLength: number,
    nextRef?: React.RefObject<HTMLInputElement>
  ) => {
    // Solo permitir números
    const numericValue = value.replace(/\D/g, '');
    
    setDdiCode(prev => ({
      ...prev,
      [part]: numericValue
    }));

    // Avanzar al siguiente campo si se alcanza la longitud máxima
    if (numericValue.length >= maxLength && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !costCenter || !amount) return;

    const formattedDdiCode = `DDI-${ddiCode.part1}-${ddiCode.part2}-${ddiCode.part3}`;

    addExpense({
      description,
      costCenter,
      amount: parseFloat(amount),
      date,
      ddiCode: formattedDdiCode,
    });

    setDescription("");
    setCostCenter("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setDdiCode({ part1: "", part2: "", part3: "" });
  };

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
          <Select 
            value={costCenter} 
            onValueChange={(value) => {
              if (value === "new") {
                setIsAddingNew(true);
              } else {
                setCostCenter(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un centro de costo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {costCenters.map((center) => (
                  <SelectItem key={center} value={center}>
                    {center}
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

        <div>
          <Input
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">DDI-</span>
          <Input
            className="w-16"
            maxLength={4}
            value={ddiCode.part1}
            onChange={(e) => handleDDIInputChange('part1', e.target.value, 4, ddiPart2Ref)}
            ref={ddiPart1Ref}
          />
          <span>-</span>
          <Input
            className="w-12"
            maxLength={2}
            value={ddiCode.part2}
            onChange={(e) => handleDDIInputChange('part2', e.target.value, 2, ddiPart3Ref)}
            ref={ddiPart2Ref}
          />
          <span>-</span>
          <Input
            className="w-12"
            maxLength={2}
            value={ddiCode.part3}
            onChange={(e) => handleDDIInputChange('part3', e.target.value, 2)}
            ref={ddiPart3Ref}
          />
        </div>

        <div>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
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