'use client';

import { useActionState, useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StrapiErrors } from "@/components/custom/StrapiErrors";
import { createQuestionFromForm, updateQuestionFromForm, getQuestion } from "@/lib/actions/dashboard/question-actions";
import { getCategories } from "@/lib/actions/dashboard/category-actions";

interface Category {
  documentId: string;
  id: string;
  categoryName: string;
}

interface QuestionData {
  id: string;
  documentId: string;
  content: string;
  correctAnswer: string;
  incorrect_1: string;
  incorrect_2: string;
  incorrect_3: string;
  explanation: string;
  difficulty: string;
  category: Category;
}

interface QuestionFormProps {
  mode: 'create' | 'edit';
  questionId?: string;
  onSuccess?: () => Promise<void>;
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

export const QuestionForm = ({ mode = 'create', questionId, onSuccess }: QuestionFormProps) => {
  const [state, action, isPending] = useActionState(
    mode === 'create' ? createQuestionFromForm : updateQuestionFromForm, 
    null
  );
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [isLoading, setIsLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (state && !state.apiErrors && onSuccess) {
      onSuccess();
    }
  }, [state, onSuccess]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    
    const loadQuestion = async () => {
      if (mode === 'edit' && questionId) {
        try {
          setIsLoading(true);
          const response = await getQuestion(questionId);
          setQuestion(response.data);
        } catch (error) {
          console.error("Error loading question:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCategories();
    loadQuestion();
  }, [mode, questionId]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading question data...</div>;
  }

  const isEditMode = mode === 'edit' && question;
  const title = isEditMode ? "Edit Question" : "Create New Question";
  const buttonText = isPending 
    ? (isEditMode ? "Updating Question..." : "Creating Question...") 
    : (isEditMode ? "Update Question" : "Create Question");

  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      
      <form action={action} className="space-y-4">
        {/* Hidden field for document ID when editing */}
        {isEditMode && (
          <input type="hidden" name="documentId" value={question.documentId} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <Select 
              name="category" 
              required
              defaultValue={isEditMode ? question.category?.documentId : undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.documentId} value={category.documentId}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Select */}
          <input type="hidden" name="difficulty" value={isEditMode ? question.difficulty : "medium"}  />
          {/*
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty
            </label>
            <Select 
              defaultValue={isEditMode ? question.difficulty : "medium"} 
              name="difficulty" 
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          */}
        </div>

        {/* Question Content */}
        <div className="space-y-2">
          <Input
            name="content"
            placeholder="Enter question content"
            required
            defaultValue={isEditMode ? question.content : ""}
            className="dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* Correct Answer */}
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-xs font-semibold text-green-700 mb-2">Correct Answer</div>
          <Input
            name="correctAnswer"
            placeholder="Enter correct answer"
            required
            defaultValue={isEditMode ? question.correctAnswer : ""}
            className="bg-white border-green-100 focus-visible:ring-green-200"
          />
        </div>

        {/* Incorrect Answers */}
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="text-xs font-semibold text-red-700 mb-2">Incorrect Answers</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="space-y-2">
                <Input
                  name={`incorrect_${num}`}
                  placeholder={`Incorrect answer ${num}`}
                  required
                  defaultValue={isEditMode ? question[`incorrect_${num}` as keyof typeof question] as string : ""}
                  className="bg-white border-red-100 focus-visible:ring-red-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-xs font-semibold text-blue-700 mb-2">Explanation</div>
          <Input
            name="explanation"
            placeholder="Enter question explanation"
            required
            defaultValue={isEditMode ? question.explanation : ""}
            className="bg-white border-blue-100 focus-visible:ring-blue-200"
          />
        </div>

        {/* Error Display */}
        {state?.apiErrors && <StrapiErrors error={state.apiErrors} />}

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {buttonText}
        </Button>
      </form>
    </div>
  );
};
