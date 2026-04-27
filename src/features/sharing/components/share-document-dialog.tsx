import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import {
  shareDocumentFormSchema,
  TShareDocumentFormSchema,
} from "@/features/documents/schemas/share-document-form-schema";
import { useShareDocument } from "@/features/documents/api/mutations";
import { useGetDocumentShares } from "@/features/documents/api/queries";
import { useGetShareableUsers } from "@/features/items/api/queries";
import { useGetAllShareRoles } from "@/features/sharing/api/queries";
import { useCurrentUser } from "@/features/auth/api/me-queries";
import { TItem } from "@/features/items/types/item";
import { TShareableUser } from "@/features/sharing/types/shareable-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Info, Settings } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { DiscardChangesAlertDialog } from "@/features/uploads/components/discard-changes-alert-dialog";
import { ShareItemRow } from "@/features/sharing/components/share-item-row";

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
  const [mode, setMode] = useState<"share" | "settings">("share");
  const { data: currentUser } = useCurrentUser();
  const isOwner = currentUser?.id === item.owner.id;
  const isLocked = !!item.is_locked;

  const anchor = useComboboxAnchor();

  const {
    isLoading: isLoadingShareableUsers,
    isFetching: isFetchingShareableUsers,
    isError: isShareableUsersError,
    error: shareableUsersError,
    data: shareableUsers = [],
  } = useGetShareableUsers(item.id, debouncedSearchTerm, openShareDialog);

  const { data: shareRoles = [] } =
    useGetAllShareRoles(openShareDialog);

  const viewerRoleId = shareRoles.find((role) => role.name === "viewer")?.id;
  const editorRoleId = shareRoles.find((role) => role.name === "editor")?.id;

  const defaultRoleId = viewerRoleId ?? shareRoles[0]?.id ?? "";

  const [selectedUsers, setSelectedUsers] = useState<TShareableUser[]>([]);
  const hasSelectedUserWithOrgAccess = selectedUsers.some(
    (u) => u.has_organization_unit_access,
  );

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    setValue,
  } = useForm<TShareDocumentFormSchema, unknown, TShareDocumentFormSchema>({
    resolver: zodResolver(shareDocumentFormSchema),
    defaultValues: {
      share_with: [],
      share_role_id: "",
      allow_download: false,
    },
  });

  const currentRoleId = useWatch({ control, name: "share_role_id" });

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
      setMode("share");
    }
  }

  useEffect(() => {
    if (openShareDialog) {
      reset({
        share_with: [],
        share_role_id: defaultRoleId,
        allow_download: false,
      });
    }
  }, [openShareDialog, reset, defaultRoleId]);

  useEffect(() => {
    if (openShareDialog && !currentRoleId && defaultRoleId) {
      setValue("share_role_id", defaultRoleId);
    }
  }, [openShareDialog, currentRoleId, defaultRoleId, setValue]);

  useEffect(() => {
    if (
      hasSelectedUserWithOrgAccess &&
      viewerRoleId &&
      currentRoleId === viewerRoleId
    ) {
      setValue("share_role_id", editorRoleId ?? "");
    }
  }, [
    hasSelectedUserWithOrgAccess,
    currentRoleId,
    viewerRoleId,
    editorRoleId,
    setValue,
  ]);

  useEffect(() => {
    if (isLocked && viewerRoleId && currentRoleId !== viewerRoleId) {
      setValue("share_role_id", viewerRoleId);
    }
  }, [isLocked, viewerRoleId, currentRoleId, setValue]);

  useEffect(() => {
    if (isLocked) {
      setValue("allow_download", false);
    }
  }, [isLocked, setValue]);

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
              <div className="flex items-center gap-2 min-w-0 pr-6">
                {mode === "settings" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setMode("share")}
                  >
                    <ArrowLeft />
                  </Button>
                )}
                <DialogTitle className="truncate">
                  {mode === "share"
                    ? <>Share &quot;{item.name}&quot;</>
                    : <>Settings for &quot;{item.name}&quot;</>}
                </DialogTitle>
              </div>
            </DialogHeader>
            {mode === "settings" ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium">Access</p>
                <Controller
                  name="allow_download"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={field.value}
                        disabled={isLocked}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Allow download
                    </label>
                  )}
                />
              </div>
            ) : (
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
                                      {shareableUser.has_organization_unit_access && (
                                        <p className="text-amber-600 text-xs">
                                          Already has view & download via organization unit. Assign Editor to grant additional permission.
                                        </p>
                                      )}
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
                  {selectedUsers.length > 0 && (
                    <div className="shrink-0">
                      <Controller
                        name="share_role_id"
                        control={control}
                        render={({ field }) => {
                          const selectedRole = shareRoles.find(
                            (r) => r.id === field.value,
                          );

                          return (
                            <div className="flex items-center gap-2">
                              <Select
                                value={field.value}
                                onValueChange={(value) => field.onChange(value)}
                              >
                                <SelectTrigger className="capitalize">
                                  <SelectValue>{selectedRole?.name}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {shareRoles.map((role) => (
                                    <SelectItem
                                      key={role.id}
                                      value={role.id}
                                      className="capitalize"
                                      disabled={
                                        (hasSelectedUserWithOrgAccess &&
                                          role.name === "viewer") ||
                                        (isLocked && role.name !== "viewer")
                                      }
                                    >
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {selectedRole ? (
                                <Tooltip>
                                  <TooltipTrigger
                                    type="button"
                                    className={cn(
                                      buttonVariants({ variant: "ghost", size: "icon" }),
                                    )}
                                  >
                                    <Info className="size-4" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {selectedRole.description}
                                  </TooltipContent>
                                </Tooltip>
                              ) : null}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setMode("settings")}
                              >
                                <Settings />
                              </Button>
                            </div>
                          );
                        }}
                      />
                    </div>
                  )}
                </div>

                {hasSelectedUserWithOrgAccess && (
                  <Alert variant="warning">
                    <AlertCircle />
                    <AlertTitle>Viewer role unavailable</AlertTitle>
                    <AlertDescription>
                      At least one selected user already has view &amp; download access via their organization unit. Choose Editor to grant additional permission.
                    </AlertDescription>
                  </Alert>
                )}

                {isLocked && (
                  <Alert variant="warning">
                    <AlertCircle />
                    <AlertTitle>File is locked</AlertTitle>
                    <AlertDescription>
                      Shares are limited to view-only.
                    </AlertDescription>
                  </Alert>
                )}

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
                        <div className="flex justify-center mt-4">
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
            )}
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  selectedUsers.length === 0 ||
                  !currentRoleId
                }
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
