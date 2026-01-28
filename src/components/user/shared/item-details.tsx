import { formatFileSize } from "@/lib/format-file-size";
import { useUserStore } from "@/stores/user-store";
import { TItem } from "@/types/item";

export function ItemDetails({
  item,
}: {
  item: Pick<TItem, "id" | "name" | "owner" | "created_at" | "updated_at"> & {
    classification?: string;
    current_version?: {
      id: number;
      item_id: number;
      file_size: number;
      version_number: number;
    };
  };
}) {
  const userId = useUserStore((state) => state.userId);

  return (
    <>
      <h1 className="font-medium text-base">File details</h1>
      {item.current_version && (
        <div>
          <p className="font-medium">File size</p>
          <p>{formatFileSize(item.current_version.file_size)}</p>
        </div>
      )}
      {item.current_version && (
        <div>
          <p className="font-medium">Version number</p>
          <p>{item.current_version.version_number}</p>
        </div>
      )}
      {item.classification && (
        <div>
          <p className="font-medium">Classification</p>
          <p>{item.classification}</p>
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
        <p className="font-medium">Modified</p>
        <p>{item.updated_at}</p>
      </div>
      <div>
        <p className="font-medium">Created</p>
        <p>{item.created_at}</p>
      </div>
    </>
  );
}
