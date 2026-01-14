import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TFolder } from "@/types/folder";
import { EllipsisVertical, Folder } from "lucide-react";

export function FolderTable({
  folders,
  onDoubleClick,
}: {
  folders: TFolder[];
  onDoubleClick: (id: number) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Date modified</TableHead>
          <TableHead>File size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {folders.map((folder) => (
          <TableRow
            key={folder.id}
            onDoubleClick={() => onDoubleClick(folder.id)}
          >
            <TableCell className="flex items-center gap-2">
              <Folder className="size-4" />
              {folder.name}
            </TableCell>
            <TableCell>
              {folder.owner.first_name} {folder.owner.middle_name}{" "}
              {folder.owner.last_name}
            </TableCell>
            <TableCell>
              {new Date(folder.updated_at).toLocaleString()}
            </TableCell>
            <TableCell>&mdash;</TableCell>
            <TableCell className="text-right">
              <EllipsisVertical className="size-4 inline-block" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
