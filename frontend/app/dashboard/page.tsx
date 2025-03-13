import MarkdownCard from "@/components/markdown/MarkdownCard";
import { loadFile } from "@/lib/loader";

const staticFilePath: string = "/data/static";
export default async function DashboardPage() {
  const content = await loadFile(staticFilePath + "/" +  "quick-start.md");
  return (
    <>
    <MarkdownCard content={content} css="border-2">
    </MarkdownCard>
    </>
  );
}