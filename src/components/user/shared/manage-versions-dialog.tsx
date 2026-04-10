import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { useGetDocumentVersions } from "@/services/documents/queries";
import { TItem } from "@/types/item";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Download, EllipsisVertical, Upload } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDownloadDocumentVersion } from "@/services/documents/mutations";
import { useUploadDialogStore } from "@/stores/upload-dialog-store";
import { useUserStore } from "@/stores/user-store";

export function VersionHistoryDialog({
  item,
  openVersionHistoryDialog,
  setOpenVersionHistoryDialog,
}: {
  item: TItem;
  openVersionHistoryDialog: boolean;
  setOpenVersionHistoryDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    isLoading,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetDocumentVersions(item.id, openVersionHistoryDialog);

  const versions = data?.pages?.flatMap((page) => page.data) ?? [];
  const maxVersionNumber = versions.length > 0 ? Math.max(...versions.map((v) => v.version_number)) : 0;

  const currentUserId = useUserStore((state) => state.user.userId);
  const isOwner = item.owner.id === currentUserId;

  const { mutate: downloadDocumentVersionMutation } = useDownloadDocumentVersion();
  const openForReplacement = useUploadDialogStore((state) => state.openForReplacement);

  const handleDownload = (versionId: string) => {
    downloadDocumentVersionMutation({ versionId, fileName: item.name });
  };

  const handleUploadNewVersion = () => {
    openForReplacement(item.id);
  };

  return (
    <Dialog open={openVersionHistoryDialog} onOpenChange={setOpenVersionHistoryDialog}>
      <DialogContent className="w-150 max-w-150!">
        <DialogHeader>
          <DialogTitle>Manage versions</DialogTitle>
        </DialogHeader>
        <div className="h-96 flex flex-col gap-4">
          {isOwner && (
            <Button
              variant="outline"
              className="w-fit"
              onClick={handleUploadNewVersion}
            >
              <Upload />
              Upload new version
            </Button>
          )}
          <ScrollArea className="flex-1 flex flex-col min-h-0">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Spinner className="text-primary size-9" />
              </div>
            ) : (
              <div className="flex flex-col">
                {versions.map((version) => (
                  <Item variant="outline" size="xs" className="rounded-none border-t-0 border-x-0" key={version.id}>
                    <ItemMedia variant="icon">
                      <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
                    </ItemMedia>
                    <ItemContent className="min-w-0">
                      <ItemTitle className="block w-full truncate">
                        {version.version_number === maxVersionNumber ? "Current version" : `Version ${version.version_number}`}
                        &nbsp;&nbsp;
                        {version.file_name}
                      </ItemTitle>
                      <ItemDescription className="truncate">
                        {version.created_at}&nbsp;&nbsp;{version.created_by.first_name} {version.created_by.middle_name} {version.created_by.last_name}
                      </ItemDescription>
                    </ItemContent>
                    {isOwner && (
                      <ItemActions>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="border-none bg-transparent hover:bg-input/50"
                              />
                            }
                          >
                            <EllipsisVertical className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-72">
                            <DropdownMenuItem onClick={() => handleDownload(version.id)}>
                              <Download />
                              Download
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </ItemActions>
                    )}
                  </Item>
                ))}
              </div>
            )}
            {isError && error && (
              <div className="py-4 flex items-center justify-center">
                <p className="text-destructive text-sm">{error.message}</p>
              </div>
            )}
            {hasNextPage && (
              <div className="flex justify-center mt-4 mb-4">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <>
                      <Spinner />
                      Loading more...
                    </>
                  ) : (
                    "Load more versions"
                  )}
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <DialogClose render={<Button />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
