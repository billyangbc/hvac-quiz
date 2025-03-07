import { Category } from "@/types/dashboard/Category";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionSearchFormProps {
  category: string;
  categories: Category[];
  search: string;
  page: string;
}

export function QuestionSearchForm({
  category,
  categories,
  search,
  page,
}: QuestionSearchFormProps) {
  return (
    <form className="space-y-4 my-4" method="GET">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select name="category" defaultValue={category}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.documentId}>
                {cat.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="search"
          placeholder="Search questions..."
          defaultValue={search}
          className="flex-1"
        />
        <input type="hidden" name="page" value={page} />
        <Button type="submit" variant="default">
          Apply Filters
        </Button>
        <Button
          asChild
          variant="outline"
          className={cn(category || search ? "visible" : "invisible")}
        >
          <Link href="/dashboard/question">
            Clear
          </Link>
        </Button>
      </div>
    </form>
  );
}
