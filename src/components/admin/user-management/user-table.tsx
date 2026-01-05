import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllStatuses } from "@/services/statuses/queries";
import { useUpdateStatus } from "@/services/users/mutations";
import { TUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserTable({ users }: { users: TUser[] }) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const {
    isLoading,
    isError,
    error,
    data: statuses = [],
  } = useGetAllStatuses();
  const { mutateAsync: updateStatus, isPending } = useUpdateStatus();

  const router = useRouter();

  const handleUpdateStatus = async (userId: number, statusId: number) => {
    await updateStatus({ userId, statusId });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            onClick={() =>
              router.push(`/admin/user-management/review/${user.id}`)
            }
          >
            <TableCell>
              {user.first_name} {user.middle_name} {user.last_name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{user.role}</Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Badge
                    className={`${
                      user.status === "Pending"
                        ? "bg-amber-500/15 dark:bg-amber-500/10 text-amber-500"
                        : user.status === "Approved"
                        ? "bg-green-500/15 dark:bg-green-500/10 text-green-500"
                        : "bg-red-500/10 dark:bg-red-500/20 text-red-500"
                    }`}
                  >
                    {user.status}
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <Spinner className="text-primary" />
                    </div>
                  ) : isError && error ? (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-destructive text-sm">
                        {error.message}
                      </p>
                    </div>
                  ) : (
                    statuses.map((status) => (
                      <DropdownMenuItem
                        disabled={isPending && selectedStatus === status.name}
                        key={status.id}
                        onClick={() => {
                          handleUpdateStatus(user.id, status.id);
                          setSelectedStatus(status.name);
                        }}
                      >
                        {status.name}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
            <TableCell>{new Date(user.updated_at).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
