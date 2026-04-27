import { AuditLogDescription } from "@/features/audit-logs/components/audit-log-description";
import { TAuditLog } from "@/features/audit-logs/types/audit-log";

export function ItemActivity({ itemActivity }: { itemActivity: TAuditLog }) {
  return (
    <div className="flex flex-col gap-1">
      <p><AuditLogDescription auditLog={itemActivity} /></p>
      <p className="text-muted-foreground">{itemActivity.created_at}</p>
    </div>
  );
}
