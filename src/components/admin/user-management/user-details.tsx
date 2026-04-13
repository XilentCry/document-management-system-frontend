import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateStatus } from "@/services/users/mutations";
import { useGetStatuses } from "@/services/users/queries";
import { useCurrentUser } from "@/services/user/queries";
import { TOrganizationUnitBase } from "@/types/organization-unit-base";
import { TUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { UserAuditLogs } from "./user-audit-logs";

export function UserDetails({
  user,
}: {
  user: TUser & {
    organizationUnits: TOrganizationUnitBase[];
  };
}) {
  const [status, setStatus] = useState(user.status);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  const userRole = currentUser?.role;

  const isAdminViewingAdmin = userRole === "admin" && user.role === "admin";

  const { mutateAsync: updateStatusMutation, isPending } =
    useUpdateStatus(setStatus);

  const { data: statusesData } = useGetStatuses();

  const handleApprove = async () => {
    setIsOpen(false);

    if (!statusesData?.statuses?.length) {
      toast.error("Statuses are still loading. Please try again.");
      return;
    }

    const nextStatus: "pending" | "approved" =
      status === "approved" ? "pending" : "approved";

    const statusId = statusesData?.statuses?.find(
      (s) => s.name.toLowerCase() === nextStatus,
    )?.id;

    if (!statusId) {
      toast.error("Could not resolve status id. Please try again.");
      return;
    }

    await updateStatusMutation({ userId: user.id, statusId, nextStatus });
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
                <Badge
                  className={`${
                    user.status === "pending"
                      ? "bg-amber-500/15 dark:bg-amber-500/10 text-amber-500"
                      : user.status === "approved" &&
                        "bg-green-500/15 dark:bg-green-500/10 text-green-500"
                  }`}
                >
                  {user.status}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Date modified</p>
                <p>{user.updated_at}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 text-sm">
            {user.organizationUnits.length > 0 && (
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
            )}
          </div>
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
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger render={<Button variant={status === "approved" ? "destructive" : "default"} />}>
                {isPending ? (
                  <>
                    <Spinner />
                    Processing...
                  </>
                ) : status === "approved" ? (
                  "Unapprove"
                ) : (
                  "Approve"
                )}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <div className="flex flex-col gap-1">
                    <AlertDialogTitle>
                      {status === "approved"
                        ? "Confirm Unapporval"
                        : "Confirm Approval"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {status === "approved"
                        ? "Are you sure you want to unapprove this user?"
                        : "Are you sure you want to approve this user?"}
                    </AlertDialogDescription>
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApprove}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <UserAuditLogs userId={user.id} />
    </div>
  );
}
