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

export function getCategoryName(category: string): string {
  const found = categoryOptions.find(opt => opt.value === category);
  return found?.option || 'Unknown Category';
}
