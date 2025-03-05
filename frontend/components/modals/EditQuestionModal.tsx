"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useModalStore from "@/hooks/useModalStore";
import { QuestionForm } from "@/components/dashboard/QuestionForm";

export default function EditQuestionModal() {
  const { isOpen, onClose, type, additionalData } = useModalStore();
  const isModalOpen = isOpen && type === "editQuestion";

  const handleClose = () => {
    onClose();
  };

  if (!additionalData?.question) return null;
  const { documentId } = additionalData.question;
  if (!documentId) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <QuestionForm mode="edit" questionId={documentId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
