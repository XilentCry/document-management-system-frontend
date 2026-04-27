"use client";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetSubmissionDetails } from "@/features/auth/api/me-queries";
import { useSubmittersRailStore } from "@/features/submissions/store/submitters-rail-store";
import { TDocusealSubmitter } from "@/features/submissions/types/docuseal-submission";
import { FileText, X } from "lucide-react";
import { SigningStatusBadge } from "@/features/signings/components/signing-status-badge";

function formatDateTime(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function timelineRow(label: string, value: string | null) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function SubmitterCard({ submitter }: { submitter: TDocusealSubmitter }) {
  const display = submitter.name?.trim() || submitter.email;

  return (
    <div className="rounded-md border p-3 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{display}</p>
          {submitter.name && (
            <p className="text-xs text-muted-foreground truncate">
              {submitter.email}
            </p>
          )}
          <p className="text-xs text-muted-foreground truncate">
            {submitter.role}
          </p>
        </div>
        <SigningStatusBadge status={submitter.status} className="shrink-0" />
      </div>
      <div className="flex flex-col gap-1">
        {timelineRow("Sent", formatDateTime(submitter.sent_at))}
        {timelineRow("Opened", formatDateTime(submitter.opened_at))}
        {timelineRow("Completed", formatDateTime(submitter.completed_at))}
        {timelineRow("Declined", formatDateTime(submitter.declined_at))}
      </div>
    </div>
  );
}

export function SubmittersRail() {
  const {
    openRail,
    selectedSubmissionId,
    selectedSubmissionName,
    setOpenRail,
    setSelectedSubmissionId,
    setSelectedSubmissionName,
  } = useSubmittersRailStore();

  const { data, isLoading, isError, error } = useGetSubmissionDetails(
    selectedSubmissionId,
    openRail,
  );

  if (!openRail) return null;

  const handleClose = () => {
    setOpenRail(false);
    setSelectedSubmissionId(null);
    setSelectedSubmissionName(null);
  };

  return (
    <div className="border-l w-80 sticky top-14 flex flex-col h-[calc(100svh-56px)]">
      <Item>
        <ItemMedia>
          <FileText className="size-4" />
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle className="block w-auto truncate">
            {data?.template?.name ?? selectedSubmissionName ?? "Submission"}
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X />
          </Button>
        </ItemActions>
      </Item>
      <div className="min-h-0 p-4 pt-0 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Submitters</p>
          {data && (
            <span className="text-xs text-muted-foreground">
              {data.submitters.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError && error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-destructive text-sm">{error.message}</p>
          </div>
        ) : data ? (
          <ScrollArea className="flex-1 min-h-0">
            <div className="flex flex-col gap-2">
              {data.submitters.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No submitters yet.
                </p>
              ) : (
                data.submitters.map((submitter) => (
                  <SubmitterCard key={submitter.id} submitter={submitter} />
                ))
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="text-primary size-6" />
          </div>
        )}
      </div>
    </div>
  );
}
