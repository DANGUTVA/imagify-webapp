import { Button } from "@/components/ui/button";
import { Camera, Trash2, RefreshCw } from "lucide-react";
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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

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
    setCapturedImage(null);
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
        setCapturedImage(imageData);
        
        toast({
          title: "Imagen capturada",
          description: "La imagen de la factura ha sido capturada exitosamente",
        });

        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (!stream) {
      setIsOpen(true);
    }
  };

  const handleDeleteImage = () => {
    setCapturedImage(null);
    setIsOpen(false);
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    stopCamera();
  };

  return (
    <>
      <div className="flex flex-col gap-4">
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

        {capturedImage && (
          <div className="relative w-full max-w-[200px] mx-auto">
            <img 
              src={capturedImage} 
              alt="Vista previa de la factura" 
              className="w-full h-auto rounded-lg shadow-md"
            />
            <div className="flex gap-2 mt-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetake}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Repetir
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDeleteImage}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </div>
        )}
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