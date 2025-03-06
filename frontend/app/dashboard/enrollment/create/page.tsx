import { EnrollmentForm } from "@/components/dashboard/EnrollmentForm";
export default async function IndexPage() {

  return (
    <div className="flex flex-col px-8 py-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <EnrollmentForm />
    </div>
  );
}