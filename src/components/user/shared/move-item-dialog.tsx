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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  moveItemFormSchema,
  TMoveItemFormSchema,
} from "@/schemas/items/move-item-form-schema";
import { useGetFolderSubfolders } from "@/services/folders/queries";
import { useMoveItem } from "@/services/items/mutations";
import { useGetOrganizationUnitFolders } from "@/services/organization-units/queries";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { TItem } from "@/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Folder } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { MoveItemBreadCrumb } from "./move-item-breadcrumb";

export function MoveItemDialog({
  item,
  openMoveItemDialog,
  setOpenMoveItemDialog,
}: {
  item: TItem;
  openMoveItemDialog: boolean;
  setOpenMoveItemDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [currentParentFolderId, setCurrentParentFolderId] = useState<
    number | null
  >(null);

  const currentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );

  const isSelectedSelfParent = item.parent_item_id === selectedFolderId;

  const {
    isLoading: isOrganizationUnitFoldersLoading,
    isError: isOrganizationUnitFoldersError,
    error: organizationUnitFoldersError,
    data: organizationUnitFoldersData,
    fetchNextPage: fetchNextOrganizationUnitFolders,
    hasNextPage: hasNextOrganizationUnitFolders,
    isFetchingNextPage: isFetchingNextOrganizationUnitFolders,
  } = useGetOrganizationUnitFolders(
    currentOrganizationUnitId,
    currentParentFolderId,
    openMoveItemDialog
  );

  const {
    isLoading: isFolderSubfoldersLoading,
    isError: isFolderSubfoldersError,
    error: folderSubfoldersError,
    data: folderSubfoldersData,
    fetchNextPage: fetchNextFolderSubfolders,
    hasNextPage: hasNextFolderSubfolders,
    isFetchingNextPage: isFetchingNextFolderSubfolders,
  } = useGetFolderSubfolders(currentParentFolderId, openMoveItemDialog);

  const isLoading = currentParentFolderId
    ? isFolderSubfoldersLoading
    : isOrganizationUnitFoldersLoading;
  const isError = currentParentFolderId
    ? isFolderSubfoldersError
    : isOrganizationUnitFoldersError;
  const error = currentParentFolderId
    ? folderSubfoldersError
    : organizationUnitFoldersError;

  const folders = currentParentFolderId
    ? (folderSubfoldersData?.pages?.flatMap((page) => page.data) ?? [])
    : (organizationUnitFoldersData?.pages?.flatMap((page) => page.data) ?? []);

  const breadcrumb = currentParentFolderId
    ? folderSubfoldersData?.pages?.[0].breadcrumb
    : organizationUnitFoldersData?.pages?.[0].breadcrumb;

  const fetchNextPage = currentParentFolderId
    ? fetchNextFolderSubfolders
    : fetchNextOrganizationUnitFolders;
  const hasNextPage = currentParentFolderId
    ? hasNextFolderSubfolders
    : hasNextOrganizationUnitFolders;
  const isFetchingNextPage = currentParentFolderId
    ? isFetchingNextFolderSubfolders
    : isFetchingNextOrganizationUnitFolders;

  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    setValue,
    control,
  } = useForm<TMoveItemFormSchema>({
    resolver: zodResolver(moveItemFormSchema),
    defaultValues: {
      parent_folder_id: selectedFolderId,
    },
  });

  const parentFolderId = useWatch({
    control,
    name: "parent_folder_id",
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setOpenMoveItemDialog(false);
    }
  }, [isSubmitSuccessful, reset, setOpenMoveItemDialog]);

  const { mutateAsync: moveItemMutation } = useMoveItem();

  const onSubmit: SubmitHandler<TMoveItemFormSchema> = async (data) => {
    await moveItemMutation({ id: item.id, moveData: data });
  };

  return (
    <Dialog open={openMoveItemDialog} onOpenChange={setOpenMoveItemDialog}>
      <DialogContent className="w-150 max-w-150!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Move &quot;{item.name}&quot;</DialogTitle>
          </DialogHeader>
          <div className="h-96 flex flex-col">
            {breadcrumb && (
              <div className="pb-6">
                <MoveItemBreadCrumb
                  breadcrumb={breadcrumb}
                  setCurrentParentFolderId={setCurrentParentFolderId}
                  setValue={setValue}
                  reset={reset}
                  item={item}
                />
              </div>
            )}
            <ScrollArea className="flex-1 flex flex-col min-h-0">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Spinner className="text-primary size-9" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {folders?.map((folder) => {
                      const isSelf = item.id === folder.id;
                      const isSelfParent = item.parent_item_id === folder.id;
                      const isSelected = selectedFolderId === folder.id;

                      return (
                        <TableRow
                          key={folder.id}
                          onDoubleClick={() => {
                            if (isSelf) return;

                            setCurrentParentFolderId(folder.id);
                            if (isSelfParent) {
                              reset();
                            } else {
                              setValue("parent_folder_id", folder.id);
                            }
                          }}
                          onClick={() => {
                            if (isSelf) return;

                            if (isSelected) {
                              setSelectedFolderId(null);
                              reset();
                            } else {
                              setSelectedFolderId(folder.id);
                              if (isSelfParent) {
                                reset();
                              } else {
                                setValue("parent_folder_id", folder.id);
                              }
                            }
                          }}
                          data-state={isSelected ? "selected" : undefined}
                          className={`${isSelf && "opacity-50"}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Folder className="size-4" />
                              <span className="truncate">{folder.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              {!isSelfParent && (
                                <Button
                                  type="submit"
                                  variant="outline"
                                  size="xs"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    setValue("parent_folder_id", folder.id);
                                  }}
                                  disabled={isSelf || isSubmitting}
                                >
                                  Move
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="icon-xs"
                                className="border-none bg-transparent hover:bg-input/50"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setCurrentParentFolderId(folder.id);
                                  if (isSelfParent) {
                                    reset();
                                  } else {
                                    setValue("parent_folder_id", folder.id);
                                  }
                                }}
                                disabled={isSelf}
                              >
                                <ChevronRight className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
              {isError && error && (
                <div className="py-4 flex items-center justify-center">
                  <p className="text-destructive text-sm">{error.message}</p>
                </div>
              )}
              {hasNextPage && (
                <div className="flex justify-center mt-4">
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
                      "Load more folders"
                    )}
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={
                (!parentFolderId && !!currentParentFolderId) ||
                isSelectedSelfParent ||
                isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Moving
                </>
              ) : (
                "Move"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
