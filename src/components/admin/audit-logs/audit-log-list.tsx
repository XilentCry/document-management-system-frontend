"use client";

import { EmptyState } from "@/components/shared/empty-state";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllAuditLogs } from "@/services/audit-logs/queries";
import { Activity, Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Spinner } from "../../ui/spinner";
import { AuditLogTable } from "./audit-log-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function AuditLogList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: auditLogs,
    isPlaceholderData,
  } = useGetAllAuditLogs(page, debouncedSearchTerm);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Search audit logs..."
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
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="text-primary size-9" />
        </div>
      ) : isError && error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive text-sm">{error.message}</p>
        </div>
      ) : isSuccess && auditLogs?.data.length === 0 ? (
        debouncedSearchTerm ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm">No audit logs found.</p>
          </div>
        ) : (
          <EmptyState
            icon={Activity}
            title="No audit logs yet"
            description="User actions will be recorded and shown here."
          />
        )
      ) : (
        <>
          <AuditLogTable auditLogs={auditLogs?.data ?? []} />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((old) => Math.max(old - 1, 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              {auditLogs?.meta.links
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
                    if (!isPlaceholderData && auditLogs?.links.next) {
                      setPage((old) => old + 1);
                    }
                  }}
                  disabled={isPlaceholderData || !auditLogs?.links.next}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
