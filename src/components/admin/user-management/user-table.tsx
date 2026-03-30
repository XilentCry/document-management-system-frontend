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
import { useReinviteAdmin } from "@/services/users/mutations";
import { useUserStore } from "@/stores/user-store";
import { TUser } from "@/types/user";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserTable({ users }: { users: TUser[] }) {
  const router = useRouter();
  const userRole = useUserStore((state) => state.userRole);

  console.log(users);

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
          <TableHead>Created</TableHead>
          <TableHead>Modified</TableHead>
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
              <Badge
                className={`${user.status === "pending"
                    ? "bg-amber-500/15 dark:bg-amber-500/10 text-amber-500"
                    : user.status === "approved" &&
                    "bg-green-500/15 dark:bg-green-500/10 text-green-500"
                  }`}
              >
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
                    {userRole === "superuser" && (
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
