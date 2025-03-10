"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Category } from "@/types/dashboard/Category";

type SelectOption = {
  value: string;
  option: string;
};

type QuizSettingData = {
  id: number;
  documentId: string;
  name: string;
  categories: Category[];
};

const QuizSettings = ({
    quizSettingData,
    difficultyOptions
  }: {
    quizSettingData: QuizSettingData[],
    difficultyOptions: SelectOption[]
  }) => {
  const router = useRouter();
  const [category, setCategory] = useState<string>("");
  const [selectedQuizSetting, setSelectedQuizSetting] = useState<QuizSettingData | null>(
    quizSettingData.length === 1 ? quizSettingData[0] : null
  );
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [limit, setLimit] = useState([10]);

  const handleQuizStart = () => {
    router.push(
      `/quiz/${category}?difficulty=${difficulty}&limit=${limit[0]}`
    );
  };

  const categoryOptions = selectedQuizSetting
    ? selectedQuizSetting.categories.map((cat: Category) => ({
        value: cat.documentId,
        option: cat.categoryName,
      }))
    : [];

  return (
    <div className="flex flex-col justify-center items-center gap-4 md:gap-6">
      <h2 className="text-xl font-bold mt-4 w-full">
        {quizSettingData.length === 1 ? quizSettingData[0].name : "Setup your quiz:"}
      </h2>

      {quizSettingData.length > 1 && (
        <Select
          value={selectedQuizSetting?.documentId || ""}
          onValueChange={(value) => {
            const setting = quizSettingData.find((q) => q.documentId === value);
            setSelectedQuizSetting(setting || null);
            setCategory("");
          }}
        >
          <SelectTrigger className="w-full md:max-w-xs xl:max-w-md">
            <SelectValue placeholder="Select an Enrollment" />
          </SelectTrigger>
          <SelectContent>
            {quizSettingData.map((setting) => (
              <SelectItem value={setting.documentId} key={setting.documentId}>
                {setting.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={category}
        onValueChange={(value) => setCategory(value)}
        disabled={!selectedQuizSetting}
      >
        <SelectTrigger className="w-full md:max-w-xs xl:max-w-md">
          <SelectValue placeholder={selectedQuizSetting ? "Category" : "Select enrollment first"} />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((category: SelectOption) => (
            <SelectItem value={category.value} key={category.value}>
              {category.option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/*>>>> hide the difficult (always medium) */}
      <div className="hidden">
      <Select
        value={difficulty}
        onValueChange={(value) => setDifficulty(value)}
      >
        <SelectTrigger className="w-full md:max-w-xs xl:max-w-md">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          {difficultyOptions.map((difficulty) => (
            <SelectItem value={difficulty.value} key={difficulty.value}>
              {difficulty.option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/*<<<< hide the difficult (always medium) */}
      </div>
      <p className="text-sm font-semibold">
        How many questions do you want to answer?: {limit[0]}
      </p>
      <Slider
        value={limit}
        onValueChange={(value) => setLimit(value)}
        max={50}
        step={5}
        min={5}
        className="w-full md:max-w-xs xl:max-w-md"
      />
      <Button disabled={!difficulty || !category} onClick={handleQuizStart}>
        Start Quiz
      </Button>
    </div>
  );
};

export default QuizSettings;
