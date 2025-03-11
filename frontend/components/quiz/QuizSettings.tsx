"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import { getQuestionMeta, createTest } from "@/lib/actions/quiz/quiz-actions";
import { Card } from "@/components/ui/card";
import { FileQuestion, AlertCircle } from "lucide-react";

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
    quizSettingData?.length === 1 ? quizSettingData[0] : null
  );
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [limit, setLimit] = useState([10]);
  const [questionsMeta, setQuestionsMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchQuestionsMeta = async () => {
      if (category) {
        setLoading(true);
        try {
          const meta = await getQuestionMeta(category);
          setQuestionsMeta(meta);
        } catch (error) {
          console.error("Error fetching questions meta:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setQuestionsMeta(null);
      }
    };
    
    fetchQuestionsMeta();
  }, [category]);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuizStart = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await createTest(category, difficulty, limit[0].toString());
      console.log("++++++++++++", result);
      if (result?.documentId) {

        router.push(
          `/quiz/test/${result.documentId}?category=${category}&difficulty=${difficulty}&limit=${limit[0]}`
        );
      } else {
        let errorMessage = 'Failed to start quiz. Please try again.';
        if (typeof result === 'object' && result.apiErrors) {
          errorMessage = result.apiErrors;
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        {quizSettingData?.length === 1 ? quizSettingData[0].name : "Setup your quiz:"}
      </h2>

      {quizSettingData?.length > 1 && (
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
      
      {loading && (
        <div className="w-full md:max-w-xs xl:max-w-md text-center py-2">
          <p className="text-sm text-muted-foreground">Loading questions information...</p>
        </div>
      )}
      
      {!loading && category && questionsMeta && (
        <Card className="w-full md:max-w-xs xl:max-w-md p-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Questions Information</h3>
          </div>
          <div className="text-sm space-y-1">
            <p>Total questions: <span className="font-medium">{questionsMeta.pagination?.total || 0}</span></p>
            {questionsMeta.pagination?.total === 0 && (
              <div className="flex items-center gap-1 text-amber-500 mt-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-xs">No questions available for this category</p>
              </div>
            )}
          </div>
        </Card>
      )}

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
      <Button 
        disabled={!difficulty || !category || (questionsMeta && questionsMeta.pagination?.total === 0)} 
        onClick={handleQuizStart}
      >
        Start Quiz
      </Button>
    </div>
  );
};

export default QuizSettings;
