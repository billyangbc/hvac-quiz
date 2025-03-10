import { getResults } from "@/lib/actions/quiz/quiz-actions";
import TestStatus from "@/components/quiz/TestStatus";

const StatusPage = async () => {
  const result = await getResults();
  console.log("++++ status =>", result);
  return (
    <TestStatus
      testResult={result}
    />
  );
}

export default StatusPage;