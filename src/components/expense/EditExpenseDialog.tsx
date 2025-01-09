import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Expense } from "@/types/expense";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onSave: (expense: Expense) => void;
  costCenters: string[];
}

export const EditExpenseDialog = ({ 
  isOpen, 
  onClose, 
  expense, 
  onSave,
  costCenters 
}: EditExpenseDialogProps) => {
  const [editedExpense, setEditedExpense] = useState<Expense | null>(expense);

  const handleSave = () => {
    if (editedExpense) {
      onSave(editedExpense);
      onClose();
    }
  };

  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Gasto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Descripción"
              value={editedExpense?.description || ""}
              onChange={(e) =>
                setEditedExpense(prev =>
                  prev ? { ...prev, description: e.target.value } : null
                )
              }
            />
          </div>
          <div>
            <Select
              value={editedExpense?.costCenter}
              onValueChange={(value) =>
                setEditedExpense(prev =>
                  prev ? { ...prev, costCenter: value } : null
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar centro de costo" />
              </SelectTrigger>
              <SelectContent>
                {costCenters.map((center) => (
                  <SelectItem key={center} value={center}>
                    {center}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              type="number"
              placeholder="Monto"
              value={editedExpense?.amount || ""}
              onChange={(e) =>
                setEditedExpense(prev =>
                  prev ? { ...prev, amount: parseFloat(e.target.value) } : null
                )
              }
            />
          </div>
          <div>
            <Input
              type="date"
              value={editedExpense?.date || ""}
              onChange={(e) =>
                setEditedExpense(prev =>
                  prev ? { ...prev, date: e.target.value } : null
                )
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};