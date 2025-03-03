'use client';

import { useActionState, useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StrapiErrors } from "@/components/custom/StrapiErrors";
import { createQuestionAction } from "@/lib/actions/question-actions";
import { getCategories } from "@/lib/actions/category-actions";

interface Category {
  documentId: string;
  id: string;
  categoryName: string;
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

export const CreateQuestion = () => {
  const [state, action, isPending] = useActionState(createQuestionAction, null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories({});
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Create New Question
      </h2>
      
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <Select name="category" required>
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty
            </label>
            <Select defaultValue="medium" name="difficulty" required>
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
        </div>

        {/* Question Content */}
        <div className="space-y-2">
          {/*
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Question
          </label>
          */}
          <Input
            name="content"
            placeholder="Enter question content"
            required
            className="dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* Correct Answer */}
        <div className="space-y-2">
          {/*
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Correct Answer
          </label>
          */}
          <Input
            name="correctAnswer"
            placeholder="Enter correct answer"
            required
            className="dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* Incorrect Answers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="space-y-2">
              {/*
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Incorrect Answer {num}
              </label>
              */}
              <Input
                name={`incorrect_${num}`}
                placeholder={`Enter incorrect answer ${num}`}
                required
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          {/*
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Explanation
          </label>
          */}
          <Input
            name="explanation"
            placeholder="Enter question explanation"
            required
            className="dark:bg-gray-700 dark:border-gray-600"
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
          {isPending ? 'Creating Question...' : 'Create Question'}
        </Button>
      </form>
    </div>
  );
};
