import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useCameraHandling = () => {
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

  const resetState = () => {
    setCapturedImage(null);
    stopCamera();
    setIsOpen(false);
    // Limpiar la imagen del contexto global
    (window as any).capturedImage = null;
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
        // Guardar la imagen en el contexto global
        (window as any).capturedImage = imageData;
        
        toast({
          title: "Imagen capturada",
          description: "La imagen de la factura ha sido capturada exitosamente",
        });

        stopCamera();
        setIsOpen(false);
      }
    }
  };

  return {
    isOpen,
    setIsOpen,
    videoRef,
    stream,
    capturedImage,
    setCapturedImage,
    stopCamera,
    handleCapture,
    resetState
  };
};