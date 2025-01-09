import { useCameraHandling } from "../useCameraHandling";

interface UseExpenseFormActionsProps {
  onSubmit: (e: React.FormEvent) => void;
}

export const useExpenseFormActions = ({ onSubmit }: UseExpenseFormActionsProps) => {
  const {
    isOpen,
    setIsOpen,
    videoRef,
    capturedImage,
    setCapturedImage,
    handleCapture,
    resetState
  } = useCameraHandling();

  const handleCameraClick = () => {
    setCapturedImage(null);
    setIsOpen(true);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleDeleteImage = () => {
    setCapturedImage(null);
    setIsOpen(false);
  };

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e);
    resetState();
  };

  return {
    isOpen,
    videoRef,
    capturedImage,
    handleCameraClick,
    handleRetake,
    handleDeleteImage,
    handleDialogClose,
    handleSubmit,
    handleCapture
  };
};