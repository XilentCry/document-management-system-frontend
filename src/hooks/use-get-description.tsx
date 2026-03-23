import { useUserStore } from "@/stores/user-store";
import { TAuditLog } from "@/types/audit-log";

export function useGetDescription() {
  const userId = useUserStore((state) => state.userId);

  const getDescription = (auditLog: TAuditLog) => {
    const actor =
      userId === auditLog.actor.id
        ? "You"
        : `${auditLog.actor.first_name} ${auditLog.actor.middle_name ?? ""
        } ${auditLog.actor.last_name}`;

    switch (auditLog.action) {
      case "shared":
        return (
          <>
            {actor} shared{" "}
            <span className="text-primary">{auditLog.properties.name}</span>{" "}
            with{" "}
            {auditLog.properties.shared_with.length === 1 ? (
              <span className="text-primary">
                {auditLog.properties.shared_with[0]}
              </span>
            ) : (
              <>
                {auditLog.properties.shared_with
                  .slice(0, -1)
                  .map((name, index, array) => (
                    <span key={name}>
                      <span className="text-primary">{name}</span>
                      {index < array.length - 1 && ", "}
                    </span>
                  ))}
                {" and "}
                <span className="text-primary">
                  {auditLog.properties.shared_with.at(-1)}
                </span>
              </>
            )}
          </>
        );

      case "uploaded":
        return (
          <>
            {actor} uploaded{" "}
            <span className="text-primary">{auditLog.properties.name}</span> in{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </>
        );

      case "created":
        return (
          <>
            {actor} created{" "}
            <span className="text-primary">{auditLog.properties.name}</span> in{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </>
        );

      case "edited":
        return (
          <>
            {actor} edited{" "}
            <span className="text-primary">{auditLog.properties.name}</span> in{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </>
        );

      case "renamed":
        return (
          <>
            {actor} renamed{" "}
            <span className="text-primary">{auditLog.properties.old_name}</span>{" "}
            to{" "}
            <span className="text-primary">{auditLog.properties.new_name}</span>
          </>
        );

      case "moved":
        return (
          <>
            {actor} moved{" "}
            <span className="text-primary">{auditLog.properties.name}</span> to{" "}
            <span className="text-primary">
              {auditLog.properties.new_parent}
            </span>
          </>
        );

      case "viewed":
        return (
          <>
            {actor} viewed{" "}
            <span className="text-primary">{auditLog.properties.name}</span> in{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </>
        );

      case "user_status_updated":
        return (
          <>
            {actor} updated{" "}
            <span className="text-primary">
              {auditLog.properties.name}
              {auditLog.properties.name.endsWith("s") ? "'" : "'s"}
            </span>{" "}
            status to{" "}
            <span className="text-primary">
              {auditLog.properties.new_status}
            </span>
          </>
        );

      case "user_updated":
        return (
          <>
            {actor} updated{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );
    }
  };

  return { getDescription };
}
