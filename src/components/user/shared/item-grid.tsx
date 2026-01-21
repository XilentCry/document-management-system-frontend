import type { TItem } from "@/types/item";
import { Paginate } from "@/types/paginate";
import { useRouter } from "next/navigation";
import { Folder } from "./folder";
import { Document } from "./document";

export function ItemGrid({
  data,
  links,
  meta,
}: {
  data: Paginate<TItem>["data"];
  links: Paginate<TItem>["links"];
  meta: Paginate<TItem>["meta"];
}) {
  const router = useRouter();

  const handleDoubleClick = (id: number) => {
    router.push(`/drive/folders/${id}`);
  };

  const folders = data.filter((item) => item.is_folder);
  const documents = data.filter((item) => !item.is_folder);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        {folders.map((folder) => (
          <Folder
            key={folder.id}
            item={folder}
            onDoubleClick={() => handleDoubleClick(folder.id)}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {documents.map((document) => (
          <Document key={document.id} item={document} />
        ))}
      </div>
    </div>
  );
}
