"use client";

import { TDocusealSubmission } from "@/features/submissions/types/docuseal-submission";
import { SubmissionGridItem } from "./submission-grid-item";
import { useSubmittersRailStore } from "@/features/submissions/store/submitters-rail-store";

export function SubmissionGrid({ data }: { data: TDocusealSubmission[] }) {
  const { openRail } = useSubmittersRailStore();

  return (
    <div className={`grid ${openRail ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
      {data.map((item) => (
        <SubmissionGridItem key={item.id} item={item} />
      ))}
    </div>
  );
}
