"use client";

import { LogoutButton } from "@/components/shared/logout-button";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  advancedSearchFormSchema,
  TAdvancedSearchFormSchema,
} from "@/schemas/items/advanced-search-form-schema";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useSearchStore } from "@/stores/search-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { CLASSIFICATIONS } from "@/lib/constants";
import { FileText, Folder, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";

export function Header() {
  "use no memo";

  const [open, setOpen] = useState(false);

  const currentOrganizationUnitName = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitName,
  );
  const draftSearchTerm = useSearchStore((state) => state.draftSearchTerm);
  const setDraftSearchTerm = useSearchStore(
    (state) => state.setDraftSearchTerm,
  );
  const filterType = useSearchStore((state) => state.filterType);
  const filterClassification = useSearchStore(
    (state) => state.filterClassification,
  );
  const commitSearch = useSearchStore((state) => state.commitSearch);

  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = () => {
    const trimmedDraftSearchTerm = draftSearchTerm.trim();

    if (!trimmedDraftSearchTerm) return;

    const classification =
      filterType === "folder" ? null : filterClassification;
    commitSearch(trimmedDraftSearchTerm, filterType, classification);

    if (pathname !== "/drive/search") {
      router.push("/drive/search");
    }
  };

  const handleOpen = () => {
    reset({
      type: filterType,
      itemName: draftSearchTerm,
      classification: filterClassification,
    });
    setOpen(true);
  };

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<TAdvancedSearchFormSchema>({
    resolver: zodResolver(advancedSearchFormSchema),
    defaultValues: {
      type: null,
      itemName: "",
      classification: null,
    },
  });

  const searchType = useWatch({ control, name: "type", defaultValue: null });

  const onSubmit: SubmitHandler<TAdvancedSearchFormSchema> = (data) => {
    const classification = data.type === "folder" ? null : data.classification;
    commitSearch(data.itemName, data.type, classification);
    setOpen(false);

    if (pathname !== "/drive/search") {
      router.push("/drive/search");
    }
  };

  return (
    <>
      <header className="z-10 bg-background sticky top-0 h-14 border-b flex items-center justify-between px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <ButtonGroup className="w-2xl">
            <Button variant="outline" onClick={handleSearch} type="button">
              <Search />
            </Button>
            <InputGroup>
              <InputGroupInput
                placeholder={`Search in ${currentOrganizationUnitName ?? "Department Drive"}`}
                className="truncate"
                value={draftSearchTerm}
                onChange={(e) => setDraftSearchTerm(e.target.value)}
              />
              {draftSearchTerm && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    onClick={() => setDraftSearchTerm("")}
                    type="button"
                  >
                    <X />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
            <Button variant="outline" onClick={handleOpen} type="button">
              <SlidersHorizontal />
            </Button>
          </ButtonGroup>
        </form>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <LogoutButton />
        </div>
      </header>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-200 max-w-200!">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
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
                              {field.value === "folder" && (
                                <div className="flex items-center gap-2">
                                  <Folder />
                                  Folder
                                </div>
                              )}
                              {field.value === "file" && (
                                <div className="flex items-center gap-2">
                                  <FileText />
                                  File
                                </div>
                              )}
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
                                {field.value === null && <p>Any</p>}
                                {field.value != null && (
                                  <p>{CLASSIFICATIONS[field.value]}</p>
                                )}
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
    </>
  );
}
