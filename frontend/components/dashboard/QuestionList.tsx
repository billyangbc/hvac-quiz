"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import useModalStore from '@/hooks/useModalStore';
import { Question } from '@/types/dashboard/Question';
import { getQuestions } from "@/lib/actions/question-actions";
import { Category } from "@/types/dashboard/Category";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NO_CATEGORY_VALUE = "_";
const NO_CATEGORY_NAME = "No Category";

export default function QuestionList({ categories }: { categories: Category[] }) {
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      let categoryFilter = {};
      if (categoryId) {
        if (categoryId === NO_CATEGORY_VALUE) {
          categoryFilter = {category: { "$null": true }};
        } else {
          categoryFilter = {category: { documentId: {$eq: categoryId}}};
        }
      }
      const query = {
        populate: "*",
        pagination: {
          pageSize: 25,
          page: currPage,
        },
        filters: {
          ...categoryFilter,
          ...(search && {content: { $containsi: search}}),
        }
      };
      try {
        const response = await getQuestions(query);
        if (response?.data) {
          setQuestions(response.data);
          setTotalPages(response.meta?.pagination?.pageCount || 1);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [categoryId, search, currPage, totalPages]);

  useEffect(() => {
    setExpandedStates(questions.map(() => false))
  }, [questions]);

  const toggleQuestion = (index: number) => {
    setExpandedStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    })
  }

  return (
    <>
    <div className="grid grid-cols-1 py-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select name="category" defaultValue={categoryId} onValueChange={(value) => setCategoryId(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={NO_CATEGORY_VALUE} value={NO_CATEGORY_VALUE}>
              {NO_CATEGORY_NAME}
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.documentId}>
                {cat.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="search"
          placeholder="Search questions..."
          defaultValue={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
    <div className="rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question, index) => (
              <tr key={question.documentId} className="even:bg-gray-50">
                <td className="px-2 py-4 whitespace-normal text-sm text-gray-900 space-y-4">
                  <div className="flex justify-between items-center gap-2">
                    <div className="font-medium text-gray-900 flex-1">{question.content}</div>
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-200 px-2 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                      {expandedStates[index] ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </button>
                  </div>
                  {expandedStates[index] && (
                    <>
                      <div className="mt-2 p-3 bg-green-50 rounded-lg">
                        <div className="text-xs font-semibold text-green-700">Correct Answer</div>
                        <div className="mt-1 text-gray-900">{question.correctAnswer}</div>
                      </div>

                      <div className="mt-2 p-3 bg-red-50 rounded-lg">
                        <div className="text-xs font-semibold text-red-700">Incorrect Answers</div>
                        <div className="mt-2 space-y-2">
                          <div className="p-2 bg-white rounded border border-red-100">{question.incorrect_1}</div>
                          <div className="p-2 bg-white rounded border border-red-100">{question.incorrect_2}</div>
                          <div className="p-2 bg-white rounded border border-red-100">{question.incorrect_3}</div>
                        </div>
                      </div>

                      {question.explanation && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs font-semibold text-blue-700">Explanation</div>
                          <div className="mt-1 text-gray-900">{question.explanation}</div>
                        </div>
                      )}
                    </>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => useModalStore.getState().onOpen("editQuestion", {
                        question: {
                          documentId: question.documentId,
                        }
                      })}
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                      onClick={() => useModalStore.getState().onOpen("deleteConfirmation",
                        {
                          delete: {
                            documentId: question.documentId,
                            target: "question"
                          }
                        }
                      )} >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div className="flex justify-between items-center pt-4">
      <Button
        variant="outline"
        onClick={() => setCurrPage(prev => Math.max(1, prev - 1))}
        disabled={currPage === 1}
      >
        Previous
      </Button>
      <div>Page {currPage} of {totalPages}</div>
      <Button
        variant="outline"
        onClick={() => setCurrPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currPage === totalPages}
      >
        Next
      </Button>
    </div>
    </>
  )
}
