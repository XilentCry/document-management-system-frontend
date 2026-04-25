"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format-date";
import { useSubmittersRailStore } from "@/stores/submitters-rail-store";
import { TDocusealSubmission } from "@/types/docuseal-submission";
import { SigningStatusBadge } from "../signings/signing-status-badge";
import { SubmissionActions } from "./submission-actions";

interface SubmissionTableProps {
  data: TDocusealSubmission[];
}

export function SubmissionTable({ data }: SubmissionTableProps) {
  const {
    openRail,
    setOpenRail,
    setSelectedSubmissionId,
    setSelectedSubmissionName,
  } = useSubmittersRailStore();

  const handleSelect = (item: TDocusealSubmission) => {
    setSelectedSubmissionId(item.id);
    setSelectedSubmissionName(item.template.name);
    setOpenRail(true);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <TableHead>Status</TableHead>
          {!openRail && <TableHead>Submitters</TableHead>}
          <TableHead>Date sent</TableHead>
          {!openRail && <TableHead>Completed</TableHead>}
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow
            key={item.id}
            onClick={() => handleSelect(item)}
          >
            <TableCell>{item.template.name}</TableCell>
            <TableCell>
              <SigningStatusBadge status={item.status} />
            </TableCell>
            {!openRail && (
              <TableCell>
                {item.submitters.length}
              </TableCell>
            )}
            <TableCell>{formatDate(item.created_at)}</TableCell>
            {!openRail && (
              <TableCell>
                {item.completed_at ? formatDate(item.completed_at) : <>&mdash;</>}
              </TableCell>
            )}
            <TableCell>
              <SubmissionActions item={item} onViewSubmitters={handleSelect} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
