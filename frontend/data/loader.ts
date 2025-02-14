export type SelectOption = {
  value: string;
  option: string;
};

//TODO: replace this with db data source
const categoryOptions: SelectOption[] = [
  { value: "type_0", option: "Type 0" },
  { value: "type_1", option: "Type 1" },
  { value: "type_2", option: "Type 2" },
];
//TODO: replace this with db data source
const difficultyOptions = [
  { value: "easy", option: "Easy" },
  { value: "medium", option: "Medium" },
  { value: "hard", option: "Hard" },
];

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

//TODO: call db data
export async function getQuestions(category: string, difficulty: string, limit: string) {
  const res = await fetch(
    `https://the-trivia-api.com/api/questions?categories=science&limit=${limit}&type=multiple&difficulty=${difficulty}`,
    {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data!");
  }

  return res.json();
}