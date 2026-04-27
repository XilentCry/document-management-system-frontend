"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllOrganizationUnitsFlat } from "@/features/organization-units/api/queries";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus, Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { OrganizationUnitTable } from "./organization-unit-table";
import { Button } from "@/components/ui/button";
import { NewOrganizationUnitDialog } from "./new-organization-unit-dialog";

export function OrganizationUnitList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [openNewOrganizationUnitDialog, setOpenNewOrganizationUnitDialog] = useState(false);

  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: organizationUnits,
    isPlaceholderData,
  } = useGetAllOrganizationUnitsFlat(page, debouncedSearchTerm);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Search organization units..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={() => setOpenNewOrganizationUnitDialog(true)}><Plus />New Organization Unit</Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="text-primary size-9" />
        </div>
      ) : isError && error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive text-sm">{error.message}</p>
        </div>
      ) : isSuccess && organizationUnits?.data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm">No organization units found.</p>
        </div>
      ) : (
        <>
          <OrganizationUnitTable
            organizationUnits={organizationUnits?.data ?? []}
          />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((old) => Math.max(old - 1, 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              {organizationUnits?.meta.links
                .filter(
                  (link) =>
                    !link.label.includes("Previous") &&
                    !link.label.includes("Next"),
                )
                .map((link) => (
                  <PaginationLink
                    key={link.label}
                    onClick={() => {
                      if (link.url) {
                        const pageParam = new URL(link.url).searchParams.get(
                          "page",
                        );
                        setPage(Number(pageParam));
                      }
                    }}
                    isActive={link.active}
                  >
                    {link.label}
                  </PaginationLink>
                ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (!isPlaceholderData && organizationUnits?.links.next) {
                      setPage((old) => old + 1);
                    }
                  }}
                  disabled={isPlaceholderData || !organizationUnits?.links.next}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}

      <NewOrganizationUnitDialog
        openNewOrganizationUnitDialog={openNewOrganizationUnitDialog}
        setOpenNewOrganizationUnitDialog={setOpenNewOrganizationUnitDialog}
      />
    </div>
  );
}
