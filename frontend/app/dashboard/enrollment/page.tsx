import { EnrollmentForm } from "@/components/dashboard/EnrollmentForm";
import { getEnrollments } from "@/lib/actions/enrollment-actions";
export default async function IndexPage() {
  const query = {
    populate: "*",
  };
  const enrollments = await getEnrollments(query);
  if (!enrollments) {
    //TODO: redirect to /dashboard/enrollment/create
  } else if (enrollments.length === 1) {
    //TODO: redirect to /dashboard/enrollment/[:documentId]
  }

  return (
    <div className="flex flex-col px-8 py-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      {/*TODO: render enrollments list, each record has a link to /dashboard/enrollment/[:documentId] page */}
    </div>
  );
}