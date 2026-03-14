import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetDetails } from "@/hooks/use-get-details";
import { useUserStore } from "@/stores/user-store";
import { TAuditLog } from "@/types/audit-log";

export function AuditLogTable({ auditLogs }: { auditLogs: TAuditLog[] }) {
  const { getDetails } = useGetDetails();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Occurred</TableHead>
          <TableHead>Actor</TableHead>
          <TableHead>Actions</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditLogs.map((auditLog) => (
          <TableRow key={auditLog.id}>
            <TableCell>{auditLog.created_at}</TableCell>
            <TableCell>
              {auditLog.actor.first_name} {auditLog.actor.middle_name ?? ""} {auditLog.actor.last_name}
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{auditLog.action}</Badge>
            </TableCell>
            <TableCell>
              {auditLog.action === "renamed"
                ? auditLog.properties.old_name
                : auditLog.properties.name}
            </TableCell>
            <TableCell className="whitespace-normal">
              {getDetails(auditLog)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
