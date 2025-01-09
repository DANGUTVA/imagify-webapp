import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useExpenseStorage = () => {
  const { toast } = useToast();
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const handleViewImage = async (expenseId: string) => {
    try {
      setIsLoadingImage(true);
      setIsImageDialogOpen(true);
      setSelectedImage(null);

      // Verificar si el archivo existe usando download
      const { data, error: downloadError } = await supabase
        .storage
        .from('receipts')
        .download(`receipt-${expenseId}.jpg`);

      if (downloadError) {
        console.error('Error al verificar la imagen:', downloadError);
        throw new Error('No se encontró la imagen para este gasto');
      }

      // Si llegamos aquí, el archivo existe, obtener la URL pública
      const { data: urlData } = supabase
        .storage
        .from('receipts')
        .getPublicUrl(`receipt-${expenseId}.jpg`);

      if (!urlData.publicUrl) {
        throw new Error('Error al obtener la URL de la imagen');
      }

      setSelectedImage(urlData.publicUrl);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar la imagen",
        variant: "destructive",
      });
      setIsImageDialogOpen(false);
    } finally {
      setIsLoadingImage(false);
    }
  };

  return {
    isImageDialogOpen,
    setIsImageDialogOpen,
    selectedImage,
    isLoadingImage,
    handleViewImage
  };
};