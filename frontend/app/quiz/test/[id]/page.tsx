import { redirect } from "next/navigation";
import Questions from "@/components/quiz/Questions";
import { getQuestions } from "@/lib/actions/quiz/quiz-actions";

type paramsType = Promise<{id: string;}>;
type searchType = Promise<{category: string; difficulty: string; limit: string}>;

const QuestionsPage = async (props: {
  params: paramsType,
  searchParams: searchType
}) => {
  const { id } = await props.params;
  const { category, difficulty, limit} = await props.searchParams;

  // the category is required
  if (!category) {
    redirect("/quiz");
  }

  const responseData = await getQuestions(category, difficulty, limit);
  console.log("questions list for " + `${category}`, responseData);
  if (responseData.length < 1) {
    redirect("/quiz");
  }
  const questionCategory = responseData[0]["category"];
  return (
    <Questions
      testId={id}
      questions={responseData}
      total={responseData.length}
      category={questionCategory}
    />
  );
};

export default QuestionsPage;
