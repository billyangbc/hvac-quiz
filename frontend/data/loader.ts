export type SelectOption = {
  value: string;
  option: string;
};

//TODO: replace this with db data source
const difficultyOptions = [
  { value: "easy", option: "Easy" },
  { value: "medium", option: "Medium" },
  { value: "hard", option: "Hard" },
];

import categoryOptions from './quiz-categories.json';
export function getCategoryOptions(): SelectOption[] {
  return categoryOptions;
}

export function getDifficultyOptions(): SelectOption[] {
  return difficultyOptions;
}

export const alphabeticNumeral = (index: number) => {
  const asciiCode = index + 65;
  const letter = String.fromCharCode(asciiCode);
  return letter + ". ";
};

export function getCategoryName(category: string): string {
  const found = categoryOptions.find(opt => opt.value === category);
  return found?.option || 'Unknown Category';
}

export const validateCategory = (category: string) => {
  const validCategories = categoryOptions.map((option) => option.value);
  return validCategories.includes(category);
};

export const validateDifficulty = (difficulty: string) => {
  const validDifficulties = difficultyOptions.map((option) => option.value);
  return validDifficulties.includes(difficulty);
};

import quizQuestions from './quiz-questions.json';
import { QuizQuestion } from "@/types/QuizQuestion";
export async function getQuestions(category: string, difficulty: string, limit: string) {
  // Transform category format (type_0 -> Type-0)
  const formattedCategory = category
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');

  // Filter questions by category and difficulty
  const filteredQuestions = quizQuestions.filter((q: QuizQuestion) => 
    q.category === formattedCategory && q.difficulty === difficulty
  );

  // Shuffle questions using Fisher-Yates algorithm
  const shuffledQuestions = filteredQuestions
    .map((value: QuizQuestion) => ({ value, sort: Math.random() }))
    .sort((a: {sort: number}, b: {sort: number}) => a.sort - b.sort)
    .map(({ value }: {value: QuizQuestion}) => value);

  // Apply limit and return
  return shuffledQuestions.slice(0, parseInt(limit, 10));
}

////////////////////////////////////////////////////////////////////////////////
import fs from "fs";
import path from "path";
import matter from "gray-matter";
export async function loadFile(dirFilename: string): Promise<string> {
  const filePath = path.join(process.cwd(), dirFilename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { /*data,*/ content } = matter(fileContent);
  return content;
};