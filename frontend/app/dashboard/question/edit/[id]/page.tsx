import { QuestionForm } from "@/components/dashboard/QuestionForm";

export default async function EditQuestionPage( props: {params: Promise<{id: string;}>}) {
  const { id } = await props.params;
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="grid grid-cols-1">
          <QuestionForm mode="edit" questionId={ id } />
        </div>
      </div>
    </div>
  );
}
