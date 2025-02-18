import Questions from "@/components/quiz/Questions";
import { validateCategory, validateDifficulty, getQuestions } from "@/data/loader";
import { redirect } from "next/navigation";

const validateParams = (category: string, difficulty: string, limit: string ) => {
  const validateLimit = (limit: string) => {
    const parsedLimit = parseInt(limit, 10);
    return !isNaN(parsedLimit) && parsedLimit >= 5 && parsedLimit <= 50;
  };

  if (
    !validateCategory(category) ||
    !validateDifficulty(difficulty) ||
    !validateLimit(limit)
  ) {
    return false;
  }

  return true;
}

type Props = {
  params: {
    category: string;
  },
  searchParams: {
    difficulty: string;
    limit: string;
  };
};

type paramsType = Promise<{category: string;}>;
type searchType = Promise<{difficulty: string; limit: string}>;

const QuestionsPage = async (props: {params: paramsType,
  searchParams: searchType}) => {
  const { category } = await props.params;
  const { difficulty, limit} = await props.searchParams;

  if (!validateParams(category, difficulty, limit)) {
    redirect("/");
  }

  const response = await getQuestions(category, difficulty, limit);
  return (
    <Questions
      questions={response}
      limit={parseInt(limit, 10)}
      category={category}
    />
  );
};

export default QuestionsPage;
