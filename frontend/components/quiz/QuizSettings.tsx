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
import { SelectOption, getCategoryOptions, getDifficultyOptions } from "@/data/loader";

const QuizSettings = () => {
  const router = useRouter();
  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [limit, setLimit] = useState([10]);

  const handleQuizStart = () => {
    router.push(
      `/quiz/${category}?difficulty=${difficulty}&limit=${limit[0]}`
    );
  };

  const categoryOptions = getCategoryOptions();
  const difficultyOptions = getDifficultyOptions();
  return (
    <div className="flex flex-col justify-center items-center gap-4 md:gap-6">
      <h2 className="text-xl font-bold mt-4 w-full">Setup your quiz:</h2>
      <Select value={category} onValueChange={(value) => setCategory(value)}>
        <SelectTrigger className="w-full md:max-w-xs xl:max-w-md">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((category: SelectOption) => (
            <SelectItem value={category.value} key={category.value}>
              {category.option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
