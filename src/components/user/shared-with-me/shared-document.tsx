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
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useDownloadDocument } from "@/services/documents/mutations";
import { useRailStore } from "@/stores/rail-store";
import { TItem } from "@/types/item";
import { TSharePermission } from "@/types/share-permission";
import {
  Activity,
  CircleAlert,
  Download,
  EllipsisVertical,
  FileText,
  Info,
  PencilLine,
  UserRoundPlus
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MoveItemDialog } from "../shared/move-item-dialog";
import { RenameItemDialog } from "../shared/rename-item-dialog";
import { ShareDocumentDialog } from "../shared/share-document-dialog";

export function SharedDocument({
  item,
  sharePermissions,
  onDoubleClick,
}: {
  item: TItem;
  sharePermissions: TSharePermission[];
  onDoubleClick: (documentId: number) => Promise<void>;
}) {
  const [openRenameItemDialog, setOpenRenameItemDialog] = useState(false);
  const [openMoveItemDialog, setOpenMoveItemDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
    setSelectedFolderId,
    setSelectedFolderName,
    setRailTab,
    setOpenRail,
  } = useRailStore();

  const { mutate: downloadDocumentMutation } = useDownloadDocument();

  const handleDownload = () => {
    downloadDocumentMutation({
      id: item.id,
      fileName: item.name,
    });
  };

  return (
    <>
      <Item
        variant="muted"
        size="sm"
        onClick={() => {
          setSelectedDocumentId(item.id);
          setSelectedDocumentFileName(item.name);
          setSelectedFolderId(null);
          setSelectedFolderName(null);
        }}
        onDoubleClick={() => {
          if (
            !sharePermissions.some(
              (sharePermission) => sharePermission.name === "can_view",
            )
          ) {
            toast.error("You do not have permission to view this document.");
            return;
          }

          onDoubleClick(item.id);
        }}
      >
        <ItemMedia>
          <FileText className="size-4" />
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle className="block w-auto truncate">{item.name}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <DropdownMenu modal={false}>
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
            <DropdownMenuContent className="w-72">
              {sharePermissions.some(
                (sharePermission) => sharePermission.name === "can_download",
              ) && (
                <DropdownMenuItem onClick={handleDownload}>
                  <Download />
                  Download
                </DropdownMenuItem>
              )}
              {sharePermissions.some(
                (sharePermission) => sharePermission.name === "can_rename",
              ) && (
                <DropdownMenuItem onClick={() => setOpenRenameItemDialog(true)}>
                  <PencilLine />
                  Rename
                </DropdownMenuItem>
              )}
              {sharePermissions.some(
                (sharePermission) => sharePermission.name === "can_share",
              ) && (
                <DropdownMenuItem onClick={() => setOpenShareDialog(true)}>
                  <UserRoundPlus />
                  Share
                </DropdownMenuItem>
              )}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <CircleAlert />
                  File information
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-72">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedDocumentId(item.id);
                        setSelectedDocumentFileName(item.name);
                        setSelectedFolderId(null);
                        setSelectedFolderName(null);
                        setRailTab("details");
                        setOpenRail(true);
                      }}
                    >
                      <Info />
                      Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedDocumentId(item.id);
                        setSelectedDocumentFileName(item.name);
                        setSelectedFolderId(null);
                        setSelectedFolderName(null);
                        setRailTab("activity");
                        setOpenRail(true);
                      }}
                    >
                      <Activity />
                      Activity
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
        <ItemFooter className="justify-center bg-background p-4 h-40 rounded-md">
          <FileText className="size-16" strokeWidth={1} />
        </ItemFooter>
      </Item>

      <RenameItemDialog
        item={item}
        openRenameItemDialog={openRenameItemDialog}
        setOpenRenameItemDialog={setOpenRenameItemDialog}
      />

      <MoveItemDialog
        item={item}
        openMoveItemDialog={openMoveItemDialog}
        setOpenMoveItemDialog={setOpenMoveItemDialog}
      />

      <ShareDocumentDialog
        item={item}
        openShareDialog={openShareDialog}
        setOpenShareDialog={setOpenShareDialog}
      />
    </>
  );
}
