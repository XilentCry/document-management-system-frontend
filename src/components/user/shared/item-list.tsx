import { TItem } from "@/types/item";
import { Paginate } from "@/types/paginate";
import { useRouter } from "next/navigation";
import { ItemTable } from "./item-table";

export function ItemList({
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

  return <ItemTable data={data} onDoubleClick={handleDoubleClick} />;
}
