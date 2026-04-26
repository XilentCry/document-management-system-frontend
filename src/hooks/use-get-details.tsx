import { TAuditLog } from "@/types/audit-log";

export function useGetDetails() {
  const getDetails = (auditLog: TAuditLog) => {
    switch (auditLog.action) {
      case "document.share":
        return (
          <span>
            Shared with:{" "}
            <span className="text-primary">
              {auditLog.properties.shared_with.join(", ")}
            </span>
          </span>
        );


      case "document.remove_share":
        return (
          <span>
            Removed access for:{" "}
            <span className="text-primary">{auditLog.properties.removed_user}</span>
          </span>
        );

      case "document.upload":
        return (
          <span>
            Location:{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </span>
        );

      case "folder.create":
        return (
          <span>
            Location:{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </span>
        );

      case "document.edit":
        return (
          <div className="flex flex-col">
            <span>
              Location:{" "}
              <span className="text-primary">{auditLog.properties.parent}</span>
            </span>
            {auditLog.properties.removed_oldest_version && (
              <span>
                Removed version:{" "}
                <span className="text-primary">
                  Version {auditLog.properties.removed_oldest_version}
                </span>
              </span>
            )}
          </div>
        );

      case "item.rename":
        return (
          <span>
            Renamed to:{" "}
            <span className="text-primary">{auditLog.properties.new_name}</span>
          </span>
        );

      case "document.change_classification":
        return (
          <span>
            Classification changed from{" "}
            <span className="text-primary capitalize">
              {auditLog.properties.old_classification}
            </span>{" "}
            to{" "}
            <span className="text-primary capitalize">
              {auditLog.properties.new_classification}
            </span>
          </span>
        );

      case "item.move":
        return (
          <span>
            Moved to:{" "}
            <span className="text-primary">
              {auditLog.properties.new_parent}
            </span>
          </span>
        );


      case "document.view":
        return (
          <span>
            Viewed in:{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </span>
        );

      case "user.update_status":
        return (
          <span>
            Updated to:{" "}
            <span className="text-primary">
              {auditLog.properties.new_status}
            </span>
          </span>
        );

      case "admin.invite":
        return (
          <span>
            Invited admin:{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
            {" ("}
            <span className="text-primary">{auditLog.properties.email}</span>
            {")"}
          </span>
        );

      case "admin.reinvite":
        return (
          <span>
            Reinvited admin:{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
            {" ("}
            <span className="text-primary">{auditLog.properties.email}</span>
            {")"}
          </span>
        );

      case "user.update": {
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

      case "organization_unit.create":
        if (!auditLog.properties.parent) return null;
        return (
          <span>
            Parent:{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </span>
        );

      case "document.update_share_role":
        return (
          <div className="flex flex-col">
            <span>
              User:{" "}
              <span className="text-primary">
                {auditLog.properties.shared_with}
              </span>
            </span>
            <span>
              Role changed from{" "}
              <span className="text-primary capitalize">
                {auditLog.properties.previous_role ?? "None"}
              </span>{" "}
              to{" "}
              <span className="text-primary capitalize">
                {auditLog.properties.new_role}
              </span>
            </span>
          </div>
        );

      case "document.trash":
        return (
          <span>
            Document:{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </span>
        );

      case "document.restore":
        return (
          <span>
            Document:{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </span>
        );

      case "document.force_delete":
        return (
          <span>
            Document:{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </span>
        );

      case "document.grant_download":
        return (
          <span>
            Granted download to:{" "}
            <span className="text-primary">
              {auditLog.properties.shared_with}
            </span>
          </span>
        );

      case "document.revoke_download":
        return (
          <span>
            Revoked download from:{" "}
            <span className="text-primary">
              {auditLog.properties.shared_with}
            </span>
          </span>
        );

      case "item.lock":
        return (
          <span>
            Locked:{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </span>
        );

      case "item.unlock":
        return (
          <span>
            Unlocked:{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </span>
        );

      case "document.download":
        return (
          <span>
            Location:{" "}
            <span className="text-primary">
              {auditLog.properties.parent ?? "—"}
            </span>
          </span>
        );

      case "document.download_version":
        return (
          <div className="flex flex-col">
            <span>
              File:{" "}
              <span className="text-primary">
                {auditLog.properties.file_name}
              </span>
            </span>
            <span>
              Version:{" "}
              <span className="text-primary">
                Version {auditLog.properties.version_number}
              </span>
            </span>
          </div>
        );

      case "document.submission_created":
        return (
          <div className="flex flex-col">
            <span>
              Submission ID:{" "}
              <span className="text-primary">
                {auditLog.properties.docuseal_id}
              </span>
            </span>
            <span>
              Submitters:{" "}
              <span className="text-primary">
                {auditLog.properties.submitters_count}
              </span>
            </span>
          </div>
        );

      case "document.signed_completed":
        return (
          <div className="flex flex-col">
            <span>
              Submission ID:{" "}
              <span className="text-primary">
                {auditLog.properties.docuseal_id}
              </span>
            </span>
            <span>
              New version:{" "}
              <span className="text-primary">
                Version {auditLog.properties.version_number}
              </span>
            </span>
            {auditLog.properties.removed_oldest_version && (
              <span>
                Removed version:{" "}
                <span className="text-primary">
                  Version {auditLog.properties.removed_oldest_version}
                </span>
              </span>
            )}
          </div>
        );

      case "organization_unit.update": {
        const formatValue = (value: string | null) => {
          return value ?? "None";
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

                const fieldName = field === "parent_organization_unit" ? "parent" : field;

                return (
                  <span key={field}>
                    {fieldName}: <span className="text-primary">{oldValue}</span> to{" "}
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
