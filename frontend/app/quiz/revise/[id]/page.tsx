import { redirect } from "next/navigation";
import ReviseTest from "@/components/quiz/Questions";
import { getReviseTest } from "@/lib/actions/quiz/quiz-actions";

type paramsType = Promise<{id: string;}>;

const RevisePage = async (props: {
  params: paramsType,
}) => {
  const { id } = await props.params;
  const responseData = await getReviseTest(id);
  console.log("revise questions list => ", responseData);

  if (!responseData?.failedQuestions || responseData.failedQuestions?.length < 1) {
    redirect("/quiz");
  }

  return (
    <>
    {/*TODO: implement ReviseTest component
    <ReviseTest
      testId={id}
      questions={responseData}
    />
    */}
    </>
  );
};

export default RevisePage;
