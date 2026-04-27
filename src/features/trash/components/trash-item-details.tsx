import { formatFileSize } from "@/lib/format-file-size";
import { useCurrentUser } from "@/features/auth/api/me-queries";
import { TTrashedItem } from "@/features/trash/types/trash-item";

export function TrashItemDetails({
  item,
}: {
  item: TTrashedItem;
}) {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;

  const updatedByLabel = userId === item.updated_by.id
    ? "me"
    : `${item.updated_by.first_name} ${item.updated_by.middle_name ?? ""} ${item.updated_by.last_name}`;

  return (
    <>
      <h1 className="font-medium text-base">File details</h1>
      <div>
        <p className="font-medium">Type</p>
        <p className="capitalize">{item.type ?? (item.is_folder ? "folder" : "pdf")}</p>
      </div>
      {item.current_version && (
        <>
          <div>
            <p className="font-medium">File size</p>
            <p>{formatFileSize(item.current_version.file_size)}</p>
          </div>
          <div>
            <p className="font-medium">Version number</p>
            <p>{item.current_version.version_number}</p>
          </div>
        </>
      )}
      {item.classification && (
        <div>
          <p className="font-medium">Classification</p>
          <p className="capitalize">{item.classification}</p>
        </div>
      )}
      <div>
        <p className="font-medium">Owner</p>
        <p>
          {userId === item.owner.id
            ? "me"
            : `${item.owner.first_name} ${item.owner.middle_name ?? ""} ${item.owner.last_name}`}
        </p>
      </div>
      <div>
        <p className="font-medium">Date modified</p>
        <p>
          {item.updated_at} by {updatedByLabel}
        </p>
      </div>
      <div>
        <p className="font-medium">Date created</p>
        <p>{item.created_at}</p>
      </div>
      <div>
        <p className="font-medium">Date deleted</p>
        <p>{item.deleted_at}</p>
      </div>
    </>
  );
}
