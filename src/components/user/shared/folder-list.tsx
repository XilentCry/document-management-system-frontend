import type { TFolder } from "@/types/folder";
import { useRouter } from "next/navigation";
import { FolderTable } from "./folder-table";

export function FolderList({ folders }: { folders: TFolder[] }) {
  const router = useRouter();

  const handleDoubleClick = (id: number) => {
    router.push(`/drive/folders/${id}`);
  };

  return <FolderTable folders={folders} onDoubleClick={handleDoubleClick} />;
}
