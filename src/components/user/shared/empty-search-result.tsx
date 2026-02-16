import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Search } from "lucide-react";

export function EmptySearchResult() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>
          None of your files or folders matched this search
        </EmptyTitle>
        <EmptyDescription>
          Try another search, or use search options to find a file by type,
          owner, and more.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
