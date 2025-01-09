import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface ActionButtonsProps {
  onSubmit: (e: React.FormEvent) => void;
  onCameraClick: () => void;
}

export const ActionButtons = ({ onSubmit, onCameraClick }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        type="button" 
        variant="outline" 
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={onCameraClick}
      >
        <Camera className="w-4 h-4 mr-2" />
        Escanear Factura
      </Button>
      <Button 
        type="submit" 
        className="flex-1 bg-green-600 hover:bg-green-700"
        onClick={onSubmit}
      >
        Agregar Gasto
      </Button>
    </div>
  );
};