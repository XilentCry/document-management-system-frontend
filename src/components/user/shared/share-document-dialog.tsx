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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import {
  shareDocumentFormSchema,
  TShareDocumentFormSchema,
} from "@/schemas/documents/share-document-form-schema";
import { useShareDocument } from "@/services/documents/mutations";
import { useGetShareableUsers } from "@/services/items/queries";
import { useGetAllShareRoles } from "@/services/share-roles/queries";
import { TBasicUser } from "@/types/basic-user";
import { TItem } from "@/types/item";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";

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

  const anchor = useComboboxAnchor()

  const {
    isLoading: isLoadingShareableUsers,
    isFetching: isFetchingShareableUsers,
    isError: isShareableUsersError,
    error: shareableUsersError,
    data: shareableUsers = [],
  } = useGetShareableUsers(item.id, debouncedSearchTerm, openShareDialog);

  const {
    isLoading: isLoadingShareRoles,
    isError: isShareRolesError,
    error: shareRolesError,
    data: shareRoles = [],
  } = useGetAllShareRoles(openShareDialog);

  const [selectedUsers, setSelectedUsers] = useState<TBasicUser[]>([]);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    setValue,
  } = useForm<TShareDocumentFormSchema>({
    resolver: zodResolver(shareDocumentFormSchema),
    defaultValues: {
      share_with: [],
    },
  });

  const shareRoleId = useWatch({ control, name: "share_role_id" });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setSelectedUsers([]);
      setSearchTerm("");
      setOpenShareDialog(false);
    }
  }, [isSubmitSuccessful, reset, setOpenShareDialog]);

  useEffect(() => {
    if (shareRoles.length > 0 && shareRoleId === undefined) {
      setValue("share_role_id", shareRoles[0].id, { shouldValidate: true });
    }
  }, [shareRoles, shareRoleId, setValue]);

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 min-w-0"
        >
          <DialogHeader>
            <DialogTitle>Share &quot;{item.name}&quot;</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 flex flex-col gap-6">
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
                        field.onChange(users.map(u => u.id));
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
                              {user.first_name} {user.middle_name ?? ""} {user.last_name}
                            </ComboboxChip>
                          ))}
                        </ComboboxValue>
                        <ComboboxChipsInput
                          placeholder={
                            selectedUsers.length === 0
                              ? "Add people"
                              : ""
                          }
                        />
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        {searchTerm.trim().length === 0 ? null : isLoadingShareableUsers || isFetchingShareableUsers ? (
                          <div className="flex items-center justify-center p-4">
                            <Spinner className="text-primary size-5" />
                          </div>
                        ) : isShareableUsersError && shareableUsersError ? (
                          <div className="flex items-center justify-center p-4">
                            <p className="text-destructive text-sm">{shareableUsersError.message}</p>
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

              {selectedUsers.length > 0 && (
                <Controller
                  name="share_role_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role">
                          {
                            shareRoles.find(
                              (role) => String(role.id) === String(field.value),
                            )?.name
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingShareRoles ? (
                          <div className="p-4 flex items-center justify-center">
                            <Spinner className="text-primary size-5" />
                          </div>
                        ) : isShareRolesError && shareRolesError ? (
                          <div className="p-4 text-center text-sm text-destructive">
                            {shareRolesError.message}
                          </div>
                        ) : (
                          shareRoles.map((shareRole) => (
                            <SelectItem
                              key={shareRole.id}
                              value={String(shareRole.id)}
                            >
                              {shareRole.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
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
      </DialogContent >
    </Dialog >
  );
}
