"use client";

import { LogoutButton } from "@/components/shared/logout-button";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AdvanceSearchDialog } from "@/components/user/shared/advance-search-dialog";
import {
  advancedSearchFormSchema,
  TAdvancedSearchFormSchema,
} from "@/schemas/items/advanced-search-form-schema";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useSearchStore } from "@/stores/search-store";
import { TFilterType } from "@/types/filter-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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

  const router = useRouter();
  const searchParams = useSearchParams();

  const filterTypeParam = searchParams.get("type");
  const filterType: TFilterType =
    filterTypeParam === "file" || filterTypeParam === "folder"
      ? filterTypeParam
      : null;
  const filterClassification = searchParams.get("classification");

  const handleSearch = () => {
    const trimmedDraftSearchTerm = draftSearchTerm.trim();

    if (!trimmedDraftSearchTerm) return;

    const url = `/drive/search?q=${encodeURIComponent(trimmedDraftSearchTerm)}${
      filterType ? `&type=${filterType}` : ""
    }${
      filterClassification && filterType !== "folder"
        ? `&classification=${filterClassification}`
        : ""
    }`;

    router.push(url);
  };

  const handleOpen = () => {
    reset({
      type: filterType,
      itemName: draftSearchTerm,
      classification: filterClassification
        ? Number(filterClassification)
        : null,
    });
    setOpen(true);
  };

  const form = useForm<TAdvancedSearchFormSchema>({
    resolver: zodResolver(advancedSearchFormSchema),
    defaultValues: {
      type: null,
      itemName: "",
      classification: null,
    },
  });

  const { reset } = form;

  const onSubmit: SubmitHandler<TAdvancedSearchFormSchema> = (data) => {
    const url = `/drive/search?q=${encodeURIComponent(data.itemName)}${
      data.type ? `&type=${data.type}` : ""
    }${
      data.classification && data.type !== "folder"
        ? `&classification=${data.classification}`
        : ""
    }`;

    setOpen(false);
    router.push(url);
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
                autoComplete="off"
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

      <AdvanceSearchDialog
        open={open}
        onOpenChange={setOpen}
        form={form}
        onSubmit={onSubmit}
        setDraftSearchTerm={setDraftSearchTerm}
      />
    </>
  );
}
