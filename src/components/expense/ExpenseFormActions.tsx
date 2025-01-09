import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface ExpenseFormActionsProps {
  onSubmit: () => void;
}

export const ExpenseFormActions = ({ onSubmit }: ExpenseFormActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        type="submit" 
        className="flex-1 bg-green-600 hover:bg-green-700"
        onClick={onSubmit}
      >
        Agregar Gasto
      </Button>
      <Button type="button" variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
        <Camera className="w-4 h-4 mr-2" />
        Escanear Factura
      </Button>
    </div>
  );
};