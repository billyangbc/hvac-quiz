"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useModalStore from "@/hooks/useModalStore";
import { deleteCategory } from "@/lib/actions/category-actions";
import { deleteQuestion } from "@/lib/actions/question-actions";
import { deleteEnrollment } from "@/lib/actions/enrollment-actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function DeleteConfirmationModal() {
  const router = useRouter();
  const { isOpen, onClose, type, additionalData, callbackUrl } = useModalStore();

  const [isDeleting, setIsDeleting] = useState(false);
  const isModalOpen = isOpen && type === "deleteConfirmation";

  const handleClose = () => {
    onClose();
  };

  if (!additionalData?.delete) return;
  const { documentId, target }: { documentId: string; target: 'category' | 'question' | 'enrollment' } = additionalData.delete;
  if (!documentId || !target) return;

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      if (target === 'category') {
        await deleteCategory(documentId);
      } else if (target === 'question') {
        await deleteQuestion(documentId);
      } else if (target === 'enrollment') {
        await deleteEnrollment(documentId);
      }
      toast.success(`Successfully deleted ${target}`);
      onClose();
      if (callbackUrl) {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error(`Error deleting ${target}:`, error);
      toast.error(`Failed to delete ${target}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {target.charAt(0).toUpperCase() + target.slice(1)}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {target}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
