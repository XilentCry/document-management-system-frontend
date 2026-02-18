"use client";

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TAdvancedSearchFormSchema } from "@/schemas/items/advanced-search-form-schema";
import { CLASSIFICATIONS } from "@/lib/constants";
import { FileText, Folder } from "lucide-react";
import { Controller, SubmitHandler, useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

type AdvanceSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<TAdvancedSearchFormSchema>;
  onSubmit: SubmitHandler<TAdvancedSearchFormSchema>;
  setDraftSearchTerm: (value: string) => void;
};

export function AdvanceSearchDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  setDraftSearchTerm,
}: AdvanceSearchDialogProps) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const searchType = useWatch({ control, name: "type", defaultValue: null });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-150 max-w-150!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Advance search</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <div className="flex items-center gap-4">
                <FieldLabel className="w-30">Type</FieldLabel>
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
              </div>
              {errors.type && <FieldError>{errors.type.message}</FieldError>}
            </Field>
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
                                  ? CLASSIFICATIONS[field.value]
                                  : "Any"}
                              </p>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="any">Any</SelectItem>
                              {Object.entries(CLASSIFICATIONS).map(
                                ([id, label]) => (
                                  <SelectItem key={id} value={id}>
                                    {label}
                                  </SelectItem>
                                ),
                              )}
                            </SelectGroup>
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
