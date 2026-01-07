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
import { useGetAllUsers } from "@/services/users/queries";
import { useState } from "react";
import { Spinner } from "../../ui/spinner";
import { UserTable } from "./user-table";

export function UserList() {
  const [page, setPage] = useState(1);

  const {
    isLoading,
    isError,
    error,
    data: users,
    isPlaceholderData,
  } = useGetAllUsers(page);

  if (isError && error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-destructive text-sm">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="text-primary size-9" />
      </div>
    );
  }

  return (
    <ScrollArea>
      <UserTable users={users?.data ?? []} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
            />
          </PaginationItem>
          {users?.meta.links
            .filter(
              (link) =>
                !link.label.includes("Previous") && !link.label.includes("Next")
            )
            .map((link) => (
              <PaginationLink
                key={link.label}
                onClick={() => {
                  if (link.url) {
                    const pageParam = new URL(link.url).searchParams.get(
                      "page"
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
                if (!isPlaceholderData && users?.links.next) {
                  setPage((old) => old + 1);
                }
              }}
              disabled={isPlaceholderData || !users?.links.next}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </ScrollArea>
  );
}
