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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { STATUSES } from "@/lib/constants";
import { useUpdateStatus } from "@/services/users/mutations";
import { TOrganizationUnit } from "@/types/organization-unit";
import { TUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ViewUser({
  user,
}: {
  user: TUser & {
    organizationUnits: Pick<TOrganizationUnit, "id" | "name">[];
  };
}) {
  const [status, setStatus] = useState(user.status);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const { mutateAsync: updateStatusMutation, isPending } =
    useUpdateStatus(setStatus);

  const handleApprove = async () => {
    setIsOpen(false);

    const statusId =
      user.status === "Approved" ? STATUSES.PENDING : STATUSES.APPROVED;

    await updateStatusMutation({ userId: user.id, statusId });
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="grid grid-cols-2 text-sm">
        <div className="flex gap-6">
          <div className="flex flex-col gap-3">
            <p className="font-medium">Name</p>
            <p className="font-medium">Email</p>
            <p className="font-medium">Role</p>
            <p className="font-medium">Status</p>
            <p className="font-medium">Created</p>
            <p className="font-medium">Updated</p>
          </div>
          <div className="flex flex-col gap-3">
            <p>
              {user.first_name} {user.middle_name} {user.last_name}
            </p>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <p>{user.status}</p>
            <p>{new Date(user.created_at).toLocaleString()}</p>
            <p>{new Date(user.updated_at).toLocaleString()}</p>
          </div>
        </div>
        {user.role === "User" && (
          <div className="flex flex-col gap-3">
            <p className="font-medium">Offices/Units</p>
            <div className="flex flex-col gap-1">
              {user.organizationUnits.map((organizationUnit) => (
                <p key={organizationUnit.id}>{organizationUnit.name}</p>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/user-management/edit/${user.id}`)}
        >
          Edit
        </Button>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            {isPending ? (
              <>
                <Spinner />
                Processing...
              </>
            ) : status === "Approved" ? (
              "Unapprove"
            ) : (
              "Approve"
            )}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex flex-col gap-1">
                <AlertDialogTitle>
                  {status === "Approved"
                    ? "Confirm Unapporval"
                    : "Confirm Approval"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {status === "Approved"
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
      </div>
    </div>
  );
}
