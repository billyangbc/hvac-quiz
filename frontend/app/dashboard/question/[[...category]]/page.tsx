import { getCategories } from "@/lib/actions/category-actions";
import { getQuestions } from "@/lib/actions/question-actions";

type paramsType = Promise<{category: string;}>;
type searchType = Promise<{search: string; page: string}>;

const IndexPage = async (props: {
  params: paramsType,
  searchParams: searchType
}) => {
  const { category } = await props.params;
  const { search, page} = await props.searchParams;
  const categories = await getCategories();
  const questions = await getQuestions({search: search, page: parseInt(page), category: category});
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="grid grid-cols-1">
          {/*TODO: Add search bar and categories dropdown here
          <QuestionSearchForm category={category} categories={categories} search={search} page={page} />
         */}
        </div>
        <div className="grid grid-cols-1">
          {/*TODO: Add question search result here
          <QuestionList questions={result} />
         */}
        </div>
      </div>
    </div>
  );
}
export default IndexPage;