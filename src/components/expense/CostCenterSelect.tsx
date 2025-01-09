import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface CostCenterSelectProps {
  costCenter: string;
  costCenters: string[];
  onValueChange: (value: string) => void;
}

export const CostCenterSelect = ({ costCenter, costCenters, onValueChange }: CostCenterSelectProps) => {
  return (
    <Select 
      value={costCenter} 
      onValueChange={onValueChange}
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
  );
};