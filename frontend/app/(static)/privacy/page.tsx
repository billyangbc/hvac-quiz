import MarkdownCard from "@/components/markdown/MarkdownCard";
import { loadFile } from "@/data/loader";

const staticFilePath: string = "/data/static";
export default async function Terms() {
  const content = await loadFile(staticFilePath + "/" +  "privacy-policy.md");
  return (
    <>
    <MarkdownCard content={content} css="border-2">
    </MarkdownCard>
    </>
  );
}
