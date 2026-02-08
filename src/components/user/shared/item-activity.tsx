import { useGetDescription } from "@/hooks/use-get-description";
import { TAuditLog } from "@/types/audit-log";

export function ItemActivity({ itemActivity }: { itemActivity: TAuditLog }) {
  const { getDescription } = useGetDescription();

  return (
    <div className="flex flex-col gap-1">
      <p>{getDescription(itemActivity)}</p>
      <p className="text-muted-foreground">{itemActivity.created_at}</p>
    </div>
  );
}
