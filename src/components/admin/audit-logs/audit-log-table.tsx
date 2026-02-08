import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetDescription } from "@/hooks/use-get-description";
import { TAuditLog } from "@/types/audit-log";

export function AuditLogTable({ auditLogs }: { auditLogs: TAuditLog[] }) {
  const { getDescription } = useGetDescription();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Occurred</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditLogs.map((auditLog) => (
          <TableRow key={auditLog.id}>
            <TableCell>{getDescription(auditLog)}</TableCell>
            <TableCell>{auditLog.created_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
