"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetAllAuditLogs } from "@/services/audit-logs/queries";
import { useState } from "react";
import { Spinner } from "../../ui/spinner";
import { AuditLogTable } from "./audit-log-table";

export function AuditLogList() {
  const [page, setPage] = useState(1);

  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: auditLogs,
    isPlaceholderData,
  } = useGetAllAuditLogs(page);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="text-primary size-9" />
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-destructive text-sm">{error.message}</p>
      </div>
    );
  }

  return isSuccess && auditLogs?.data.length === 0 ? (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-sm">No audit logs found.</p>
    </div>
  ) : (
    <ScrollArea>
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
    </ScrollArea>
  );
}
