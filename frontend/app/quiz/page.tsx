import QuizSettings from "@/components/quiz/QuizSettings";
import { Separator } from "@/components/ui/separator";
import { getQuizSettingData, getDifficultyOptions } from "@/lib/actions/quiz/quiz-actions";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default async function Home() {
  const settingData = await getQuizSettingData();
  console.log("quiz setting => ", settingData);
  const difficultyOptions = await getDifficultyOptions();
  return (
    <div className="bg-white p-3 shadow-md w-full mt-10 md:w-[90%] lg:w-[70%] max-w-4xl md:rounded-lg">
      <h1 className="text-2xl lg:text-4xl font-bold text-primary tracking-wider uppercase text-center py-2">
        Welcome to ENZE Pro Quiz
      </h1>
      <Separator />
      {settingData && settingData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 p-2 md:px-6 py-3 gap-4">
          <div className="relative h-full">
            <Image
              src={"/quiz-settings.svg"}
              alt="quiz-settings"
              priority
              width={450}
              height={450}
              className="object-cover object-center mx-auto"
            />
          </div>
          <QuizSettings
            quizSettingData={settingData}
            difficultyOptions={difficultyOptions}
          />
        </div>
      ) : (
        <div className="p-2 md:px-6 py-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-amber-500" />
                <CardTitle className="text-xl">No Quiz Settings Available</CardTitle>
              </div>
              <CardDescription>
                You don&apos;t have access to any quiz settings at the moment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Please contact your instructor to get enrolled in a quiz program. Once enrolled, 
                you&apos;ll be able to access and take quizzes through this platform.
              </p>
            </CardContent>
            <CardFooter>
              {/*
              <Button variant="outline" className="w-full sm:w-auto">
                Contact Instructor
              </Button>
              */}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
