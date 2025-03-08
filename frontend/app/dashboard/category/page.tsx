import { CategoryForm } from "@/components/dashboard/CategoryForm";
import { CategoryList } from "@/components/dashboard/CategoryList";

export default async function Index() {
  const pageSize = 10;
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="grid grid-cols-1">
          <CategoryForm/>
        </div>
        <div className="grid grid-cols-1">
          <CategoryList pageSize={pageSize} /> 
        </div>
      </div>
    </div>
  );
}
