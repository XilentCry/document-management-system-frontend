import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  EllipsisVertical,
  FileText,
  Folder,
  FolderInput,
  FolderOpen,
  PencilLine,
} from "lucide-react";
import { useState } from "react";
import { RenameItemDialog } from "./rename-item-dialog";
import { MoveItemDialog } from "./move-item-dialog";

export function ItemTable({
  data,
  onDoubleClick,
}: {
  data: TPaginate<TItem>["data"];
  onDoubleClick: (id: number) => void;
}) {
  const userId = useUserStore((state) => state.userId);
  const [openRenameItemDialog, setOpenRenameItemDialog] = useState(false);
  const [openMoveItemDialog, setOpenMoveItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);

  return (
    <>
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
                  : `${item.owner.first_name} ${item.owner.middle_name ?? ""} ${item.owner.last_name}`}
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
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="outline"
                        size="icon-xs"
                        className="border-none bg-transparent hover:bg-input/50"
                      />
                    }
                  >
                    <EllipsisVertical className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedItem(item);
                        setOpenRenameItemDialog(true);
                      }}
                    >
                      <PencilLine />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <FolderOpen />
                        Organize
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(item);
                              setOpenMoveItemDialog(true);
                            }}
                          >
                            <FolderInput />
                            Move
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {openRenameItemDialog && selectedItem && (
        <RenameItemDialog
          item={selectedItem}
          openRenameItemDialog={openRenameItemDialog}
          setOpenRenameItemDialog={setOpenRenameItemDialog}
        />
      )}

      {openMoveItemDialog && selectedItem && (
        <MoveItemDialog
          item={selectedItem}
          openMoveItemDialog={openMoveItemDialog}
          setOpenMoveItemDialog={setOpenMoveItemDialog}
        />
      )}
    </>
  );
}
