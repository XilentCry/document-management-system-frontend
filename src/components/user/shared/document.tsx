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
import { useUserStore } from "@/stores/user-store";
import { TItem } from "@/types/item";
import {
  Activity,
  CircleAlert,
  Download,
  EllipsisVertical,
  FolderInput,
  Link2,
  PencilLine,
  UserRoundPlus,
  Info,
  History,
  File,
  Shield
} from "lucide-react";
import { useState } from "react";
import { MoveItemDialog } from "./move-item-dialog";
import { RenameItemDialog } from "./rename-item-dialog";
import { ShareDocumentDialog } from "./share-document-dialog";
import { useCopyLink } from "@/hooks/use-copy-link";
import { VersionHistoryDialog } from "./version-history-dialog";
import { ChangeClassificationDialog } from "./change-classification-dialog";

export function Document({
  item,
  onDoubleClick,
}: {
  item: TItem;
  onDoubleClick: (document: TItem) => Promise<void>;
}) {
  const [openRenameItemDialog, setOpenRenameItemDialog] = useState(false);
  const [openMoveItemDialog, setOpenMoveItemDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openVersionHistoryDialog, setOpenVersionHistoryDialog] = useState(false);
  const [openChangeClassificationDialog, setOpenChangeClassificationDialog] = useState(false);

  const userId = useUserStore((state) => state.userId);

  const {
    setSelectedDocumentId,
    setSelectedDocumentFileName,
    setSelectedFolderId,
    setSelectedFolderName,
    setRailTab,
    setOpenRail,
  } = useRailStore();

  const { copyLink } = useCopyLink();

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
        onDoubleClick={() => onDoubleClick(item)}
      >
        <ItemMedia>
          <File className="size-4" />
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
              <DropdownMenuItem onClick={handleDownload}>
                <Download />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenRenameItemDialog(true)}>
                <PencilLine />
                Rename
              </DropdownMenuItem>
              {item.owner.id === userId && (
                <DropdownMenuItem onClick={() => setOpenChangeClassificationDialog(true)}>
                  <Shield />
                  Change classification
                </DropdownMenuItem>
              )}
              {item.owner.id === userId && (
                <>
                  {item.classification === "protected" ? (
                    <DropdownMenuItem onClick={() => setOpenShareDialog(true)}>
                      <UserRoundPlus />
                      Share
                    </DropdownMenuItem>
                  ) : item.classification === "public" ? (
                    <DropdownMenuItem onClick={() => copyLink(item.id)}>
                      <Link2 />
                      Copy Link
                    </DropdownMenuItem>
                  ) : null}
                </>
              )}
              <DropdownMenuItem onClick={() => setOpenMoveItemDialog(true)}>
                <FolderInput />
                Move
              </DropdownMenuItem>
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
                    <DropdownMenuItem onClick={() => setOpenVersionHistoryDialog(true)}>
                      <History />
                      Version history
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
        <ItemFooter className="justify-center bg-background p-4 h-40 rounded-md">
          <File className="size-16" strokeWidth={1} />
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

      <VersionHistoryDialog
        item={item}
        openVersionHistoryDialog={openVersionHistoryDialog}
        setOpenVersionHistoryDialog={setOpenVersionHistoryDialog}
      />

      <ChangeClassificationDialog
        item={item}
        openChangeClassificationDialog={openChangeClassificationDialog}
        setOpenChangeClassificationDialog={setOpenChangeClassificationDialog}
      />
    </>
  );
}
