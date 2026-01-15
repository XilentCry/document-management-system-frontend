import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TItem } from "@/types/item";
import { Paginate } from "@/types/paginate";
import { EllipsisVertical, FileText, Folder } from "lucide-react";

export function ItemTable({
  data,
  onDoubleClick,
}: {
  data: Paginate<TItem>["data"];
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
        {data.map((item) => (
          <TableRow
            key={item.id}
            onDoubleClick={() => {
              if (item.is_folder) {
                onDoubleClick(item.id);
              }
            }}
          >
            <TableCell className="flex items-center gap-2">
              {item.is_folder ? (
                <Folder className="size-4" />
              ) : (
                <FileText className="size-4" />
              )}
              {item.name}
            </TableCell>
            <TableCell>
              {item.owner.first_name} {item.owner.middle_name}{" "}
              {item.owner.last_name}
            </TableCell>
            <TableCell>{new Date(item.updated_at).toLocaleString()}</TableCell>
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
