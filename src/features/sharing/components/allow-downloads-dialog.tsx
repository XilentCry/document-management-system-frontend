import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import {
  allowDownloadsFormSchema,
  TAllowDownloadsFormSchema,
} from "@/features/documents/schemas/allow-downloads-form-schema";
import {
  useBulkGrantDownload,
  useSetDownloadGrant,
} from "@/features/documents/api/mutations";
import { useGetDownloadEligibleUsers } from "@/features/documents/api/queries";
import { TDownloadEligibleUser } from "@/features/documents/types/download-eligible-user";
import { TItem } from "@/features/items/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DiscardChangesAlertDialog } from "@/features/uploads/components/discard-changes-alert-dialog";

export function AllowDownloadsDialog({
  item,
  openAllowDownloadsDialog,
  setOpenAllowDownloadsDialog,
}: {
  item: TItem;
  openAllowDownloadsDialog: boolean;
  setOpenAllowDownloadsDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<TDownloadEligibleUser[]>([]);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  const isLocked = !!item.is_locked;

  const anchor = useComboboxAnchor();

  const {
    isLoading: isLoadingCandidates,
    isFetching: isFetchingCandidates,
    isError: isCandidatesError,
    error: candidatesError,
    data: candidatesData,
  } = useGetDownloadEligibleUsers(
    item.id,
    debouncedSearchTerm,
    openAllowDownloadsDialog,
    "not_granted",
  );

  const candidates = candidatesData?.pages.flatMap((page) => page.data) ?? [];
  const selectedIds = new Set(selectedUsers.map((u) => u.id));
  const visibleCandidates = candidates.filter((u) => !selectedIds.has(u.id));

  const {
    data: grantedData,
    isLoading: isLoadingGranted,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetDownloadEligibleUsers(
    item.id,
    "",
    openAllowDownloadsDialog,
    "granted",
  );

  const grantedUsers = grantedData?.pages.flatMap((page) => page.data) ?? [];

  const { mutateAsync: bulkGrantMutation } = useBulkGrantDownload(item.id);
  const { mutate: setGrantMutation, isPending: isRevoking } = useSetDownloadGrant(
    item.id,
  );

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<TAllowDownloadsFormSchema>({
    resolver: zodResolver(allowDownloadsFormSchema),
    defaultValues: {
      allow_download_with: [],
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      setOpenAllowDownloadsDialog(false);
    }
  }, [isSubmitSuccessful, setOpenAllowDownloadsDialog]);

  const [prevOpen, setPrevOpen] = useState(openAllowDownloadsDialog);
  if (openAllowDownloadsDialog !== prevOpen) {
    setPrevOpen(openAllowDownloadsDialog);
    if (openAllowDownloadsDialog) {
      setSelectedUsers([]);
      setSearchTerm("");
      reset({ allow_download_with: [] });
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && selectedUsers.length > 0) {
      setShowDiscardAlert(true);
      return;
    }
    setOpenAllowDownloadsDialog(open);
  };

  const handleDiscard = () => {
    setShowDiscardAlert(false);
    setOpenAllowDownloadsDialog(false);
  };

  const onSubmit: SubmitHandler<TAllowDownloadsFormSchema> = async (data) => {
    await bulkGrantMutation(data.allow_download_with);
  };

  return (
    <>
      <Dialog open={openAllowDownloadsDialog} onOpenChange={handleOpenChange}>
        <DialogContent className="w-150 max-w-150!">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 min-w-0"
          >
            <DialogHeader>
              <DialogTitle className="truncate pr-6">
                Allow downloads for &quot;{item.name}&quot;
              </DialogTitle>
            </DialogHeader>

            <div className="max-h-96 flex flex-col gap-4">
              <Controller
                name="allow_download_with"
                control={control}
                render={({ field }) => (
                  <Combobox
                    filter={null}
                    items={visibleCandidates}
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
                    disabled={isLocked}
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
                        0 ? null : isLoadingCandidates ||
                          isFetchingCandidates ? (
                        <div className="flex items-center justify-center p-4">
                          <Spinner className="text-primary size-5" />
                        </div>
                      ) : isCandidatesError && candidatesError ? (
                        <div className="flex items-center justify-center p-4">
                          <p className="text-destructive text-sm">
                            {candidatesError.message}
                          </p>
                        </div>
                      ) : visibleCandidates.length === 0 ? (
                        searchTerm === debouncedSearchTerm ? (
                          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                            No users found.
                          </div>
                        ) : null
                      ) : (
                        <ComboboxList>
                          {visibleCandidates.map((candidate) => (
                            <ComboboxItem key={candidate.id} value={candidate}>
                              <div className="min-w-0">
                                <p className="truncate font-medium">
                                  {candidate.first_name}{" "}
                                  {candidate.middle_name ?? ""}{" "}
                                  {candidate.last_name}
                                </p>
                                <p className="truncate text-muted-foreground text-xs">
                                  {candidate.email}
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

              {isLocked && (
                <Alert variant="warning">
                  <AlertCircle />
                  <AlertTitle>File is locked</AlertTitle>
                  <AlertDescription>
                    Download grants are unavailable.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium">
                  People with download access
                </h3>
                {isLoadingGranted ? (
                  <div className="flex items-center justify-center py-4">
                    <Spinner className="text-primary size-9" />
                  </div>
                ) : (
                  <ScrollArea className="max-h-52">
                    <div className="flex flex-col">
                      <Item size="xs">
                        <ItemContent className="min-w-0">
                          <ItemTitle className="block w-auto truncate">
                            {item.owner.first_name}{" "}
                            {item.owner.middle_name ?? ""}{" "}
                            {item.owner.last_name}
                          </ItemTitle>
                          <ItemDescription>{item.owner.email}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <p className="text-muted-foreground text-sm">Owner</p>
                        </ItemActions>
                      </Item>

                      {grantedUsers.map((user) => (
                        <Item key={user.id} size="xs">
                          <ItemContent className="min-w-0">
                            <ItemTitle className="block w-auto truncate">
                              {user.first_name} {user.middle_name ?? ""}{" "}
                              {user.last_name}
                            </ItemTitle>
                            <ItemDescription>{user.email}</ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                setGrantMutation({
                                  userId: user.id,
                                  allow: false,
                                })
                              }
                              disabled={isRevoking}
                              aria-label={`Remove download access for ${user.first_name} ${user.last_name}`}
                            >
                              {isRevoking ? (
                                <Spinner className="size-4" />
                              ) : (
                                <X className="size-4" />
                              )}
                            </Button>
                          </ItemActions>
                        </Item>
                      ))}

                      {isFetchNextPageError && (
                        <div className="py-4 flex flex-col items-center justify-center gap-2">
                          <p className="text-destructive text-sm text-center">
                            Failed to load more users.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              hasNextPage &&
                              !isFetchingNextPage &&
                              fetchNextPage()
                            }
                          >
                            Retry
                          </Button>
                        </div>
                      )}

                      {hasNextPage && !isFetchNextPageError && (
                        <div className="flex justify-center mt-2 pb-2">
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
                    </div>
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
                disabled={
                  isLocked || isSubmitting || selectedUsers.length === 0
                }
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Allowing...
                  </>
                ) : (
                  "Allow"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DiscardChangesAlertDialog
        showDiscardAlert={showDiscardAlert}
        setShowDiscardAlert={setShowDiscardAlert}
        handleDiscard={handleDiscard}
      />
    </>
  );
}
