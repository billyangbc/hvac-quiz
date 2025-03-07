'use client';

import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useActionState } from "react";
import { createCategory, updateCategory } from "@/lib/actions/category-actions";
import { StrapiErrors } from "@/components/custom/StrapiErrors";

interface CategoryFormProps {
  category?: {
    id?: string;
    documentId: string;
    categoryName: string;
    description?: string;
  };
  onSuccess?: () => Promise<void>;
}

export const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const action = category ? updateCategory : createCategory;
  const [state, formAction, isPending] = useActionState(action, null);
  return (
    <div className="p-4">
      <form action={formAction} className="space-y-4">
        {category && (
          <input type="hidden" name="id" value={category.documentId} />
        )}
        <div className="grid grid-cols-8 gap-2">
          <div className="col-span-2">
            <Input
              id="category-name"
              type="text"
              name="categoryName"
              placeholder="Category Name"
              defaultValue={category?.categoryName || (state?.apiErrors && state?.data?.categoryName) || ""}
              required
            />
            { state?.apiErrors &&
              <StrapiErrors error={state?.apiErrors} />
            }
          </div>
          <div className="col-span-4">
          <Input
              id="category-description"
              type="text"
              name="description"
              placeholder="Description"
              defaultValue={category?.description || (state?.apiErrors && state?.data?.description) || ""}
            />
          </div>
          <div className="col-span-2">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
              disabled={isPending}
            >
              {isPending 
                ? `${category ? 'Updating...' : 'Creating...'}` 
                : `${category ? 'Update' : 'Create'} Category`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
