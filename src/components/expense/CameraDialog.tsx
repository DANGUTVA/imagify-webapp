import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CameraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const CameraDialog = ({ isOpen, onClose, onCapture, videoRef }: CameraDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Capturar Factura</DialogTitle>
        </DialogHeader>
        <div className="relative flex-1 flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <Button
            onClick={onCapture}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700"
          >
            Capturar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};