import { useUserStore } from "@/stores/user-store";
import { TAuditLog } from "@/types/audit-log";

export function useGetDescription() {
  const userId = useUserStore((state) => state.userId);

  const getDescription = (auditLog: TAuditLog) => {
    const actor =
      userId === auditLog.actor.id
        ? "You"
        : `${auditLog.actor.first_name} ${
            auditLog.actor.middle_name ?? ""
          } ${auditLog.actor.last_name}`;

    switch (auditLog.action) {
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
