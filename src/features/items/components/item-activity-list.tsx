import { TAuditLog } from "@/features/audit-logs/types/audit-log";
import { ItemActivity } from "@/features/items/components/item-activity";

export function ItemActivityList({
  itemActivities,
}: {
  itemActivities: TAuditLog[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {itemActivities.map((itemActivity) => (
        <ItemActivity key={itemActivity.id} itemActivity={itemActivity} />
      ))}
    </div>
  );
}
