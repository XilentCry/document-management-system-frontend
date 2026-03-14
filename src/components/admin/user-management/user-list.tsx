"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllUsers } from "@/services/users/queries";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Spinner } from "../../ui/spinner";
import { UserTable } from "./user-table";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { InviteAdminDialog } from "./invite-admin-dialog";
import { useUserStore } from "@/stores/user-store";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

export function UserList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [openInviteAdminDialog, setOpenInviteAdminDialog] = useState(false);

  const userRole = useUserStore((state) => state.userRole);

  const {
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess,
    data: users,
    isPlaceholderData,
  } = useGetAllUsers(page, debouncedSearchTerm);

  return (
    <div className="flex-1 flex flex-col gap-4">
      {userRole === "superuser" && (
        <div className="flex items-center gap-2">
          <InputGroup>
            <InputGroupInput
              placeholder="Search users..."
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
          <Button onClick={() => setOpenInviteAdminDialog(true)}>
            <Plus />
            Invite Admin
          </Button>
        </div>
      )}

      {isLoading || isFetching ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="text-primary size-9" />
        </div>
      ) : isError && error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive text-sm">{error.message}</p>
        </div>
      ) : isSuccess && users?.data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm">No users found.</p>
        </div>
      ) : (
        <>
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
                    if (!isPlaceholderData && users?.links.next) {
                      setPage((old) => old + 1);
                    }
                  }}
                  disabled={isPlaceholderData || !users?.links.next}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}

      <InviteAdminDialog
        openInviteAdminDialog={openInviteAdminDialog}
        setOpenInviteAdminDialog={setOpenInviteAdminDialog}
      />
    </div>
  );
}
