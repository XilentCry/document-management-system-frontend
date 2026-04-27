"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Image from "next/image";
import { formatDate } from "@/lib/format-date";
import { TDocusealSubmission } from "@/features/submissions/types/docuseal-submission";
import { SigningStatusBadge } from "@/features/signings/components/signing-status-badge";
import { SubmissionActions } from "./submission-actions";
import { useSubmittersRailStore } from "@/features/submissions/store/submitters-rail-store";

interface SubmissionGridItemProps {
  item: TDocusealSubmission;
}

export function SubmissionGridItem({ item }: SubmissionGridItemProps) {
  const { setOpenRail, setSelectedSubmissionId, setSelectedSubmissionName } =
    useSubmittersRailStore();

  const handleSelect = (submission: TDocusealSubmission) => {
    setSelectedSubmissionId(submission.id);
    setSelectedSubmissionName(submission.template.name);
    setOpenRail(true);
  };

  const title = item.name ?? item.template.name;

  return (
    <Item variant="muted" size="xs" onClick={() => handleSelect(item)}>
      <ItemMedia>
        <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="block w-auto truncate">{title}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <SubmissionActions item={item} onViewSubmitters={handleSelect} />
      </ItemActions>
      <ItemFooter className="min-w-0">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <SigningStatusBadge status={item.status} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground truncate">
              {item.submitters.length}{" "}
              {item.submitters.length === 1 ? "submitter" : "submitters"}
            </p>
            <p className="shrink-0">{formatDate(item.created_at)}</p>
          </div>
        </div>
      </ItemFooter>
    </Item>
  );
}
