import { TAuditLog } from "@/types/audit-log";
import { ItemActivity } from "./item-activity";

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
