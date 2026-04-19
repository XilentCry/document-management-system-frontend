import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyLink } from "@/hooks/use-copy-link";
import { useDownloadDocument } from "@/services/documents/mutations";
import { useCurrentUser } from "@/services/user/queries";
import { useRailStore } from "@/stores/rail-store";
import { TItem } from "@/types/item";
import {
  Activity,
  CircleAlert,
  Download,
  EllipsisVertical,
  FolderInput,
  History,
  Info,
  Link2,
  PencilLine,
  Shield,
  Trash2,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { ChangeClassificationDialog } from "./change-classification-dialog";
import { VersionHistoryDialog } from "./manage-versions-dialog";
import { MoveItemDialog } from "./move-item-dialog";
import { RenameItemDialog } from "./rename-item-dialog";
import { ShareDocumentDialog } from "./share-document-dialog";
import { TrashDocumentDialog } from "./trash-document-dialog";

export function ItemActionDropdown({
  item,
  variant = "table",
  onDetails,
}: {
  item: TItem;
  variant?: "table" | "viewer";
  onDetails?: () => void;
}) {
  const [openRenameItemDialog, setOpenRenameItemDialog] = useState(false);
  const [openMoveItemDialog, setOpenMoveItemDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openVersionHistoryDialog, setOpenVersionHistoryDialog] =
    useState(false);
  const [openChangeClassificationDialog, setOpenChangeClassificationDialog] =
    useState(false);
  const [openTrashDialog, setOpenTrashDialog] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  const isOwner = item.owner.id === userId;

  const canDownload = !item.is_folder;

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

  const handleOpenRailInfo = (tab: "details" | "activity") => {
    if (onDetails && tab === "details") {
      onDetails();
      return;
    }

    if (item.is_folder) {
      setSelectedFolderId(item.id);
      setSelectedFolderName(item.name);
      setSelectedDocumentId(null);
      setSelectedDocumentFileName(null);
    } else {
      setSelectedDocumentId(item.id);
      setSelectedDocumentFileName(item.name);
      setSelectedFolderId(null);
      setSelectedFolderName(null);
    }
    setRailTab(tab);
    setOpenRail(true);
  };

  return (
    <>
      <DropdownMenu modal={variant === "table" ? false : true}>
        <DropdownMenuTrigger
          render={
            variant === "viewer" ? (
              <Button variant="ghost" size="icon" />
            ) : (
              <Button
                variant="outline"
                size="icon-sm"
                className="border-none bg-transparent hover:bg-input/50"
              />
            )
          }
        >
          <EllipsisVertical className={variant === "table" ? "size-4" : ""} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-72"
          onClick={(e) => e.stopPropagation()}
        >
          {!item.is_folder && (
            <DropdownMenuItem disabled={!canDownload} onClick={handleDownload}>
              <Download />
              Download
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            disabled={!isOwner}
            onClick={() => setOpenRenameItemDialog(true)}
          >
            <PencilLine />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!item.is_folder && (
            <DropdownMenuItem
              disabled={!isOwner}
              onClick={() => setOpenChangeClassificationDialog(true)}
            >
              <Shield />
              Change classification
            </DropdownMenuItem>
          )}
          {!item.is_folder && (
            <>
              {item.classification === "protected" ? (
                <DropdownMenuItem
                  disabled={!isOwner}
                  onClick={() => setOpenShareDialog(true)}
                >
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
          <DropdownMenuItem
            disabled={!isOwner}
            onClick={() => setOpenMoveItemDialog(true)}
          >
            <FolderInput />
            Move
          </DropdownMenuItem>

          {variant === "viewer" ? (
            <DropdownMenuItem onClick={() => handleOpenRailInfo("details")}>
              <Info />
              Details
            </DropdownMenuItem>
          ) : (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <CircleAlert />
                {item.is_folder ? "Folder" : "File"} information
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-72">
                  <DropdownMenuItem
                    onClick={() => handleOpenRailInfo("details")}
                  >
                    <Info />
                    Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleOpenRailInfo("activity")}
                  >
                    <Activity />
                    Activity
                  </DropdownMenuItem>
                  {!item.is_folder && (
                    <DropdownMenuItem
                      onClick={() => setOpenVersionHistoryDialog(true)}
                    >
                      <History />
                      {!isOwner ? "Version history" : "Manage versions"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={!isOwner}
            onClick={() => setOpenTrashDialog(true)}
          >
            <Trash2 />
            Move to trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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

      {!item.is_folder && (
        <>
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
      )}

      <TrashDocumentDialog
        item={item}
        openTrashDialog={openTrashDialog}
        setOpenTrashDialog={setOpenTrashDialog}
      />
    </>
  );
}
