import { ActionButtons } from "./ActionButtons";
import { CameraDialog } from "./CameraDialog";
import { ImagePreview } from "./ImagePreview";
import { useCameraHandling } from "./useCameraHandling";

interface ExpenseFormActionsProps {
  onSubmit: () => void;
}

export const ExpenseFormActions = ({ onSubmit }: ExpenseFormActionsProps) => {
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

  const handleSubmit = () => {
    onSubmit();
    resetState();
  };

  return (
    <div className="flex flex-col gap-4">
      <ActionButtons 
        onSubmit={handleSubmit}
        onCameraClick={handleCameraClick}
      />

      {capturedImage && (
        <ImagePreview
          imageUrl={capturedImage}
          onRetake={handleRetake}
          onDelete={handleDeleteImage}
        />
      )}

      <CameraDialog
        isOpen={isOpen}
        onClose={handleDialogClose}
        onCapture={handleCapture}
        videoRef={videoRef}
      />
    </div>
  );
};