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
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteConfirmationModal() {
  const { isOpen, onClose, type, additionalData } = useModalStore();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isModalOpen = isOpen && type === "deleteConfirmation";
  
  const handleClose = () => {
    onClose();
  };
  
  const handleConfirmDelete = async () => {
    if (!additionalData?.categoryId) return;
    try {
      setIsDeleting(true);
      await deleteCategory(additionalData.categoryId);
      toast.success("Category deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category? This action cannot be undone.
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
