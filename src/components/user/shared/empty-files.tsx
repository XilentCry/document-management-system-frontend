import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Files } from "lucide-react";

export function EmptyFiles() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Files />
        </EmptyMedia>
        <EmptyTitle>No files yet</EmptyTitle>
        <EmptyDescription>
          Files and folders you add will appear here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
