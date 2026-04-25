"use client";

import { TDocusealSubmission } from "@/types/docuseal-submission";
import { SubmissionGridItem } from "./submission-grid-item";
import { useSubmittersRailStore } from "@/stores/submitters-rail-store";

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
