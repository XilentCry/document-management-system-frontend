import { AuditLogTable } from "@/features/audit-logs/components/audit-log-table";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserAuditLogs } from "@/features/users/api/queries";
import { Activity } from "lucide-react";
import { useState } from "react";

export function UserAuditLogs({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);

  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: userAuditLogs,
    isPlaceholderData,
  } = useGetUserAuditLogs(userId, page);

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-xl">Audit Logs</h1>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <Spinner className="text-primary size-9" />
          </div>
        ) : isError && error ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <p className="text-destructive text-sm">{error.message}</p>
          </div>
        ) : isSuccess && userAuditLogs?.data.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No audit logs yet"
            description="User actions will be recorded and shown here."
          />
        ) : (
          <AuditLogTable auditLogs={userAuditLogs?.data ?? []} />
        )}
      {isSuccess && userAuditLogs?.data && userAuditLogs.data.length > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((old) => Math.max(old - 1, 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              {userAuditLogs?.meta.links
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
                    if (!isPlaceholderData && userAuditLogs?.links.next) {
                      setPage((old) => old + 1);
                    }
                  }}
                  disabled={isPlaceholderData || !userAuditLogs?.links.next}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
      )}
    </div>
  );
}
