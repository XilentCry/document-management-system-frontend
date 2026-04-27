import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useReinviteAdmin } from "@/features/users/api/mutations";
import { useCurrentUser } from "@/features/auth/api/me-queries";
import { TUser } from "@/features/users/types/user";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserStatusBadgeClass } from "@/lib/get-status-badge-class";


export function UserTable({ users }: { users: TUser[] }) {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const userRole = currentUser?.role;

  const { mutateAsync: reinviteAdminMutation, isPending } = useReinviteAdmin();

  const handleReinvite = async (id: string) => {
    await reinviteAdminMutation(id);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date created</TableHead>
          <TableHead>Date modified</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {user.first_name} {user.middle_name} {user.last_name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{user.role}</Badge>
            </TableCell>
            <TableCell>
              <Badge className={getUserStatusBadgeClass(user.status)}>
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>{user.created_at}</TableCell>
            <TableCell>{user.updated_at}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="icon-sm" />}
                >
                  <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/admin/user-management/view/${user.id}`)
                      }
                    >
                      View
                    </DropdownMenuItem>
                    {!(userRole === "admin" && user.role === "admin") && (
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/user-management/edit/${user.id}`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                    )}
                    {userRole === "superuser" && user.role === "admin" && (
                      <DropdownMenuItem
                        onClick={() => handleReinvite(user.id)}
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Spinner />
                            Reinviting...
                          </>
                        ) : (
                          "Reinvite"
                        )}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
