import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExpenseFormActionsProps {
  onSubmit: () => void;
}

export const ExpenseFormActions = ({ onSubmit }: ExpenseFormActionsProps) => {
  const { toast } = useToast();

  const handleCameraClick = async () => {
    try {
      // Solicitar acceso a la cámara con preferencia por la cámara trasera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Solicita específicamente la cámara trasera
          width: { ideal: 4096 }, // Resolución óptima para el Samsung A51
          height: { ideal: 3072 }
        }
      });

      // Crear elementos para mostrar y capturar la imagen
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Crear el canvas para capturar la imagen
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Esperar a que el video esté listo
      video.addEventListener('loadeddata', () => {
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convertir la imagen a formato base64
          const imageData = canvas.toDataURL('image/jpeg');
          
          // Detener la transmisión de video
          stream.getTracks().forEach(track => track.stop());
          
          // Aquí puedes manejar la imagen capturada
          console.log('Imagen capturada:', imageData);
          
          toast({
            title: "Imagen capturada",
            description: "La imagen de la factura ha sido capturada exitosamente",
          });
        }
      });

    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      toast({
        title: "Error",
        description: "No se pudo acceder a la cámara. Por favor, verifica los permisos.",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};