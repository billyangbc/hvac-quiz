import { getCategories } from "@/lib/actions/category-actions";
import { getQuestions } from "@/lib/actions/question-actions";
import { QuestionSearchForm } from "@/components/dashboard/QuestionSearchForm";
import QuestionList from "@/components/dashboard/QuestionList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { QuestionForm } from "@/components/dashboard/QuestionForm";

type searchType = Promise<{ category: string, search: string; page: string }>;

const IndexPage = async (props: {
  searchParams: searchType;
}) => {
  const { category, search, page } = await props.searchParams;
  const categories = await getCategories();
  const currPage = parseInt(page?? '1');
  const query = {
    populate: "*",
    pagination: {
      pageSize: 25,
      ...(page && {page: currPage}),
    },
    filters: {
//      $and: [
//        {category: { documentId: {$eq: category}}},
//        {content: { $containsi: search}}
//      ]
      ...(category && {category: { documentId: {$eq: category}}}),
      ...(search && {content: { $containsi: search}}),
    }
  };

  const questions = await getQuestions(query);
  console.log("question search ==>", questions);
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border rounded-lg bg-white dark:bg-gray-800">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Create New Question</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <QuestionForm mode="create" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
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
