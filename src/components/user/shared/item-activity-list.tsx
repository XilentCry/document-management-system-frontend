import { TActivity } from "@/types/activity";
import { ItemActivity } from "./item-activity";

export function ItemActivityList({
  itemActivities,
}: {
  itemActivities: TActivity[];
}) {
  return (
    <>
      {itemActivities.map((itemActivity) => (
        <ItemActivity key={itemActivity.id} itemActivity={itemActivity} />
      ))}
    </>
  );
}
