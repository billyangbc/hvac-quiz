"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useModalStore from "@/hooks/useModalStore";
import { CategoryForm } from "@/components/dashboard/CategoryForm";

export default function EditCategoryModal() {
  const { isOpen, onClose, type, additionalData } = useModalStore();
  const isModalOpen = isOpen && type === "editCategory";

  const handleClose = () => {
    onClose();
  };

  if (!additionalData?.category?.documentId) return null;
  const { documentId, categoryName, description } = additionalData.category;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CategoryForm 
            category={{
              documentId: documentId,
              categoryName: categoryName,
              description: additionalData.category.description
            }} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}