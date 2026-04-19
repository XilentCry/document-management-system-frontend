import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import {
  shareDocumentFormSchema,
  TShareDocumentFormSchema,
} from "@/schemas/documents/share-document-form-schema";
import { useShareDocument } from "@/services/documents/mutations";
import { useGetDocumentShares } from "@/services/documents/queries";
import { useGetShareableUsers } from "@/services/items/queries";
import { useCurrentUser } from "@/services/user/queries";
import { TBasicUser } from "@/types/basic-user";
import { TItem } from "@/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DiscardChangesAlertDialog } from "./discard-changes-alert-dialog";
import { ShareItemRow } from "./share-item-row";

export function ShareDocumentDialog({
  item,
  openShareDialog,
  setOpenShareDialog,
}: {
  item: TItem;
  openShareDialog: boolean;
  setOpenShareDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const isOwner = currentUser?.id === item.owner.id;

  const anchor = useComboboxAnchor();

  const {
    isLoading: isLoadingShareableUsers,
    isFetching: isFetchingShareableUsers,
    isError: isShareableUsersError,
    error: shareableUsersError,
    data: shareableUsers = [],
  } = useGetShareableUsers(item.id, debouncedSearchTerm, openShareDialog);

  const [selectedUsers, setSelectedUsers] = useState<TBasicUser[]>([]);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<TShareDocumentFormSchema>({
    resolver: zodResolver(shareDocumentFormSchema),
    defaultValues: {
      share_with: [],
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      setOpenShareDialog(false);
    }
  }, [isSubmitSuccessful, setOpenShareDialog]);

  const [prevOpenShareDialog, setPrevOpenShareDialog] = useState(openShareDialog);

  if (openShareDialog !== prevOpenShareDialog) {
    setPrevOpenShareDialog(openShareDialog);
    if (openShareDialog) {
      setSelectedUsers([]);
      setSearchTerm("");
    }
  }

  useEffect(() => {
    if (openShareDialog) {
      reset({ share_with: [] });
    }
  }, [openShareDialog, reset]);

  const handleOpenChange = (open: boolean) => {
    if (!open && selectedUsers.length > 0) {
      setShowDiscardAlert(true);
      return;
    }
    setOpenShareDialog(open);
  };

  const handleDiscard = () => {
    setShowDiscardAlert(false);
    setOpenShareDialog(false);
  };

  const { mutateAsync: shareItemMutation } = useShareDocument();

  const {
    data: activeSharesData,
    isLoading: isLoadingActiveShares,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetDocumentShares(item.id, openShareDialog);

  const activeShares = activeSharesData?.pages.flatMap((page) => page.data) ?? [];

  const onSubmit: SubmitHandler<TShareDocumentFormSchema> = async (data) => {
    await shareItemMutation({
      id: item.id,
      shareData: data,
    });
  };

  return (
    <>
      <Dialog open={openShareDialog} onOpenChange={handleOpenChange}>
        <DialogContent className="w-150 max-w-150!">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 min-w-0"
          >
            <DialogHeader>
              <DialogTitle>Share &quot;{item.name}&quot;</DialogTitle>
            </DialogHeader>
            <div className="max-h-96 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Controller
                    name="share_with"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        filter={null}
                        items={shareableUsers}
                        multiple
                        value={selectedUsers}
                        onValueChange={(users) => {
                          setSelectedUsers(users);
                          field.onChange(users.map((u) => u.id));
                        }}
                        inputValue={searchTerm}
                        onInputValueChange={(val) => {
                          setSearchTerm(val);
                          if (val.trim().length > 0) {
                            setIsDropdownOpen(true);
                          } else {
                            setIsDropdownOpen(false);
                          }
                        }}
                        itemToStringValue={(user) =>
                          `${user.first_name} ${user.last_name} ${user.email}`
                        }
                        open={isDropdownOpen}
                        onOpenChange={(isOpen) => {
                          if (isOpen && searchTerm.trim().length === 0) return;
                          setIsDropdownOpen(isOpen);
                        }}
                      >
                        <ComboboxChips ref={anchor}>
                          <ComboboxValue>
                            {selectedUsers.map((user) => (
                              <ComboboxChip key={user.id}>
                                {user.first_name} {user.middle_name ?? ""}{" "}
                                {user.last_name}
                              </ComboboxChip>
                            ))}
                          </ComboboxValue>
                          <ComboboxChipsInput
                            placeholder={
                              selectedUsers.length === 0 ? "Add people" : ""
                            }
                          />
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                          {searchTerm.trim().length ===
                            0 ? null : isLoadingShareableUsers ||
                              isFetchingShareableUsers ? (
                            <div className="flex items-center justify-center p-4">
                              <Spinner className="text-primary size-5" />
                            </div>
                          ) : isShareableUsersError && shareableUsersError ? (
                            <div className="flex items-center justify-center p-4">
                              <p className="text-destructive text-sm">
                                {shareableUsersError.message}
                              </p>
                            </div>
                          ) : shareableUsers.length === 0 ? (
                            searchTerm === debouncedSearchTerm ? (
                              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                                No users found.
                              </div>
                            ) : null
                          ) : (
                            <ComboboxList>
                              {shareableUsers.map((shareableUser) => (
                                <ComboboxItem
                                  key={shareableUser.id}
                                  value={shareableUser}
                                >
                                  <div className="min-w-0">
                                    <p className="truncate font-medium">
                                      {shareableUser.first_name}{" "}
                                      {shareableUser.middle_name ?? ""}{" "}
                                      {shareableUser.last_name}
                                    </p>
                                    <p className="truncate text-muted-foreground text-xs">
                                      {shareableUser.email}
                                    </p>
                                  </div>
                                </ComboboxItem>
                              ))}
                            </ComboboxList>
                          )}
                        </ComboboxContent>
                      </Combobox>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium">People with access</h3>
                {isLoadingActiveShares ? (
                  <div className="flex items-center justify-center py-4">
                    <Spinner className="text-primary size-9" />
                  </div>
                ) : (
                  <ScrollArea className="max-h-52">
                    <div className="flex flex-col gap-4">
                      <Item size="xs">
                        <ItemContent className="min-w-0">
                          <ItemTitle className="block w-auto truncate">{item.owner.first_name} {item.owner.middle_name ?? ""} {item.owner.last_name}</ItemTitle>
                          <ItemDescription>{item.owner.email}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <p className="text-muted-foreground">Owner</p>
                        </ItemActions>
                      </Item>
                    </div>

                    {activeShares.map((share) => (
                      <ShareItemRow
                        key={share.id}
                        share={share}
                        item={item}
                        isOwner={isOwner}
                      />
                    ))}

                    {isFetchNextPageError && (
                      <div className="py-4 flex flex-col items-center justify-center gap-4">
                        <p className="text-destructive text-sm text-center px-4">
                          Failed to load more users. Please try again.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            hasNextPage && !isFetchingNextPage && fetchNextPage()
                          }
                        >
                          Retry
                        </Button>
                      </div>
                    )}

                    {hasNextPage && (
                      <div className="flex justify-center mt-4 pb-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                        >
                          {isFetchingNextPage ? (
                            <>
                              <Spinner />
                              Loading more...
                            </>
                          ) : (
                            "Load more"
                          )}
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting || selectedUsers.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Sharing...
                  </>
                ) : (
                  "Share"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog >

      <DiscardChangesAlertDialog
        showDiscardAlert={showDiscardAlert}
        setShowDiscardAlert={setShowDiscardAlert}
        handleDiscard={handleDiscard}
      />
    </>
  );
}
