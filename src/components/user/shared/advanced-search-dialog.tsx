"use client";

import { Button } from "@/components/ui/button";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TAdvancedSearchFormSchema } from "@/schemas/items/advanced-search-form-schema";
import { useGetAllClassifications } from "@/services/classifications/queries";
import { useGetSpecificUsers } from "@/services/organization-units/queries";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { ChevronsUpDown, FileText, Folder } from "lucide-react";
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

  const {
    isLoading: isClassificationsLoading,
    isError: isClassificationsError,
    error: classificationsError,
    data: classifications = [],
  } = useGetAllClassifications();

  const {
    isLoading: isSpecificUsersLoading,
    isError: isSpecificUsersError,
    error: specificUsersError,
    specificUsers = [],
  } = useGetSpecificUsers(currentOrganizationUnitId);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const searchType = useWatch({ control, name: "type", defaultValue: null });
  const searchOwner = useWatch({ control, name: "owner", defaultValue: null });

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
                                <FileText />
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
                      <>
                        <Controller
                          name="owner_id"
                          control={control}
                          render={({ field }) => {
                            const selectedUser = specificUsers.find(
                              (u) => u.id === field.value,
                            );

                            return (
                              <Popover>
                                <PopoverTrigger
                                  render={
                                    <Button
                                      variant="outline"
                                      className="justify-between"
                                    />
                                  }
                                >
                                  <span className="truncate">
                                    {selectedUser
                                      ? `${selectedUser.first_name} ${selectedUser.middle_name ?? ""} ${selectedUser.last_name}`
                                      : "Select user..."}
                                  </span>
                                  <ChevronsUpDown />
                                </PopoverTrigger>
                                <PopoverContent className="w-(--anchor-width)">
                                  <Command>
                                    <CommandInput placeholder="Search user..." />
                                    <CommandList>
                                      {isSpecificUsersLoading ? (
                                        <div className="flex items-center justify-center py-4">
                                          <Spinner className="text-primary" />
                                        </div>
                                      ) : isSpecificUsersError &&
                                        specificUsersError ? (
                                        <div className="py-4 flex items-center justify-center">
                                          <p className="text-destructive text-sm">
                                            {specificUsersError.message}
                                          </p>
                                        </div>
                                      ) : (
                                        <>
                                          <CommandEmpty>
                                            No users found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {specificUsers.map((user) => (
                                              <CommandItem
                                                key={user.id}
                                                onSelect={() =>
                                                  field.onChange(user.id)
                                                }
                                              >
                                                <div className="min-w-0">
                                                  <p className="truncate">
                                                    {user.first_name}{" "}
                                                    {user.middle_name ?? ""}{" "}
                                                    {user.last_name}
                                                  </p>
                                                  <p className="truncate text-muted-foreground">
                                                    {user.email}
                                                  </p>
                                                </div>
                                              </CommandItem>
                                            ))}
                                          </CommandGroup>
                                        </>
                                      )}
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            );
                          }}
                        />
                        {errors.owner_id && (
                          <FieldError>{errors.owner_id.message}</FieldError>
                        )}
                      </>
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
                            value={field.value?.toString() ?? "any"}
                            onValueChange={(value) => {
                              field.onChange(
                                value === "any" ? null : Number(value),
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
                                  <Spinner className="text-primary" />
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
                                      value={classification.id.toString()}
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
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                reset({
                  type: null,
                  itemName: "",
                  classification: null,
                  owner: null,
                  owner_id: null,
                })
              }
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
