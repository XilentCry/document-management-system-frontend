import { useUserStore } from "@/stores/user-store";
import { TActivity } from "@/types/activity";

export function ItemActivity({ itemActivity }: { itemActivity: TActivity }) {
  const userId = useUserStore((state) => state.userId);

  const actor =
    userId === itemActivity.actor.id
      ? "You"
      : `${itemActivity.actor.first_name} ${
          itemActivity.actor.middle_name ?? ""
        } ${itemActivity.actor.last_name}`;

  const description = () => {
    switch (itemActivity.action) {
      case "uploaded":
        return (
          <>
            {actor} uploaded{" "}
            <span className="text-primary">{itemActivity.properties.name}</span>{" "}
            in{" "}
            <span className="text-primary">
              {itemActivity.properties.parent}
            </span>
          </>
        );

      case "created":
        return (
          <>
            {actor} created{" "}
            <span className="text-primary">{itemActivity.properties.name}</span>{" "}
            in{" "}
            <span className="text-primary">
              {itemActivity.properties.parent}
            </span>
          </>
        );

      case "renamed":
        return (
          <>
            {actor} renamed{" "}
            <span className="text-primary">
              {itemActivity.properties.old_name}
            </span>{" "}
            to{" "}
            <span className="text-primary">
              {itemActivity.properties.new_name}
            </span>
          </>
        );

      case "moved":
        return (
          <>
            {actor} moved{" "}
            <span className="text-primary">{itemActivity.properties.name}</span>{" "}
            to{" "}
            <span className="text-primary">
              {itemActivity.properties.new_parent}
            </span>
          </>
        );
      case "viewed":
        return (
          <>
            {actor} viewed{" "}
            <span className="text-primary">{itemActivity.properties.name}</span>{" "}
            in{" "}
            <span className="text-primary">
              {itemActivity.properties.parent}
            </span>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <p>{description()}</p>
      <p className="text-muted-foreground">{itemActivity.created_at}</p>
    </div>
  );
}
