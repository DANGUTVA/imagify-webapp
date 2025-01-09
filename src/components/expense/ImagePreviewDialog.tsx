import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  isLoading: boolean;
}

export const ImagePreviewDialog = ({ isOpen, onClose, imageUrl, isLoading }: ImagePreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Vista del Recibo</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center min-h-[300px]">
          {isLoading ? (
            <div className="text-center">Cargando imagen...</div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Recibo"
              className="max-w-full max-h-[500px] object-contain rounded-lg"
            />
          ) : (
            <div className="text-center">No hay imagen disponible</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};