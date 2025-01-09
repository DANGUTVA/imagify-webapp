import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  onRetake: () => void;
  onDelete: () => void;
}

export const ImagePreview = ({ imageUrl, onRetake, onDelete }: ImagePreviewProps) => {
  return (
    <div className="relative w-full max-w-[200px] mx-auto">
      <img 
        src={imageUrl} 
        alt="Vista previa de la factura" 
        className="w-full h-auto rounded-lg shadow-md"
      />
      <div className="flex gap-2 mt-2 justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetake}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Repetir
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};