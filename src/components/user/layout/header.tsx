"use client";

import { EmptyState } from "@/components/shared/empty-state";
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { AdvancedSearchDialog } from "@/components/user/shared/advanced-search-dialog";
import { DocumentViewer } from "@/components/user/shared/document-viewer";
import { useDebounce } from "@/hooks/use-debounce";
import {
  advancedSearchFormSchema,
  TAdvancedSearchFormSchema,
} from "@/schemas/items/advanced-search-form-schema";
import { useSearchTopOrganizationUnitItems } from "@/services/organization-units/queries";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useSearchStore } from "@/stores/search-store";
import { TFilterOwner } from "@/types/filter-owner";
import { TFilterType } from "@/types/filter-type";
import { TItem } from "@/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CornerDownLeft,
  FileText,
  Folder,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function Header() {
  "use no memo";

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TItem | null>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (searchOpen) {
      const id = setTimeout(() => {
        searchFormRef.current
          ?.querySelector<HTMLInputElement>("input")
          ?.focus();
      }, 0);
      return () => clearTimeout(id);
    }
  }, [searchOpen]);

  const currentOrganizationUnitName = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitName,
  );
  const currentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const draftSearchTerm = useSearchStore((state) => state.draftSearchTerm);
  const debouncedSearchTerm = useDebounce(draftSearchTerm, 500);
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
  const filterOwnerParam = searchParams.get("owner");
  const filterOwner: TFilterOwner =
    filterOwnerParam === "me" ||
      filterOwnerParam === "not_me" ||
      filterOwnerParam === "user"
      ? filterOwnerParam
      : null;
  const filterOwnerIdParam = searchParams.get("owner_id");

  const { data: topItems, isLoading: isLoadingTopItems, isError: isErrorTopItems, error: errorTopItems } =
    useSearchTopOrganizationUnitItems(
      currentOrganizationUnitId,
      debouncedSearchTerm,
      filterType,
      filterClassification ? Number(filterClassification) : null,
      filterOwner,
      filterOwnerIdParam ? Number(filterOwnerIdParam) : null,
    );

  const handleSearch = () => {
    const trimmedDraftSearchTerm = draftSearchTerm.trim();
    if (!trimmedDraftSearchTerm) return;

    searchFormRef.current?.querySelector<HTMLInputElement>("input")?.blur();

    setSearchOpen(false);
    const url = `/drive/search?q=${encodeURIComponent(trimmedDraftSearchTerm)}${filterType ? `&type=${filterType}` : ""
      }${filterClassification && filterType !== "folder"
        ? `&classification=${filterClassification}`
        : ""
      }${filterOwner ? `&owner=${filterOwner}` : ""}${filterOwner === "user" && filterOwnerIdParam
        ? `&owner_id=${filterOwnerIdParam}`
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
      owner: filterOwner,
      owner_id:
        filterOwner === "user" && filterOwnerIdParam
          ? Number(filterOwnerIdParam)
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
      owner: null,
      owner_id: null,
    },
  });

  const { reset } = form;

  const onSubmit: SubmitHandler<TAdvancedSearchFormSchema> = (data) => {
    const url = `/drive/search?q=${encodeURIComponent(data.itemName)}${data.type ? `&type=${data.type}` : ""
      }${data.classification && data.type !== "folder"
        ? `&classification=${data.classification}`
        : ""
      }${data.owner ? `&owner=${data.owner}` : ""}${data.owner === "user" && data.owner_id ? `&owner_id=${data.owner_id}` : ""
      }`;

    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <header className="z-10 bg-background sticky top-0 h-14 border-b flex items-center justify-between px-4">
        <form
          ref={searchFormRef}
          className="focus-visible:outline-none"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger
              render={<ButtonGroup className="w-2xl focus-visible:outline-none" />}
              nativeButton={false}
            >
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchOpen(false);
                  handleSearch();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                type="button"
              >
                <Search />
              </Button>
              <InputGroup>
                <InputGroupInput
                  placeholder={`Search in ${currentOrganizationUnitName ?? "Organizational Drive"}`}
                  className="truncate"
                  value={draftSearchTerm}
                  onChange={(e) => {
                    setDraftSearchTerm(e.target.value);
                    if (!searchOpen) setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  autoComplete="off"
                />
                {draftSearchTerm && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDraftSearchTerm("");
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      type="button"
                    >
                      <X />
                    </InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchOpen(false);
                  handleOpen();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                type="button"
              >
                <SlidersHorizontal />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--anchor-width) min-h-60.75" autoFocus={false}>
              {isLoadingTopItems ? (
                <div className="flex-1 flex items-center justify-center">
                  <Spinner className="text-primary size-9" />
                </div>
              ) : isErrorTopItems && errorTopItems ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-destructive">
                    {errorTopItems.message}
                  </p>
                </div>
              ) : topItems && topItems.length > 0 ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1">
                    {topItems.map((item) => (
                      <Item
                        key={item.id}
                        size="xs"
                        className="hover:bg-muted rounded-none cursor-pointer"
                        onClick={() => {
                          setSearchOpen(false);
                          if (item.is_folder) {
                            router.push(`/drive/folders/${item.id}`);
                          } else {
                            setSelectedDocument(item);
                          }
                        }}
                      >
                        <ItemMedia variant="icon">
                          {item.is_folder ? (
                            <Folder className="size-4" />
                          ) : (
                            <FileText className="size-4" />
                          )}
                        </ItemMedia>
                        <ItemContent className="min-w-0">
                          <ItemTitle className="block w-auto truncate">
                            {item.name}
                          </ItemTitle>
                          <ItemDescription>
                            {item.owner.first_name} {item.owner.middle_name ?? ""}{" "}
                            {item.owner.last_name}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <span className="text-muted-foreground">{item.updated_at}</span>
                        </ItemActions>
                      </Item>
                    ))}
                  </div>
                  <div className="flex justify-between w-full">
                    <Button
                      variant="ghost"
                      type="button"
                      className="text-primary hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchOpen(false);
                        handleOpen();
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      Advanced search
                    </Button>
                    <Button
                      variant="ghost"
                      type="button"
                      className="text-primary hover:text-primary"
                      onClick={handleSearch}
                    >
                      <CornerDownLeft />
                      All results
                    </Button>
                  </div>
                </div>
              ) : debouncedSearchTerm ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm">No results found.</p>
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title="Type to start searching"
                  description="Top search results will appear here."
                />
              )}
            </PopoverContent>
          </Popover>
        </form>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <LogoutButton />
        </div>
      </header>

      <AdvancedSearchDialog
        open={open}
        onOpenChange={setOpen}
        form={form}
        onSubmit={onSubmit}
        setDraftSearchTerm={setDraftSearchTerm}
      />

      {selectedDocument && (
        <DocumentViewer
          openDocumentViewer={!!selectedDocument}
          setOpenDocumentViewer={(val) => {
            if (!val) setSelectedDocument(null);
          }}
          document={selectedDocument}
        />
      )}
    </>
  );
}
