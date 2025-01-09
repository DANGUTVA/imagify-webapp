import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";

interface ExpenseFormActionsProps {
  onSubmit: () => void;
}

export const ExpenseFormActions = ({ onSubmit }: ExpenseFormActionsProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen && !stream) {
      const constraints = {
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const fallbackConstraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .catch(() => {
          console.log('Fallback to basic constraints');
          return navigator.mediaDevices.getUserMedia(fallbackConstraints);
        })
        .then(newStream => {
          console.log('Camera stream obtained successfully');
          setStream(newStream);
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
            // Forzar un reflow del video element
            videoRef.current.style.display = 'none';
            videoRef.current.offsetHeight;
            videoRef.current.style.display = 'block';
          }
        })
        .catch(error => {
          console.error('Error accessing camera:', error);
          toast({
            title: "Error",
            description: "No se pudo acceder a la cámara. Por favor, verifica los permisos.",
            variant: "destructive",
          });
          setIsOpen(false);
        });
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleCameraClick = () => {
    setIsOpen(true);
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        console.log('Imagen capturada:', imageData);
        
        toast({
          title: "Imagen capturada",
          description: "La imagen de la factura ha sido capturada exitosamente",
        });

        setIsOpen(false);
        stopCamera();
      }
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    stopCamera();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          type="submit" 
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={onSubmit}
        >
          Agregar Gasto
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleCameraClick}
        >
          <Camera className="w-4 h-4 mr-2" />
          Escanear Factura
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
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
              onClick={handleCapture}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700"
            >
              Capturar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};