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

      case "document.update_share_role":
        return (
          <>
            {actor} updated the share role of{" "}
            <span className="text-primary">{auditLog.properties.shared_with}</span>{" "}
            for{" "}
            <span className="text-primary">{auditLog.properties.name}</span>
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
    }
  };

  return { getDescription };
}
