import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateStatus } from "@/services/users/mutations";
import { useGetStatuses } from "@/services/users/queries";
import { useCurrentUser } from "@/services/user/queries";
import { TOrganizationUnitBase } from "@/types/organization-unit-base";
import { TUser } from "@/types/user";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { UserAuditLogs } from "./user-audit-logs";
import { TUserStatus } from "@/types/user-status";
import { getStatusBadgeClass } from "@/lib/get-status-badge-class";


export function UserDetails({
  user,
}: {
  user: TUser & {
    organizationUnits: TOrganizationUnitBase[];
  };
}) {
  const [status, setStatus] = useState<TUserStatus>(user.status);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TUserStatus | null>(null);
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  const userRole = currentUser?.role;

  const isAdminViewingAdmin = userRole === "admin" && user.role === "admin";

  const { mutateAsync: updateStatusMutation, isPending } =
    useUpdateStatus(setStatus);

  const { data: statusesData } = useGetStatuses();

  const handleStatusChange = (newStatus: TUserStatus) => {
    if (newStatus === status) return;
    setPendingStatus(newStatus);
    setIsOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    setIsOpen(false);

    if (!pendingStatus) return;

    await updateStatusMutation({
      userId: user.id,
      status: pendingStatus,
      nextStatus: pendingStatus,
    });

    setPendingStatus(null);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 flex text-sm">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-medium">First name</p>
                <p>{user.first_name}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Last name</p>
                <p>{user.last_name}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Role</p>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Date created</p>
                <p>{user.created_at}</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-medium">Middle name</p>
                <p>{user.middle_name ?? "N/A"}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Email address</p>
                <p>{user.email}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Status</p>
                <Badge className={getStatusBadgeClass(status)}>
                  {status}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Date modified</p>
                <p>{user.updated_at}</p>
              </div>
            </div>
          </div>
          {user.organizationUnits.length > 0 && (<div className="flex-1 text-sm">
            <div className="flex flex-col gap-1">
              <p className="font-medium">Offices/Units</p>
              <div className="flex flex-col gap-1">
                {user.organizationUnits.map((organizationUnit) => (
                  <Item key={organizationUnit.id} variant="outline" size="xs">
                    <ItemContent>
                      <ItemTitle>{organizationUnit.name}</ItemTitle>
                    </ItemContent>
                  </Item>
                ))}
              </div>
            </div>
          </div>)}
        </div>
        <div className="flex gap-2">
          {!isAdminViewingAdmin && (
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/admin/user-management/edit/${user.id}`)
              }
            >
              Edit
            </Button>
          )}
          {user.id !== userId && !isAdminViewingAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    disabled={isPending}
                  />
                }
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Updating...
                  </>
                ) : (
                  <>
                    Change Status
                    <ChevronDown />
                  </>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statusesData?.statuses
                  .filter((s) => s.value !== status)
                  .map((s) => (
                    <DropdownMenuItem
                      key={s.value}
                      onClick={() => handleStatusChange(s.value as TUserStatus)}
                    >
                      <span className="capitalize">{s.label}</span>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex flex-col gap-1">
              <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change this user&apos;s status to{" "}
                <span className="font-semibold capitalize">
                  {pendingStatus}
                </span>
                ?
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserAuditLogs userId={user.id} />
    </div>
  );
}
