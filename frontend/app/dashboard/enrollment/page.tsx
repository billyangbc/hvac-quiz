import { redirect } from "next/navigation";
import Link from "next/link";
import { getEnrollments } from "@/lib/actions/enrollment-actions";
import type { Enrollment } from "@/types/dashboard/Enrollment";
import { EnrollmentForm } from "@/components/dashboard/EnrollmentForm";
export default async function IndexPage() {
  const query = {
    populate: "*",
  };
  const enrollments = await getEnrollments(query);
  if (!enrollments) {
    redirect("/dashboard/enrollment/create");
  } else if (enrollments.length === 1) {
    const documentId = enrollments[0]?.documentId;
    redirect(`/dashboard/enrollment/${documentId}`);
  }

  return (
    <div className="flex flex-col px-8 py-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Your Enrollments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((enrollment: Enrollment) => (
            <Link
              key={enrollment.documentId}
              href={`/dashboard/enrollment/${enrollment.documentId}`}
              className="group transition-all"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  {enrollment.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {enrollment.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 pt-8">
          <EnrollmentForm />
        </div>
      </div>
    </div>
  );
}