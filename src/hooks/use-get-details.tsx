import { TAuditLog } from "@/types/audit-log";

export function useGetDetails() {
  const getDetails = (auditLog: TAuditLog) => {
    switch (auditLog.action) {
      case "shared":
        return (
          <span>
            Shared with:{" "}
            <span className="text-primary">
              {auditLog.properties.shared_with.join(", ")}
            </span>
          </span>
        );

      case "uploaded":
        return (
          <span>
            Location:{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </span>
        );

      case "created":
        return (
          <span>
            Location:{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </span>
        );

      case "edited":
        return (
          <span>
            Location:{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </span>
        );

      case "renamed":
        return (
          <span>
            Renamed to:{" "}
            <span className="text-primary">{auditLog.properties.new_name}</span>
          </span>
        );

      case "moved":
        return (
          <span>
            Moved to:{" "}
            <span className="text-primary">
              {auditLog.properties.new_parent}
            </span>
          </span>
        );

      case "viewed":
        return (
          <span>
            Viewed in:{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </span>
        );

      case "user_status_updated":
        return (
          <span>
            Updated to:{" "}
            <span className="text-primary">
              {auditLog.properties.new_status}
            </span>
          </span>
        );

      case "admin_invited":
        return (
          <span>
            Invited admin:{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
            {" ("}
            <span className="text-primary">{auditLog.properties.email}</span>
            {")"}
          </span>
        );

      case "admin_reinvited":
        return (
          <span>
            Reinvited admin:{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
            {" ("}
            <span className="text-primary">{auditLog.properties.email}</span>
            {")"}
          </span>
        );

      case "user_updated": {
        const formatValue = (value: string | string[] | null) => {
          if (Array.isArray(value)) {
            return value.join(", ");
          }
          return value;
        };

        const changedFields = auditLog.properties.changed_fields ?? {};

        return (
          <div>
            <span>Changed fields: </span>
            {Object.entries(changedFields).map(
              ([field, change], index, array) => {
                const oldValue = formatValue(change.old);
                const newValue = formatValue(change.new);
                const isLast = index === array.length - 1;
                return (
                  <span key={field}>
                    {field}: <span className="text-primary">{oldValue}</span> to{" "}
                    <span className="text-primary">{newValue}</span>
                    {!isLast && ", "}
                  </span>
                );
              },
            )}
          </div>
        );
      }
    }
  };

  return { getDetails };
}
