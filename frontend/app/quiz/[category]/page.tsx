import Questions from "@/components/quiz/Questions";
import { redirect } from "next/navigation";
import { validateDifficulty, getQuestions } from "@/lib/actions/quiz/quiz-actions";

const validateParams = async (difficulty: string, limit: string ) => {
  const validateLimit = (limit: string) => {
    const parsedLimit = parseInt(limit, 10);
    return !isNaN(parsedLimit) && parsedLimit >= 1 && parsedLimit <= 50;
  };

  if ( !await validateDifficulty(difficulty) ||
    !validateLimit(limit)
  ) {
    return false;
  }

  return true;
}

type paramsType = Promise<{category: string;}>;
type searchType = Promise<{difficulty: string; limit: string}>;

const QuestionsPage = async (props: {
  params: paramsType,
  searchParams: searchType
}) => {
  const { category } = await props.params;
  const { difficulty, limit} = await props.searchParams;

  const paramOk = await validateParams(difficulty, limit);
  if (!paramOk) {
    redirect("/");
  }

  const responseData = await getQuestions(category, difficulty, limit);
  console.log("questions list for " + `${category}`, responseData);
  const categoryName = responseData[0]["category"];
  return (
    <Questions
      questions={responseData}
      limit={responseData.length}
      categoryName={categoryName}
    />
  );
};

export default QuestionsPage;
