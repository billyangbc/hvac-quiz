import { CreateQuestion } from "@/components/dashboard/CreateQuestion";

export default async function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="grid grid-cols-1">
          <CreateQuestion />
        </div>
      </div>
    </div>
  );
}
