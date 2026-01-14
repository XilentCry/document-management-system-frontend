import type { TFolder } from "@/types/folder";
import Folder from "./folder";
import { useRouter } from "next/navigation";

export default function FolderGrid({ folders }: { folders: TFolder[] }) {
  const router = useRouter();

  const handleDoubleClick = (id: number) => {
    router.push(`/drive/folders/${id}`);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {folders.map((folder) => (
        <Folder
          key={folder.id}
          folder={folder}
          onDoubleClick={() => handleDoubleClick(folder.id)}
        />
      ))}
    </div>
  );
}
