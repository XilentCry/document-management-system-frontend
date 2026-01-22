import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatFileSize } from "@/lib/format-file-size";
import { useUserStore } from "@/stores/user-store";
import { TItem } from "@/types/item";
import { TPaginate } from "@/types/paginate";
import { EllipsisVertical, FileText, Folder } from "lucide-react";

export function ItemTable({
  data,
  onDoubleClick,
}: {
  data: TPaginate<TItem>["data"];
  onDoubleClick: (id: number) => void;
}) {
  const userId = useUserStore((state) => state.userId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Date modified</TableHead>
          <TableHead>File size</TableHead>
          <TableHead></TableHead>
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
            <TableCell>
              <div className="flex items-center gap-2">
                {item.is_folder ? (
                  <Folder className="size-4" />
                ) : (
                  <FileText className="size-4" />
                )}
                {item.name}
              </div>
            </TableCell>
            <TableCell>
              {userId === item.owner.id
                ? "me"
                : `${item.owner.first_name} ${item.owner.middle_name} ${item.owner.last_name}`}
            </TableCell>
            <TableCell>{item.updated_at}</TableCell>
            <TableCell>
              {item?.current_version?.file_size ? (
                formatFileSize(item.current_version.file_size)
              ) : (
                <>&mdash;</>
              )}
            </TableCell>
            <TableCell className="text-right">
              <EllipsisVertical className="size-4 inline-block" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
