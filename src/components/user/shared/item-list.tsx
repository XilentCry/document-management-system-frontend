import { TItem } from "@/types/item";
import { TPaginate } from "@/types/paginate";
import { useRouter } from "next/navigation";
import { ItemTable } from "./item-table";

export function ItemList({
  data,
  links,
  meta,
}: {
  data: TPaginate<TItem>["data"];
  links: TPaginate<TItem>["links"];
  meta: TPaginate<TItem>["meta"];
}) {
  const router = useRouter();

  const handleDoubleClick = (id: number) => {
    router.push(`/drive/folders/${id}`);
  };

  return <ItemTable data={data} onDoubleClick={handleDoubleClick} />;
}
