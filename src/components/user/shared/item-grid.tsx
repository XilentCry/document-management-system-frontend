import type { TItem } from "@/types/item";
import { Paginate } from "@/types/paginate";
import { useRouter } from "next/navigation";
import { Folder } from "./folder";

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

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((item) =>
        item.is_folder ? (
          <Folder
            key={item.id}
            item={item}
            onDoubleClick={() => handleDoubleClick(item.id)}
          />
        ) : null
      )}
    </div>
  );
}
