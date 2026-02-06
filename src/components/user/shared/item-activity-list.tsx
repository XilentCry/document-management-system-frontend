import { TActivity } from "@/types/activity";
import { ItemActivity } from "./item-activity";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ItemActivityList({
  itemActivities,
}: {
  itemActivities: TActivity[];
}) {
  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="flex flex-col gap-4">
        {itemActivities.map((itemActivity) => (
          <ItemActivity key={itemActivity.id} itemActivity={itemActivity} />
        ))}
      </div>
    </ScrollArea>
  );
}
