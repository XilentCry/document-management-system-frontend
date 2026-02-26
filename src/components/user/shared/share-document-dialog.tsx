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
import { Controller, SubmitHandler, useForm } from "react-hook-form";

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

  const [selectedShareableUserIds, setSelectedShareableUserIds] = useState<
    number[]
  >([]);

  const toggleShareableUser = (userId: number) => {
    setSelectedShareableUserIds((prev) => {
      const updated = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];

      setValue("share_with", updated, { shouldValidate: true });

      return updated;
    });
  };

  const selectedUsersLabel =
    selectedShareableUserIds.length === 0
      ? "Select user(s)"
      : `${selectedShareableUserIds.length} user(s) selected`;

  const selectedShareableUsers = shareableUsers.filter((shareableUser) =>
    selectedShareableUserIds.includes(shareableUser.id),
  );

  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    setValue,
    control,
  } = useForm<TShareDocumentFormSchema>({
    resolver: zodResolver(shareDocumentFormSchema),
    defaultValues: {
      share_with: [],
      share_role_id: 1,
    },
  });

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
                      {selectedShareableUsers.map((shareableUser) => (
                        <Item
                          key={shareableUser.id}
                          variant="outline"
                          size="xs"
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
                            <Controller
                              control={control}
                              name="share_role_id"
                              render={({ field }) => (
                                <Select
                                  value={String(field.value)}
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue>
                                      {
                                        shareRoles.find(
                                          (role) => role.id === field.value,
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
                              )}
                            />
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                toggleShareableUser(shareableUser.id)
                              }
                            >
                              <X />
                            </Button>
                          </ItemActions>
                        </Item>
                      ))}
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
              disabled={isSubmitting || selectedShareableUserIds.length === 0}
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
