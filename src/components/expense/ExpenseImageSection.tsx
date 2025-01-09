import { CameraDialog } from "./CameraDialog";
import { ImagePreview } from "./ImagePreview";

interface ExpenseImageSectionProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  capturedImage: string | null;
  onRetake: () => void;
  onDelete: () => void;
}

export const ExpenseImageSection = ({
  isOpen,
  onClose,
  onCapture,
  videoRef,
  capturedImage,
  onRetake,
  onDelete
}: ExpenseImageSectionProps) => {
  if (!capturedImage && !isOpen) return null;

  return (
    <>
      {capturedImage && (
        <ImagePreview
          imageUrl={capturedImage}
          onRetake={onRetake}
          onDelete={onDelete}
        />
      )}

      <CameraDialog
        isOpen={isOpen}
        onClose={onClose}
        onCapture={onCapture}
        videoRef={videoRef}
      />
    </>
  );
};