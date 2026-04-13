import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetDetails } from "@/hooks/use-get-details";
import { TAuditLog } from "@/types/audit-log";

export function AuditLogTable({ auditLogs }: { auditLogs: TAuditLog[] }) {
  const { getDetails } = useGetDetails();

  return (
    <ScrollArea>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date occurred</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>IP address</TableHead>
            <TableHead>User agent</TableHead>
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
                {auditLog.action === "item.rename"
                  ? auditLog.properties.old_name
                  : auditLog.properties.name}
              </TableCell>
              <TableCell>{auditLog.ip_address ?? "N/A"}</TableCell>
              <TableCell>
                {auditLog.user_agent ?? "N/A"}
              </TableCell>
              <TableCell>
                {getDetails(auditLog)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
