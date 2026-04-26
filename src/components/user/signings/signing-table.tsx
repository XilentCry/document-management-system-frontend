import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDate } from "@/lib/format-date";
import { TUserSubmission } from "@/types/docuseal-submission";
import { SigningActions } from "./signing-actions";
import { SigningStatusBadge } from "./signing-status-badge";

interface SigningTableProps {
  data: TUserSubmission[];
}

export function SigningTable({ data }: SigningTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Date created</TableHead>
          <TableHead>Date completed</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              {item.template.name}
            </TableCell>
            <TableCell>
              <SigningStatusBadge status={item.status} />
            </TableCell>
            <TableCell>
              {item.role}
            </TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
            <TableCell>{item.completed_at ? formatDate(item.completed_at) : <>&mdash;</>}</TableCell>
            <TableCell>
              <SigningActions item={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
