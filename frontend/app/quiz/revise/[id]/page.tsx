import ReviseTest from "@/components/quiz/ReviseTest";
import { getReviseTest } from "@/lib/actions/quiz/quiz-actions";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type paramsType = Promise<{id: string;}>;

const RevisePage = async (props: {
  params: paramsType,
}) => {
  const { id } = await props.params;
  const responseData = await getReviseTest(id);
  console.log("revise questions list => ", responseData);

  if (!responseData?.failedQuestions || responseData.failedQuestions?.length < 1) {
    return (
      <div className="flex h-[calc(100vh-160px)] items-center justify-center">
        <Card className="animate-in zoom-in-90 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-16 w-16 text-amber-500" />
            <h2 className="text-lg font-semibold tracking-tight">
              There is no question to review
            </h2>
            <p className="text-muted-foreground">
              You have no failed questions that need to be reviewed
            </p>
            <Button asChild className="mt-2">
              <Link href="/stats">Return to Test Status</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
    <ReviseTest
      failedQuestions={responseData.failedQuestions}
    />
    </>
  );
};

export default RevisePage;
