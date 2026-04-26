"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TDocusealSubmission } from "@/types/docuseal-submission";
import { Activity, EllipsisVertical, UsersRound } from "lucide-react";

interface SubmissionActionsProps {
  item: TDocusealSubmission;
  onViewSubmitters: (item: TDocusealSubmission) => void;
}

export function SubmissionActions({
  item,
  onViewSubmitters,
}: SubmissionActionsProps) {
  const auditUrl = item.audit_log_url;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => e.stopPropagation()}
          />
        }
      >
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onViewSubmitters(item);
          }}
        >
          <UsersRound />
          Submitters
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!auditUrl}
          onClick={(e) => {
            e.stopPropagation();
            if (auditUrl) {
              window.open(auditUrl, "_blank", "noopener,noreferrer");
            }
          }}
        >
          <Activity />
          Audit Log
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
