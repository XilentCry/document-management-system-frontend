import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  shareDocumentFormSchema,
  TShareDocumentFormSchema,
} from "@/schemas/documents/share-document-form-schema";
import { useShareDocument } from "@/services/documents/mutations";
import { useGetShareableUsers } from "@/services/items/queries";
import { useGetAllShareRoles } from "@/services/share-roles/queries";
import { TItem } from "@/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, UsersRound, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const DEFAULT_ROLE_ID = 1;

export function ShareDocumentDialog({
  item,
  openShareDialog,
  setOpenShareDialog,
}: {
  item: TItem;
  openShareDialog: boolean;
  setOpenShareDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    isLoading: isLoadingShareableUsers,
    isError: isShareableUsersError,
    error: ShareableUsersError,
    data: shareableUsers = [],
  } = useGetShareableUsers(item.id);

  const {
    isLoading: isLoadingShareRoles,
    isError: isShareRolesError,
    error: shareRolesError,
    data: shareRoles = [],
  } = useGetAllShareRoles();

  const isLoading = isLoadingShareableUsers || isLoadingShareRoles;
  const isError = isShareableUsersError || isShareRolesError;
  const error = ShareableUsersError || shareRolesError;

  const [selectedUsers, setSelectedUsers] = useState<
    { userId: number; shareRoleId: number }[]
  >([]);

  const selectedShareableUserIds = selectedUsers.map((u) => u.userId);

  const selectedUsersLabel =
    selectedUsers.length === 0
      ? "Select user(s)"
      : `${selectedUsers.length} user(s) selected`;

  const selectedShareableUsers = shareableUsers.filter((u) =>
    selectedShareableUserIds.includes(u.id),
  );

  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    setValue,
  } = useForm<TShareDocumentFormSchema>({
    resolver: zodResolver(shareDocumentFormSchema),
    defaultValues: {
      share_with: [],
    },
  });

  // Sync local state to the form value
  const syncFormValue = (
    updated: { userId: number; shareRoleId: number }[],
  ) => {
    setValue(
      "share_with",
      updated.map((u) => ({ user_id: u.userId, share_role_id: u.shareRoleId })),
      { shouldValidate: true },
    );
  };

  const toggleShareableUser = (userId: number) => {
    setSelectedUsers((prev) => {
      const updated = prev.some((u) => u.userId === userId)
        ? prev.filter((u) => u.userId !== userId)
        : [...prev, { userId, shareRoleId: DEFAULT_ROLE_ID }];

      syncFormValue(updated);
      return updated;
    });
  };

  const updateUserRole = (userId: number, shareRoleId: number) => {
    setSelectedUsers((prev) => {
      const updated = prev.map((u) =>
        u.userId === userId ? { ...u, shareRoleId } : u,
      );

      syncFormValue(updated);
      return updated;
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setOpenShareDialog(false);
    }
  }, [isSubmitSuccessful, reset, setOpenShareDialog]);

  const { mutateAsync: shareItemMutation } = useShareDocument();

  const onSubmit: SubmitHandler<TShareDocumentFormSchema> = async (data) => {
    await shareItemMutation({
      id: item.id,
      shareData: data,
    });
  };

  return (
    <Dialog open={openShareDialog} onOpenChange={setOpenShareDialog}>
      <DialogContent className="w-150 max-w-150!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Share &quot;{item.name}&quot;</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 h-68 flex flex-col gap-6">
            {isError && error ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-destructive text-sm">{error.message}</p>
              </div>
            ) : isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Spinner className="text-primary size-9" />
              </div>
            ) : (
              <>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button variant="outline" className="justify-between" />
                    }
                  >
                    {selectedUsersLabel}
                    <ChevronsUpDown className="size-4" />
                  </PopoverTrigger>
                  <PopoverContent className="w-(--anchor-width)">
                    <Command>
                      <CommandInput placeholder="Search user..." />
                      <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                          {shareableUsers.map((shareableUser) => (
                            <CommandItem
                              key={shareableUser.id}
                              onSelect={() =>
                                toggleShareableUser(shareableUser.id)
                              }
                            >
                              <Checkbox
                                checked={selectedShareableUserIds.includes(
                                  shareableUser.id,
                                )}
                                onCheckedChange={() =>
                                  toggleShareableUser(shareableUser.id)
                                }
                              />
                              <div className="min-w-0">
                                <p className="truncate">
                                  {shareableUser.first_name}{" "}
                                  {shareableUser.middle_name ?? ""}{" "}
                                  {shareableUser.last_name}
                                </p>
                                <p className="truncate">
                                  {shareableUser.email}
                                </p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <ScrollArea className="flex-1 min-h-0">
                  {selectedShareableUsers.length === 0 ? (
                    <EmptyState
                      icon={UsersRound}
                      title="No users selected"
                      description="Selected users appear here."
                    />
                  ) : (
                    <div className="space-y-2">
                      {selectedShareableUsers.map((shareableUser) => {
                        const selectedUser = selectedUsers.find(
                          (u) => u.userId === shareableUser.id,
                        );

                        return (
                          <Item
                            key={shareableUser.id}
                            size="xs"
                            className="border-t-0 border-x-0 border-border rounded-none"
                          >
                            <ItemContent>
                              <ItemTitle>
                                {shareableUser.first_name}{" "}
                                {shareableUser.middle_name ?? ""}{" "}
                                {shareableUser.last_name}
                              </ItemTitle>
                              <ItemDescription>
                                {shareableUser.email}
                              </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                              <Select
                                value={String(
                                  selectedUser?.shareRoleId ?? DEFAULT_ROLE_ID,
                                )}
                                onValueChange={(value) =>
                                  updateUserRole(
                                    shareableUser.id,
                                    Number(value),
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue>
                                    {
                                      shareRoles.find(
                                        (role) =>
                                          role.id ===
                                          (selectedUser?.shareRoleId ??
                                            DEFAULT_ROLE_ID),
                                      )?.name
                                    }
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {shareRoles.map((shareRole) => (
                                    <SelectItem
                                      key={shareRole.id}
                                      value={String(shareRole.id)}
                                    >
                                      {shareRole.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  toggleShareableUser(shareableUser.id)
                                }
                              >
                                <X />
                              </Button>
                            </ItemActions>
                          </Item>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </>
            )}
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
    </Dialog>
  );
}
