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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyLink } from "@/hooks/use-copy-link";
import { useDownloadDocument } from "@/features/documents/api/mutations";
import { useLockItem, useUnlockItem } from "@/features/items/api/mutations";
import { useCurrentUser } from "@/features/auth/api/me-queries";
import { useRailStore } from "@/features/drive/store/rail-store";
import { TItem } from "@/features/items/types/item";
import {
  Activity,
  CircleAlert,
  Download,
  EllipsisVertical,
  FilePenLine,
  FolderInput,
  History,
  Info,
  KeyRound,
  Link2,
  Lock,
  LockOpen,
  PencilLine,
  Shield,
  Trash2,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { AllowDownloadsDialog } from "@/features/sharing/components/allow-downloads-dialog";
import { ChangeClassificationDialog } from "@/features/documents/components/change-classification-dialog";
import { FormBuilderViewer } from "@/features/viewer/components/form-builder-viewer";
import { VersionHistoryDialog } from "@/features/uploads/components/manage-versions-dialog";
import { MoveItemDialog } from "@/features/items/components/move-item-dialog";
import { RenameItemDialog } from "@/features/items/components/rename-item-dialog";
import { ShareDocumentDialog } from "@/features/sharing/components/share-document-dialog";
import { TrashDocumentDialog } from "@/features/items/components/trash-item-dialog";

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
  const [openFormBuilderViewer, setOpenFormBuilderViewer] = useState(false);
  const [openAllowDownloadsDialog, setOpenAllowDownloadsDialog] =
    useState(false);

  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  const isOwner = item.owner.id === userId;
  const isLocked = !item.is_folder && !!item.is_locked;
  const canManageVersions =
    !isLocked &&
    (isOwner ||
      item.current_user_share?.permissions.includes(
        "document:upload_new_version",
      ) === true);

  const canDownload =
    !item.is_folder &&
    !isLocked &&
    (isOwner || item.current_user_share?.can_download === true);

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
  const { mutate: lockItemMutation, isPending: isLocking } = useLockItem();
  const { mutate: unlockItemMutation, isPending: isUnlocking } =
    useUnlockItem();

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
      <div className="flex items-center gap-1">
        {variant === "viewer" && !item.is_folder && (
          <>
            {canDownload && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownload}
                    />
                  }
                >
                  <Download />
                </TooltipTrigger>
                <TooltipContent side="bottom">Download</TooltipContent>
              </Tooltip>
            )}

            {item.classification === "protected" && isOwner ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpenShareDialog(true)}
                    />
                  }
                >
                  <UserRoundPlus />
                </TooltipTrigger>
                <TooltipContent side="bottom">Share</TooltipContent>
              </Tooltip>
            ) : item.classification === "public" ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyLink(item.id)}
                    />
                  }
                >
                  <Link2 />
                </TooltipTrigger>
                <TooltipContent side="bottom">Copy Link</TooltipContent>
              </Tooltip>
            ) : null}

            {!isLocked && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpenFormBuilderViewer(true)}
                    />
                  }
                >
                  <FilePenLine />
                </TooltipTrigger>
                <TooltipContent side="bottom">Form builder</TooltipContent>
              </Tooltip>
            )}
          </>
        )}
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
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72"
            onClick={(e) => e.stopPropagation()}
          >
            {!item.is_folder && variant !== "viewer" && (
              <DropdownMenuItem
                disabled={!canDownload}
                onClick={handleDownload}
              >
                <Download />
                Download
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              disabled={!isOwner || isLocked}
              onClick={() => setOpenRenameItemDialog(true)}
            >
              <PencilLine />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!item.is_folder && (
              <DropdownMenuItem
                disabled={!isOwner || isLocked}
                onClick={() => setOpenChangeClassificationDialog(true)}
              >
                <Shield />
                Change classification
              </DropdownMenuItem>
            )}
            {!item.is_folder && variant !== "viewer" && (
              <>
                {item.classification === "protected" ? (
                  <>
                    <DropdownMenuItem
                      disabled={!isOwner}
                      onClick={() => setOpenShareDialog(true)}
                    >
                      <UserRoundPlus />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!isOwner || isLocked}
                      onClick={() => setOpenAllowDownloadsDialog(true)}
                    >
                      <KeyRound />
                      Allow downloads
                    </DropdownMenuItem>
                  </>
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
                        {canManageVersions
                          ? "Manage versions"
                          : "Version history"}
                      </DropdownMenuItem>
                    )}
                    {!item.is_folder && (
                      <DropdownMenuItem
                        disabled={!isOwner || isLocking || isUnlocking}
                        onClick={() =>
                          isLocked
                            ? unlockItemMutation(item.id)
                            : lockItemMutation(item.id)
                        }
                      >
                        {isLocked ? <LockOpen /> : <Lock />}
                        {isLocked ? "Unlock" : "Lock"}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={!isOwner || isLocked}
              onClick={() => setOpenTrashDialog(true)}
            >
              <Trash2 />
              Move to trash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
            setOpenChangeClassificationDialog={
              setOpenChangeClassificationDialog
            }
          />
          <FormBuilderViewer
            item={item}
            openFormBuilderViewer={openFormBuilderViewer}
            setOpenFormBuilderViewer={setOpenFormBuilderViewer}
          />
          <AllowDownloadsDialog
            item={item}
            openAllowDownloadsDialog={openAllowDownloadsDialog}
            setOpenAllowDownloadsDialog={setOpenAllowDownloadsDialog}
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
