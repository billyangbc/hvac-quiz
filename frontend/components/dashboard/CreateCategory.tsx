'use client';

import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useActionState } from "react";
import { createCategoryAction } from "@/lib/actions/category-actions";
import { StrapiErrors } from "@/components/custom/StrapiErrors";

export const CreateCategory = () => {
  const [state, action, isPending] = useActionState(createCategoryAction, null);
  return (
    <div className="p-6">
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-4">
            <Input
              id="category-ame"
              type="text"
              name="categoryName"
              placeholder="Category Name"
              defaultValue={ (state?.apiErrors && state?.data?.categoryName) || ""}
              required
            />
            { state?.apiErrors &&
              <StrapiErrors error={state?.apiErrors} />
            }
          </div>

          <div className="col-span-1">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
