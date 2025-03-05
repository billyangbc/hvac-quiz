import { getCategories } from "@/lib/actions/category-actions";
import { getQuestions } from "@/lib/actions/question-actions";
import { QuestionSearchForm } from "@/components/dashboard/QuestionSearchForm";
import QuestionList from "@/components/dashboard/QuestionList";

type searchType = Promise<{ category: string, search: string; page: string }>;

const IndexPage = async (props: {
  searchParams: searchType;
}) => {
  const { category } = await props.searchParams;
  const { search, page } = await props.searchParams;
  const categories = await getCategories();
  const currPage = parseInt(page?? '1');
  const questions = await getQuestions({
    search: search,
    page: currPage,
    category: category,
  });
  console.log("question search ==>", questions);
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="grid grid-cols-1">
          <QuestionSearchForm
            category={category}
            categories={categories?.data}
            search={search}
            page={currPage.toString()}
          />
        </div>
        <div className="grid grid-cols-1">
          <QuestionList questions={questions?.data}/>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
