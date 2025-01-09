import { ActionButtons } from "./ActionButtons";
import { ExpenseImageSection } from "./ExpenseImageSection";
import { useExpenseFormActions } from "./hooks/useExpenseFormActions";

interface ExpenseFormActionsProps {
  onSubmit: () => void;
}

export const ExpenseFormActions = ({ onSubmit }: ExpenseFormActionsProps) => {
  const {
    isOpen,
    videoRef,
    capturedImage,
    handleCameraClick,
    handleRetake,
    handleDeleteImage,
    handleDialogClose,
    handleSubmit,
    handleCapture
  } = useExpenseFormActions({ onSubmit });

  return (
    <div className="flex flex-col gap-4">
      <ActionButtons 
        onSubmit={handleSubmit}
        onCameraClick={handleCameraClick}
      />

      <ExpenseImageSection
        isOpen={isOpen}
        onClose={handleDialogClose}
        onCapture={handleCapture}
        videoRef={videoRef}
        capturedImage={capturedImage}
        onRetake={handleRetake}
        onDelete={handleDeleteImage}
      />
    </div>
  );
};