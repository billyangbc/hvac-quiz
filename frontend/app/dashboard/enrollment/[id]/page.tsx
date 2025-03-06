import { EnrollmentForm } from "@/components/dashboard/EnrollmentForm";
import { getEnrollment } from "@/lib/actions/enrollment-actions";
export default async function IndexPage(props: {params: Promise<{id: string;}>}) {
  const { id } = await props.params;

  const enrollment = await getEnrollment(id);
  return (
    <div className="flex flex-col px-8 py-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <EnrollmentForm enrollment={enrollment}/>
    </div>
  );
}