import { useCurrentUser } from "@/services/user/queries";
import { TAuditLog } from "@/types/audit-log";

export function useGetDescription() {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;

  const getDescription = (auditLog: TAuditLog) => {
    const actor =
      userId === auditLog.actor.id
        ? "You"
        : `${auditLog.actor.first_name} ${auditLog.actor.middle_name ?? ""
        } ${auditLog.actor.last_name}`;

    switch (auditLog.action) {
      case "document.share":
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


      case "document.remove_share":
        return (
          <>
            {actor} removed the access of{" "}
            <span className="text-primary">{auditLog.properties.removed_user}</span>{" "}
            from{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "document.upload":
        return (
          <>
            {actor} uploaded{" "}
            <span className="text-primary">{auditLog.properties.name}</span> in{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </>
        );

      case "folder.create":
        return (
          <>
            {actor} created{" "}
            <span className="text-primary">{auditLog.properties.name}</span> in{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </>
        );

      case "document.edit":
        return (
          <>
            {actor} edited{" "}
            <span className="text-primary">{auditLog.properties.name}</span> in{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
            {auditLog.properties.removed_oldest_version ? (
              <>
                {" "}
                and the lowest version (Version {auditLog.properties.removed_oldest_version}) was removed
              </>
            ) : null}
          </>
        );

      case "item.rename":
        return (
          <>
            {actor} renamed{" "}
            <span className="text-primary">{auditLog.properties.old_name}</span>{" "}
            to{" "}
            <span className="text-primary">{auditLog.properties.new_name}</span>
          </>
        );

      case "document.change_classification":
        return (
          <>
            {actor} changed the classification of{" "}
            <span className="text-primary">{auditLog.properties.name}</span>{" "}
            to{" "}
            <span className="text-primary capitalize">
              {auditLog.properties.new_classification}
            </span>
          </>
        );

      case "item.move":
        return (
          <>
            {actor} moved{" "}
            <span className="text-primary">{auditLog.properties.name}</span> to{" "}
            <span className="text-primary">
              {auditLog.properties.new_parent}
            </span>
          </>
        );


      case "document.view":
        return (
          <>
            {actor} viewed{" "}
            <span className="text-primary">{auditLog.properties.name}</span> in{" "}
            <span className="text-primary">{auditLog.properties.parent}</span>
          </>
        );

      case "user.update_status":
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

      case "user.update":
        return (
          <>
            {actor} updated{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "admin.invite":
        return (
          <>
            {actor} invited{" "}
            <span className="text-primary">{auditLog.properties.name}</span> as
            an administrator
          </>
        );

      case "admin.reinvite":
        return (
          <>
            {actor} reinvited{" "}
            <span className="text-primary">{auditLog.properties.name}</span> as
            an administrator
          </>
        );

      case "organization_unit.create":
        return (
          <>
            {actor} created the organization unit{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
            {auditLog.properties.parent ? (
              <>
                {" "}
                under{" "}
                <span className="text-primary">
                  {auditLog.properties.parent}
                </span>
              </>
            ) : null}
          </>
        );

      case "organization_unit.update":
        return (
          <>
            {actor} updated the organization unit{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "document.update_share_role":
        return (
          <>
            {actor} changed the share role of{" "}
            <span className="text-primary">
              {auditLog.properties.shared_with}
            </span>{" "}
            on{" "}
            <span className="text-primary">{auditLog.properties.name}</span> to{" "}
            <span className="text-primary capitalize">
              {auditLog.properties.new_role}
            </span>
          </>
        );

      case "document.trash":
        return (
          <>
            {actor} moved{" "}
            <span className="text-primary">{auditLog.properties.name}</span> to
            trash
          </>
        );

      case "document.restore":
        return (
          <>
            {actor} restored{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "document.force_delete":
        return (
          <>
            {actor} permanently deleted{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "document.grant_download":
        return (
          <>
            {actor} granted download access to{" "}
            <span className="text-primary">
              {auditLog.properties.shared_with}
            </span>{" "}
            for{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "document.revoke_download":
        return (
          <>
            {actor} revoked download access from{" "}
            <span className="text-primary">
              {auditLog.properties.shared_with}
            </span>{" "}
            on{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "item.lock":
        return (
          <>
            {actor} locked{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "item.unlock":
        return (
          <>
            {actor} unlocked{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "document.download":
        return (
          <>
            {actor} downloaded{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "document.download_version":
        return (
          <>
            {actor} downloaded Version{" "}
            <span className="text-primary">
              {auditLog.properties.version_number}
            </span>{" "}
            of{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
          </>
        );

      case "document.submission_created":
        return (
          <>
            {actor} created a signing submission for{" "}
            <span className="text-primary">{auditLog.properties.name}</span>{" "}
            with{" "}
            <span className="text-primary">
              {auditLog.properties.submitters_count}
            </span>{" "}
            submitter
            {auditLog.properties.submitters_count === 1 ? "" : "s"}
          </>
        );

      case "document.signed_completed":
        return (
          <>
            A signing submission was completed and saved as Version{" "}
            <span className="text-primary">
              {auditLog.properties.version_number}
            </span>
            {auditLog.properties.removed_oldest_version ? (
              <>
                {" "}
                (Version {auditLog.properties.removed_oldest_version} was
                removed)
              </>
            ) : null}
          </>
        );
    }
  };

  return { getDescription };
}
