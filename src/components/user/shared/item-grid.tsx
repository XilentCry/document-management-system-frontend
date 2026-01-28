import type { TItem } from "@/types/item";
import { TPaginate } from "@/types/paginate";
import { useRouter } from "next/navigation";
import { Folder } from "./folder";
import { Document } from "./document";
import { useRailStore } from "@/stores/rail-store";

export function ItemGrid({
  data,
  links,
  meta,
}: {
  data: TPaginate<TItem>["data"];
  links: TPaginate<TItem>["links"];
  meta: TPaginate<TItem>["meta"];
}) {
  const router = useRouter();

  const { openRail } = useRailStore();

  const handleDoubleClick = (id: number) => {
    router.push(`/drive/folders/${id}`);
  };

  const folders = data.filter((item) => item.is_folder);
  const documents = data.filter((item) => !item.is_folder);

  return (
    <div className="flex flex-col gap-4">
      <div className={`grid ${openRail ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
        {folders.map((folder) => (
          <Folder
            key={folder.id}
            item={folder}
            onDoubleClick={() => handleDoubleClick(folder.id)}
          />
        ))}
      </div>
      <div className={`grid ${openRail ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
        {documents.map((document) => (
          <Document key={document.id} item={document} />
        ))}
      </div>
    </div>
  );
}
