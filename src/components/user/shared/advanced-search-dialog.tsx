"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import { TAdvancedSearchFormSchema } from "@/schemas/items/advanced-search-form-schema";
import { useGetAllClassifications } from "@/services/classifications/queries";
import { useSearchSpecificUsers } from "@/services/organization-units/queries";
import { useSearchSharedToUsers } from "@/services/users/queries";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { TBasicUser } from "@/types/basic-user";
import { Folder, File } from "lucide-react";
import { useState, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, SubmitHandler, useWatch } from "react-hook-form";

type AdvanceSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<TAdvancedSearchFormSchema>;
  onSubmit: SubmitHandler<TAdvancedSearchFormSchema>;
  setDraftSearchTerm: (value: string) => void;
};

export function AdvancedSearchDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  setDraftSearchTerm,
}: AdvanceSearchDialogProps) {
  const currentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );

  const [specificUserSearchTerm, setSpecificUserSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<TBasicUser | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const debouncedSpecificUserSearchTerm = useDebounce(specificUserSearchTerm);
  const userAnchor = useComboboxAnchor();

  const [sharedToUserSearchTerm, setSharedToUserSearchTerm] = useState("");
  const [selectedSharedToUser, setSelectedSharedToUser] = useState<TBasicUser | null>(null);
  const [isSharedToDropdownOpen, setIsSharedToDropdownOpen] = useState(false);
  const debouncedSharedToSearchTerm = useDebounce(sharedToUserSearchTerm);
  const sharedToAnchor = useComboboxAnchor();

  const {
    isLoading: isClassificationsLoading,
    isError: isClassificationsError,
    error: classificationsError,
    data: classifications = [],
  } = useGetAllClassifications(open);

  const {
    isLoading: isSpecificUsersLoading,
    isFetching: isSpecificUsersFetching,
    isError: isSpecificUsersError,
    error: specificUsersError,
    specificUsers = [],
  } = useSearchSpecificUsers(
    currentOrganizationUnitId,
    debouncedSpecificUserSearchTerm,
    open,
  );

  const {
    isLoading: isSharedToUsersLoading,
    isFetching: isSharedToUsersFetching,
    isError: isSharedToUsersError,
    error: sharedToUsersError,
    sharedToUsers: sharedToUsers = [],
  } = useSearchSharedToUsers(
    debouncedSharedToSearchTerm,
    open,
  );

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const searchType = useWatch({ control, name: "type", defaultValue: null });
  const searchOwner = useWatch({ control, name: "owner", defaultValue: null });

  useEffect(() => {
    if (!open) {
      reset({
        type: null,
        itemName: "",
        classification: null,
        owner: null,
        owner_id: null,
        shared_to: null,
      });
      setSpecificUserSearchTerm("");
      setSelectedUser(null);
      setSharedToUserSearchTerm("");
      setSelectedSharedToUser(null);
    }
  }, [open, reset, setDraftSearchTerm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-250 max-w-250!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Advanced search</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <div className="flex items-center gap-4">
                <FieldLabel className="w-30">Type</FieldLabel>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex-1">
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? "any"}
                          onValueChange={(value) => {
                            field.onChange(value === "any" ? null : value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {field.value === null && <p>Any</p>}
                              {field.value === "folder" && <p>Folder</p>}
                              {field.value === "file" && <p>File</p>}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="any">
                                <div className="w-4" />
                                Any
                              </SelectItem>
                              <SelectItem value="folder">
                                <Folder />
                                Folder
                              </SelectItem>
                              <SelectItem value="file">
                                <File className="size-4" />
                                File
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {errors.type && (
                    <FieldError>{errors.type.message}</FieldError>
                  )}
                </div>
              </div>
            </Field>
            <Field>
              <div className="flex items-center gap-4">
                <FieldLabel className="w-30">Owner</FieldLabel>
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex-1">
                      <Controller
                        name="owner"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? "anyone"}
                            onValueChange={(value) => {
                              field.onChange(value === "anyone" ? null : value);

                              if (value !== "user") {
                                form.setValue("owner_id", null);
                                setSpecificUserSearchTerm("");
                                setSelectedUser(null);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                {field.value === null && <p>Anyone</p>}
                                {field.value === "me" && <p>Owned by me</p>}
                                {field.value === "not_me" && (
                                  <p>Not owned by me</p>
                                )}
                                {field.value === "user" && (
                                  <p>Specific person...</p>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="anyone">Anyone</SelectItem>
                                <SelectItem value="me">Owned by me</SelectItem>
                                <SelectItem value="not_me">
                                  Not owned by me
                                </SelectItem>
                                <SelectItem value="user">
                                  Specific person...
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    {errors.owner && (
                      <FieldError>{errors.owner.message}</FieldError>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    {searchOwner === "user" && (
                      <div className="flex flex-col gap-1 w-full relative">
                        <Controller
                          name="owner_id"
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              filter={null}
                              items={specificUsers}
                              multiple
                              value={selectedUser ? [selectedUser] : []}
                              onValueChange={(users) => {
                                const user = users.length > 0 ? users[users.length - 1] : null;
                                setSelectedUser(user);
                                field.onChange(user ? user.id : null);
                                if (user) setSpecificUserSearchTerm("");
                              }}
                              inputValue={specificUserSearchTerm}
                              onInputValueChange={(val) => {
                                setSpecificUserSearchTerm(val);
                                if (val.trim().length > 0 && !selectedUser) {
                                  setIsUserDropdownOpen(true);
                                } else {
                                  setIsUserDropdownOpen(false);
                                }
                              }}
                              itemToStringValue={(user) =>
                                `${user.first_name} ${user.last_name} ${user.email}`
                              }
                              open={isUserDropdownOpen}
                              onOpenChange={(isOpen) => {
                                if (isOpen && (specificUserSearchTerm.trim().length === 0 || selectedUser)) return;
                                setIsUserDropdownOpen(isOpen);
                              }}
                            >
                              <ComboboxChips ref={userAnchor} className="w-full">
                                <ComboboxValue>
                                  {selectedUser && (
                                    <ComboboxChip key={selectedUser.id}>
                                      {selectedUser.first_name}{" "}
                                      {selectedUser.middle_name ?? ""}{" "}
                                      {selectedUser.last_name}
                                    </ComboboxChip>
                                  )}
                                </ComboboxValue>
                                <ComboboxChipsInput
                                  readOnly={!!selectedUser}
                                  placeholder={
                                    selectedUser ? "" : "Search user..."
                                  }
                                />
                              </ComboboxChips>
                              <ComboboxContent anchor={userAnchor} className="w-(--anchor-width)">
                                {specificUserSearchTerm.trim().length === 0 ? null : isSpecificUsersLoading || isSpecificUsersFetching ? (
                                  <div className="flex items-center justify-center p-4">
                                    <Spinner className="text-primary size-5" />
                                  </div>
                                ) : isSpecificUsersError && specificUsersError ? (
                                  <div className="flex items-center justify-center p-4">
                                    <p className="text-destructive text-sm">{specificUsersError.message}</p>
                                  </div>
                                ) : specificUsers.length === 0 ? (
                                  specificUserSearchTerm === debouncedSpecificUserSearchTerm ? (
                                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                                      No users found.
                                    </div>
                                  ) : null
                                ) : (
                                  <ComboboxList>
                                    {specificUsers.map((user) => (
                                      <ComboboxItem
                                        key={user.id}
                                        value={user}
                                      >
                                        <div className="min-w-0">
                                          <p className="truncate font-medium">
                                            {user.first_name} {user.middle_name ?? ""} {user.last_name}
                                          </p>
                                          <p className="truncate text-muted-foreground text-xs">
                                            {user.email}
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
                        {errors.owner_id && (
                          <FieldError>{errors.owner_id.message}</FieldError>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Field>
            <Field>
              {searchType !== "folder" && (
                <Field>
                  <div className="flex items-center gap-4">
                    <FieldLabel className="w-30">Classification</FieldLabel>
                    <div className="flex-1">
                      <Controller
                        name="classification"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? "any"}
                            onValueChange={(value) => {
                              field.onChange(
                                value === "any" ? null : value,
                              );
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                <p>
                                  {field.value != null
                                    ? classifications.find(
                                      (c) => c.id === field.value,
                                    )?.name
                                    : "Any"}
                                </p>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {isClassificationsLoading ? (
                                <div className="flex items-center justify-center py-4">
                                  <Spinner className="text-primary size-5" />
                                </div>
                              ) : isClassificationsError &&
                                classificationsError ? (
                                <div className="py-4 flex items-center justify-center">
                                  <p className="text-destructive text-sm">
                                    {classificationsError.message}
                                  </p>
                                </div>
                              ) : (
                                <SelectGroup>
                                  <SelectItem value="any">Any</SelectItem>
                                  {classifications.map((classification) => (
                                    <SelectItem
                                      key={classification.id}
                                      value={classification.id}
                                    >
                                      {classification.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                  {errors.classification && (
                    <FieldError>{errors.classification.message}</FieldError>
                  )}
                </Field>
              )}
            </Field>
            <Field>
              <div className="flex items-center gap-4">
                <FieldLabel htmlFor="itemName" className="w-30">
                  Item name
                </FieldLabel>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex-1">
                    <Controller
                      name="itemName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id={field.name}
                          type="text"
                          placeholder="Enter a term that matches part of the file name"
                          onChange={(e) => {
                            setDraftSearchTerm(e.target.value);
                            field.onChange(e.target.value);
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.itemName && (
                    <FieldError>{errors.itemName.message}</FieldError>
                  )}
                </div>
              </div>
            </Field>
            <Field>
              <div className="flex items-center gap-4">
                <FieldLabel className="w-30">
                  Shared to
                </FieldLabel>
                <div className="flex-1 flex flex-col gap-1 w-full relative">
                  <div className="flex-1">
                    <Controller
                      name="shared_to"
                      control={control}
                      render={({ field }) => (
                        <Combobox
                          filter={null}
                          items={sharedToUsers}
                          multiple
                          value={selectedSharedToUser ? [selectedSharedToUser] : []}
                          onValueChange={(users) => {
                            const user = users.length > 0 ? users[users.length - 1] : null;
                            setSelectedSharedToUser(user);
                            field.onChange(user ? user.id : null);
                            if (user) setSharedToUserSearchTerm("");
                          }}
                          inputValue={sharedToUserSearchTerm}
                          onInputValueChange={(val) => {
                            setSharedToUserSearchTerm(val);
                            if (val.trim().length > 0 && !selectedSharedToUser) {
                              setIsSharedToDropdownOpen(true);
                            } else {
                              setIsSharedToDropdownOpen(false);
                            }
                          }}
                          itemToStringValue={(user) =>
                            `${user.first_name} ${user.last_name} ${user.email}`
                          }
                          open={isSharedToDropdownOpen}
                          onOpenChange={(isOpen) => {
                            if (isOpen && (sharedToUserSearchTerm.trim().length === 0 || selectedSharedToUser)) return;
                            setIsSharedToDropdownOpen(isOpen);
                          }}
                        >
                          <ComboboxChips ref={sharedToAnchor} className="w-full">
                            <ComboboxValue>
                              {selectedSharedToUser && (
                                <ComboboxChip key={selectedSharedToUser.id}>
                                  {selectedSharedToUser.first_name}{" "}
                                  {selectedSharedToUser.middle_name ?? ""}{" "}
                                  {selectedSharedToUser.last_name}
                                </ComboboxChip>
                              )}
                            </ComboboxValue>
                            <ComboboxChipsInput
                              readOnly={!!selectedSharedToUser}
                              placeholder={
                                selectedSharedToUser ? "" : "Search user..."
                              }
                            />
                          </ComboboxChips>
                          <ComboboxContent anchor={sharedToAnchor} className="w-(--anchor-width)">
                            {sharedToUserSearchTerm.trim().length === 0 ? null : isSharedToUsersLoading || isSharedToUsersFetching ? (
                              <div className="flex items-center justify-center p-4">
                                <Spinner className="text-primary size-5" />
                              </div>
                            ) : isSharedToUsersError && sharedToUsersError ? (
                              <div className="flex items-center justify-center p-4">
                                <p className="text-destructive text-sm">{sharedToUsersError.message}</p>
                              </div>
                            ) : sharedToUsers.length === 0 ? (
                              sharedToUserSearchTerm === debouncedSharedToSearchTerm ? (
                                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                                  No users found.
                                </div>
                              ) : null
                            ) : (
                              <ComboboxList>
                                {sharedToUsers.map((user) => (
                                  <ComboboxItem
                                    key={user.id}
                                    value={user}
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate font-medium">
                                        {user.first_name} {user.middle_name ?? ""} {user.last_name}
                                      </p>
                                      <p className="truncate text-muted-foreground text-xs">
                                        {user.email}
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
                  {errors.shared_to && (
                    <FieldError>{errors.shared_to.message}</FieldError>
                  )}
                </div>
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({
                  type: null,
                  itemName: "",
                  classification: null,
                  owner: null,
                  owner_id: null,
                  shared_to: null,
                });
                setSpecificUserSearchTerm("");
                setSelectedUser(null);
                setSharedToUserSearchTerm("");
                setSelectedSharedToUser(null);
              }}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Search
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
