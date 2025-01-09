import { ActionButtons } from "./expense/ActionButtons";
import { ExpenseImageSection } from "./expense/ExpenseImageSection";
import { useExpenseFormActions } from "./expense/hooks/useExpenseFormActions";

interface ExpenseFormActionsProps {
  onSubmit: (e: React.FormEvent) => void;
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