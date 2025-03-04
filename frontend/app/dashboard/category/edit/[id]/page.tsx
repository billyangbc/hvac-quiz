import { CategoryForm } from "@/components/dashboard/CategoryForm";
import { getCategory } from "@/lib/actions/category-actions";

export default async function EditCategoryPage( props: {params: Promise<{id: string;}>}) {
  const { id } = await props.params;
  const category = await getCategory(id);
  console.log(category);
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="grid grid-cols-1">
          <CategoryForm category={category} />
        </div>
      </div>
    </div>
  );
}
