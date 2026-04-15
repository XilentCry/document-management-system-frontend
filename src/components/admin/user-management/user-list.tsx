"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetAllUsers, useGetRoles, useGetStatuses } from "@/services/users/queries";
import { useCurrentUser } from "@/services/user/queries";
import { ChevronDown, Plus, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { Spinner } from "../../ui/spinner";
import { InviteAdminDialog } from "./invite-admin-dialog";
import { UserTable } from "./user-table";

export function UserList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [openInviteAdminDialog, setOpenInviteAdminDialog] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const { data: rolesData } = useGetRoles();
  const { data: statusesData } = useGetStatuses();

  const debouncedRoles = useDebounce(selectedRoles);
  const debouncedStatuses = useDebounce(selectedStatuses);

  const toggleFilter = useCallback((
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    setPage(1);
  }, []);

  const { data: currentUser } = useCurrentUser();
  const userRole = currentUser?.role;

  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: users,
    isPlaceholderData,
  } = useGetAllUsers(page, debouncedSearchTerm, debouncedRoles, debouncedStatuses);

  return (
    <div className="flex-1 flex flex-col gap-4">
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

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Role
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {rolesData?.roles.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role.id}
                  checked={selectedRoles.includes(role.name)}
                  onCheckedChange={() => toggleFilter(setSelectedRoles, role.name)}
                >
                  <span className="capitalize">{role.name}</span>
                </DropdownMenuCheckboxItem>
              ))}
              {userRole === "superuser" && !rolesData?.roles.some((r) => r.name === "superuser") && (
                <DropdownMenuCheckboxItem
                  checked={selectedRoles.includes("superuser")}
                  onCheckedChange={() => toggleFilter(setSelectedRoles, "superuser")}
                >
                  <span className="capitalize">Superuser</span>
                </DropdownMenuCheckboxItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Status
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusesData?.statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status.value}
                  checked={selectedStatuses.includes(status.value)}
                  onCheckedChange={() => toggleFilter(setSelectedStatuses, status.value)}
                >
                  <span className="capitalize">{status.label}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {userRole === "superuser" && (
            <Button onClick={() => setOpenInviteAdminDialog(true)}>
              <Plus />
              Invite Admin
            </Button>
          )}
        </div>

      {isLoading ? (
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
